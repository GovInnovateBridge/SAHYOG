"""
Sahyog TRL Engine — Hardware & DeepTech Vision Verifier
Uses Gemini Vision API to verify physical hardware prototypes.
"""
import os
import base64
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

_vision_llm = None

def _get_vision_llm():
    """Lazy load the Gemini Vision-capable model"""
    global _vision_llm
    if _vision_llm is None:
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            raise EnvironmentError("GOOGLE_API_KEY is not set.")
        
        # gemini-3.6-flash natively supports vision/multimodal
        _vision_llm = ChatGoogleGenerativeAI(
            model="gemini-3.6-flash",
            google_api_key=api_key,
            temperature=0.1,
        )
    return _vision_llm


class HardwareVisionResult(BaseModel):
    is_code_verified: bool = Field(description="True if the exact security code was found handwritten in the image")
    is_hardware_detected: bool = Field(description="True if the image appears to contain a physical hardware prototype/device")
    analysis_report: str = Field(description="Detailed explanation of what the AI saw in the image")


def verify_hardware_prototype(base64_image: str, expected_security_code: str) -> HardwareVisionResult:
    """
    TASK 3: Zero-Trust Hardware Verification (Anti-Spoofing)
    
    Startups claiming Hardware TRL 4-6 must prove they didn't just download 
    a stock image of a drone/robot. They must write a generated security code 
    on a piece of paper and include it in the photo/video of the hardware.
    
    This function uses Gemini Vision to verify:
    1. The hardware actually exists in the frame.
    2. The handwritten security code matches the expected code exactly.
    """
    llm = _get_vision_llm()
    
    # Strip the data:image/jpeg;base64, prefix if present
    if "," in base64_image:
        base64_image = base64_image.split(",")[1]

    prompt_text = f"""
    You are a GovTech Hardware Auditor performing a Zero-Trust visual inspection.
    
    We need to verify that this is a real, physical hardware prototype and not a stock image.
    The founder was instructed to write the security code '{expected_security_code}' on a piece of paper and place it next to the hardware in this photo.
    
    Analyze the image carefully and output a JSON response matching this schema exactly:
    {{
      "is_code_verified": boolean,
      "is_hardware_detected": boolean,
      "analysis_report": "string explaining your findings"
    }}
    
    - is_code_verified MUST be true ONLY if you clearly see '{expected_security_code}' written in the image.
    - is_hardware_detected MUST be true ONLY if there is actual physical hardware/machinery visible.
    - analysis_report should describe the hardware seen and whether the code was legible.
    
    Respond with ONLY valid JSON.
    """

    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt_text},
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
            },
        ]
    )

    try:
        # Use structured output parsing directly
        structured_llm = llm.with_structured_output(HardwareVisionResult)
        result = structured_llm.invoke([message])
        return result
    except Exception as e:
        return HardwareVisionResult(
            is_code_verified=False,
            is_hardware_detected=False,
            analysis_report=f"Vision analysis failed: {str(e)}"
        )
