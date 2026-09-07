import os
import time
import math
import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import google.generativeai as genai

router = APIRouter()

# Configure API Key securely
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Pydantic Schemas
class Proposal(BaseModel):
    id: str
    text: str

class SemanticTriageRequest(BaseModel):
    problem_statement: str
    proposals: List[Proposal]

class MatchedProposal(BaseModel):
    id: str
    score: float

class SemanticTriageResponse(BaseModel):
    matches: List[MatchedProposal]

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    dot_product = sum(x * y for x, y in zip(v1, v2))
    magnitude1 = math.sqrt(sum(x * x for x in v1))
    magnitude2 = math.sqrt(sum(x * x for x in v2))
    if magnitude1 * magnitude2 == 0:
        return 0.0
    return dot_product / (magnitude1 * magnitude2)

@router.post("/semantic-triage", response_model=SemanticTriageResponse)
async def semantic_triage(request: SemanticTriageRequest):
    try:
        # Get embedding for the problem statement
        ps_embedding_result = genai.embed_content(
            model="models/text-embedding-004",
            content=request.problem_statement,
            task_type="retrieval_query"
        )
        ps_embedding = ps_embedding_result['embedding']
        
        matches = []
        
        # Batch processing to respect API rate limits
        batch_size = 5
        for i in range(0, len(request.proposals), batch_size):
            batch = request.proposals[i:i+batch_size]
            texts = [p.text for p in batch]
            
            # Batch sleep to prevent 429 Too Many Requests
            if i > 0:
                await asyncio.sleep(1.5) 
                
            embeddings_result = genai.embed_content(
                model="models/text-embedding-004",
                content=texts,
                task_type="retrieval_document"
            )
            vectors = embeddings_result['embedding']
            
            # Compute cosine similarity
            for proposal, vector in zip(batch, vectors):
                score = cosine_similarity(ps_embedding, vector)
                if score >= 0.80:
                    matches.append(MatchedProposal(id=proposal.id, score=round(score, 4)))
                    
        # Sort best matches first
        matches.sort(key=lambda x: x.score, reverse=True)
        
        return SemanticTriageResponse(matches=matches)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
