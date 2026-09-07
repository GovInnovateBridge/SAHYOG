import os
import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai

router = APIRouter()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Using gemini-2.5-flash
MODEL_NAME = "gemini-2.5-flash"

class RedactionRequest(BaseModel):
    proposal_text: str

class RedactionResponse(BaseModel):
    redacted_text: str

@router.post("/redact-proposal", response_model=RedactionResponse)
async def redact_proposal(request: RedactionRequest):
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        
        prompt = f"""
        You are a privacy redaction system for a double-blind QCBS evaluation.
        Identify and mask all PII (Personally Identifiable Information) in the text below.
        Replace all occurrences of Company Names, Founder Names, Emails, and Phone Numbers strictly with the string [REDACTED_ENTITY].
        Return ONLY the redacted text, with nothing else. Do not add introductory or concluding remarks.
        
        Original Text:
        {request.proposal_text}
        """
        
        response = await asyncio.to_thread(
            model.generate_content,
            prompt
        )
        
        return RedactionResponse(redacted_text=response.text.strip())
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
