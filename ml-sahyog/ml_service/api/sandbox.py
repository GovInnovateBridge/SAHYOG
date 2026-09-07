import os
import json
import asyncio
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import google.generativeai as genai

router = APIRouter()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Using gemini-2.5-flash as 1.5-flash has been sunset in this environment
MODEL_NAME = "gemini-2.5-flash"

class SandboxRequest(BaseModel):
    problem_statement: str

def clean_json_response(text: str) -> str:
    """Helper function to clean markdown formatting from Gemini JSON responses."""
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
        
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
        
    return cleaned.strip()

@router.post("/generate-synthetic-data")
async def generate_synthetic_data(request: SandboxRequest):
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        
        prompt = f"""
        Act as a data generator for an API Sandbox stress test.
        Based on the following Problem Statement, generate a JSON array containing exactly 10 realistic, varied data payloads.
        Return ONLY the raw JSON array. Do not include any explanations or markdown formatting.
        
        Problem Statement:
        {request.problem_statement}
        """
        
        # Async generation wrapper
        response = await asyncio.to_thread(
            model.generate_content,
            prompt
        )
        
        # Strip markdown and validate JSON
        cleaned_text = clean_json_response(response.text)
        
        try:
            data = json.loads(cleaned_text)
            return JSONResponse(content=data)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Generated content is not valid JSON")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
