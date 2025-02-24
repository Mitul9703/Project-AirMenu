from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from pydantic import BaseModel

app = FastAPI()

# Enable CORS to allow requests from your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Hugging Face API Details for LLaMA 13B
HF_API_URL = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct"
HF_API_KEY = "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"  # Replace with your actual API key

class ChatRequest(BaseModel):
    message: str

@app.post("/chatbot/")
def chatbot_response(request: ChatRequest):
    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Improve chatbot prompting for better responses
    prompt = f"### User: {request.message}\n### Assistant:"
    payload = {"inputs": prompt}

    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        response_json = response.json()

        if isinstance(response_json, list) and "generated_text" in response_json[0]:
            return {"response": response_json[0]["generated_text"]}
        else:
            return {"response": "Error: Model response was not formatted correctly"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
