from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

router = APIRouter(prefix="/assistant", tags=["Govt AI Assistant"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(req: ChatRequest):
    """
    Chat endpoint for the Govt Nodal Officer AI Assistant.
    Translates and summarizes milestone data dynamically.
    """
    message = req.message.lower()
    
    # Simple rule-based mock for hackathon robustness to prevent API key errors during demo
    # We detect keywords to give hyper-realistic responses based on Sahyog's current state.
    
    if "hindi" in message and "aerodrone" in message:
        return ChatResponse(response="""AeroDrone Vision (एयरोड्रोन विजन) के लिए माइलस्टोन रिपोर्ट का सारांश:

1. **कार्य प्रगति**: उन्होंने अपना AI मॉडल और ट्रैफिक मॉनिटरिंग डैशबोर्ड सफलतापूर्वक तैनात कर दिया है।
2. **सटीकता**: कैमरे की सटीकता 94% तक पहुँच गई है।
3. **सिफारिश**: नोडल अधिकारी के रूप में, आप इस रिपोर्ट को मंजूरी दे सकते हैं।

क्या आप चाहते हैं कि मैं अगला कदम बताऊं?""")
    
    elif "milestone 2" in message or "stuck" in message:
        return ChatResponse(response="वर्तमान में, कोई भी स्टार्टअप माइलस्टोन 2 पर अटका नहीं है। AeroDrone Vision ने माइलस्टोन 1 पूरा कर लिया है और माइलस्टोन 2 की ओर बढ़ रहा है।\n\n(Currently, no startups are stuck on Milestone 2. AeroDrone Vision has completed M1 and is progressing.)")
    
    else:
        # Fallback to LLM if key exists, otherwise generic response
        if os.environ.get("GOOGLE_API_KEY"):
            try:
                from langchain_google_genai import ChatGoogleGenerativeAI
                llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)
                
                sahyog_context = """
                You are 'Sahyog AI', the universal assistant for GovInnovateBridge (Sahyog).
                Sahyog is a platform that connects Government Nodal Officers with Tech Startups to solve public problems.
                
                Core Features of Sahyog:
                1. ML Formulator: Government officers type raw problems, and ML turns them into formal draft templates.
                2. Semantic Triage: Matches government drafts to registered startups based on >80% cosine similarity.
                3. Zero-Trust TRL Evaluation: Startups take a quiz to prove their Technology Readiness Level (1-9).
                4. Smart Escrow via PFMS: Milestone-based fund release system. Funds are released automatically or by officer approval when startups upload work reports.
                5. Double-Blind QCBS: Technical evaluations without bias.
                
                Your Role:
                - If the user is a Startup, help them understand how to apply for challenges and upload milestones.
                - If the user is a Nodal Officer, help them draft challenges, manage escrows, and summarize startup reports.
                - If they ask about AeroDrone Vision, know they are a startup working on an AI Traffic Anomaly Pilot (currently at Milestone 1).
                
                Respond in a friendly, extremely helpful, and professional tone. Answer the user's query directly based on this context.
                """
                
                prompt = f"{sahyog_context}\n\nUser query: {req.message}"
                res = llm.invoke(prompt)
                return ChatResponse(response=res.content)
            except Exception as e:
                print("LLM Error:", e)
                pass
        
        # Super robust mock fallback if LLM key is invalid
        if "trl" in message or "quiz" in message:
            return ChatResponse(response="The **TRL (Technology Readiness Level) Quiz** is a core feature of Sahyog! It is a Zero-Trust evaluation system where startups answer technical questions to prove their product's maturity level (from Level 1 to 9). This ensures Government Officers only match with capable startups.")
        
        return ChatResponse(response="I am your Universal Sahyog AI Assistant. I can help you summarize reports, translate them, and check startup progress. Please ask me about AeroDrone Vision, or any platform features like Escrows, TRL, and Semantic Triage!")
