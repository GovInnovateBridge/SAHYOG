import os
import json
import cv2
import tempfile
import asyncio
from typing import Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from PIL import Image
import google.generativeai as genai

# Setup API Router for FastAPI
router = APIRouter(prefix="/hardware", tags=["Hardware TRL Verification"])

# Configure Google Gemini API
# Assumes GEMINI_API_KEY is loaded in the environment variables (e.g., from .env)
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Use Gemini 2.5 Flash for Vision tasks (latest stable model available)
MODEL_NAME = "gemini-2.5-flash"

def clean_json_response(text: str) -> str:
    """Helper function to clean markdown formatting from Gemini JSON responses."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

async def verify_engineering_doc(image_path: str) -> Dict[str, Any]:
    """
    TRL 1-3 Document Scanner
    Analyzes an image to determine if it contains genuine CAD/PCB schematics.
    """
    try:
        # Load the image using PIL and copy it so we can close the file handle immediately
        with Image.open(image_path) as img:
            img_copy = img.copy()
        
        # Initialize the model
        model = genai.GenerativeModel(MODEL_NAME)
        
        prompt = """
        Act as an Engineering Auditor. Analyze this document. 
        Does it contain genuine technical schematics, PCB routing lines, or CAD geometry? 
        Or is it a generic marketing image or brochure?
        
        Return ONLY a raw JSON object with exactly two keys:
        - "verified": boolean (true if genuine engineering design doc, false if marketing/generic)
        - "confidence": float (between 0.0 and 1.0 indicating your confidence level)
        """
        
        # Generate content (using async generation if supported, otherwise thread offload)
        # We will wrap the synchronous generation in asyncio.to_thread for FastAPI concurrency
        response = await asyncio.to_thread(
            model.generate_content,
            [prompt, img_copy]
        )
        
        cleaned_text = clean_json_response(response.text)
        result = json.loads(cleaned_text)
        
        return {
            "verified": bool(result.get("verified", False)),
            "confidence": float(result.get("confidence", 0.0))
        }
        
    except Exception as e:
        raise Exception(f"Document verification failed: {str(e)}")

async def verify_hardware_video(video_path: str, expected_otp: str) -> Dict[str, Any]:
    """
    TRL 4-6 Hardware "Hostage Video" Checker
    Extracts frames every 3 seconds from a video and checks for a physical machine 
    and a handwritten paper containing the expected OTP.
    """
    cap = None
    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise Exception("Unable to open video file.")
            
        fps = cap.get(cv2.CAP_PROP_FPS)
        # Handle cases where FPS might not be read correctly
        if fps == 0 or fps != fps: 
            fps = 30.0 
            
        frame_interval = int(fps * 3) # 1 frame every 3 seconds
        frame_count = 0
        
        model = genai.GenerativeModel(MODEL_NAME)
        
        prompt = f"""
        You are a Zero-Trust Hardware Verification AI. 
        Analyze this image. 
        
        Task 1: Is a physical hardware machine, physical device, or working prototype clearly visible in the frame?
        Task 2: Can you read a handwritten piece of paper in the image? Does it contain the EXACT text/OTP: "{expected_otp}"?
        
        Return ONLY a raw JSON object with exactly three keys:
        - "hardware_detected": boolean
        - "otp_matched": boolean
        - "hardware_description": string (A brief description of the hardware seen, or empty if none detected)
        """
        
        while True:
            success, frame = cap.read()
            if not success:
                break
                
            if frame_count % frame_interval == 0:
                # Convert OpenCV BGR frame to RGB for PIL
                color_converted = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                pil_image = Image.fromarray(color_converted)
                
                # Check the current frame with Gemini Vision
                response = await asyncio.to_thread(
                    model.generate_content,
                    [prompt, pil_image]
                )
                
                try:
                    cleaned_text = clean_json_response(response.text)
                    result = json.loads(cleaned_text)
                    
                    # If both conditions are met, short-circuit and return success immediately
                    if result.get("hardware_detected") and result.get("otp_matched"):
                        return {
                            "verified": True,
                            "otp_matched": True,
                            "hardware_detected": result.get("hardware_description", "Hardware detected successfully.")
                        }
                except json.JSONDecodeError:
                    # If JSON parsing fails for one frame, ignore and move to the next frame
                    pass
                except Exception as eval_err:
                    print(f"Frame evaluation error: {eval_err}")
                    
            frame_count += 1
            
        # If the loop finishes without returning, no frame matched the conditions
        return {
            "verified": False,
            "otp_matched": False,
            "hardware_detected": "No valid hardware and OTP combination found in any frame."
        }
        
    except Exception as e:
        raise Exception(f"Video verification failed: {str(e)}")
    finally:
        # Always clean up the video capture object
        if cap is not None and cap.isOpened():
            cap.release()


# --------------------------------------------------------------------------
# FastAPI Endpoints
# --------------------------------------------------------------------------

@router.post("/verify-doc")
async def api_verify_engineering_doc(file: UploadFile = File(...)):
    """
    Endpoint for TRL 1-3 Verification.
    Accepts an image file (CAD/PCB schematic).
    """
    # Create a temporary file to save the uploaded image
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
        try:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read file: {e}")
            
    try:
        # Run the verification function
        result = await verify_engineering_doc(tmp_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temporary file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@router.post("/verify-video")
async def api_verify_hardware_video(
    expected_otp: str = Form(...), 
    file: UploadFile = File(...)
):
    """
    Endpoint for TRL 4-6 Verification.
    Accepts an expected OTP string and a video file.
    """
    # Create a temporary file to save the uploaded video
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        try:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read file: {e}")
            
    try:
        # Run the verification function
        result = await verify_hardware_video(tmp_path, expected_otp)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temporary file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
