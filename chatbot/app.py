from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

# Add CORS middleware to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all domains (change to frontend URL in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


# Hugging Face API Key (replace with your actual key)
HUGGINGFACE_API_KEY = "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"

# Mistral model hosted on Hugging Face
MISTRAL_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"

GEMINI_API_KEY = "AIzaSyANmQUwXUh5nMzd_WTyXJGwAm2JORdTo8c"

# Load embedding model and FAISS vector store
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vector_db = FAISS.load_local("faiss_index", embedding_model, allow_dangerous_deserialization=True)

# Define request structure
class QueryRequest(BaseModel):
    question: str

# Function to retrieve relevant chunks
def retrieve_relevant_chunks(query, top_k=3):
    """Fetch the most relevant document chunks based on user query."""
    relevant_docs = vector_db.similarity_search(query, k=top_k)
    return [doc.page_content.replace("\n", " ") for doc in relevant_docs]  # Remove newlines

def query_mistral(question):
    """Retrieves relevant chunks and queries Mistral API for an answer."""
    relevant_chunks = retrieve_relevant_chunks(question)
    context = " ".join(relevant_chunks)

    # Enhanced prompt for better structured responses
    prompt = f"""You are the AI-powered chatbot for DineAI, a restaurant assistant designed to enhance customer experience.
    You have access to the restaurant's digital menu, chef recommendations, and customer reviews.

    Your functionalities include:
    - **Personalized Menu Curation**: If the user asks for recommendations, ask about their dietary preferences, flavor choices, and suggest dishes accordingly.
    - **Chef Recommendations**: If a user asks for the best dishes, provide expert-curated suggestions from the chef.
    - **Google Reviews Integration**: If the user asks about a dish, provide its rating, review highlights, and common feedback.
    - **Nutritional Information**: If a user asks about a dish's nutrition, return details on calories, protein, carbs, and fat.
    - **Allergen Warnings**: If a user mentions an allergy, ensure you only recommend dishes that are safe.
    - **Dish Preparation Details**: If a user asks how a dish is made, provide its preparation process.

    Here is the restaurant's menu:
    {context}

    Follow these rules while answering:
    - Keep responses short and informative.
    - If the user's question is general (e.g., "Hi", "How are you?"), reply casually.
    - If the question is related to a specific dish, provide accurate details from the menu.
    - If you don’t have enough context, say "I’m not sure, but I can check with the restaurant."

    **User's Question:** {question}
    **Your Response:**"""

    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
    payload = {"inputs": prompt, "parameters": {"max_length": 500}}

    response = requests.post(f"https://api-inference.huggingface.co/models/{MISTRAL_MODEL}", json=payload, headers=headers)

    try:
        response_json = response.json()
        generated_text = response_json[0]["generated_text"].strip()

        # Extract only the generated answer
        if "Your Response:" in generated_text:
            final_answer = generated_text.split("Your Response:")[-1].strip()
        else:
            final_answer = generated_text

        return final_answer

    except Exception as e:
        return f"Error: {e}"

import requests
import json

# Google Gemini API Key
GEMINI_API_KEY = "AIzaSyANmQUwXUh5nMzd_WTyXJGwAm2JORdTo8c"

# Function to query Gemini Flash 2.0 with memory
def query_gemini(question, history):
    """Retrieves relevant chunks and queries Google Gemini API for an answer with conversation context."""
    relevant_chunks = retrieve_relevant_chunks(question)
    context = " ".join(relevant_chunks)

    # Format conversation history
    history_formatted = "\n".join([f"User: {msg['question']}\nAI: {msg['answer']}" for msg in history])

    # Enhanced prompt with conversation memory
    prompt = f"""You are DineAI, an AI-powered restaurant assistant.
    You have access to the restaurant's digital menu, chef recommendations, and customer reviews.

    Your functionalities include:
    - **Personalized Menu Curation**: Ask for dietary preferences before recommending dishes.
    - **Chef Recommendations**: Suggest the restaurant’s best-rated dishes.
    - **Google Reviews Integration**: Provide customer ratings and feedback on dishes.
    - **Nutritional Information**: Return dish details (calories, protein, carbs, fat).
    - **Allergen Warnings**: Recommend only safe dishes if an allergy is mentioned.
    - **Dish Preparation Details**: Explain how a dish is made.

    Previous conversation:
    {history_formatted}

    Restaurant Menu Context:
    {context}

    - If the user’s question is about food, recommend based on the menu.
    - If unsure, say 'I don’t know, but I can check with the restaurant.'

    **User's Question:** {question}
    **Your Response:**"""

    # Gemini API URL
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}]
    }

    headers = {"Content-Type": "application/json"}

    response = requests.post(url, json=payload, headers=headers)

    try:
        response_json = response.json()
        print(response_json)
        generated_text = response_json["candidates"][0]["content"]["parts"][0]["text"].strip()

        # ✅ Remove markdown formatting (e.g., **bold text**, *italic*, etc.)
        cleaned_text = generated_text.replace("**", "").replace("*", "").replace("_", "")

        return cleaned_text

    except Exception as e:
        return f"Error: {e}"



# Store chat history (In-Memory for now, can later move to a database)
chat_history = []

@app.post("/query")
async def handle_query(request: QueryRequest):
    """Receives a question from the frontend and returns the AI-generated answer."""
    try:
        print(request.question)

        # Query Gemini with history
        answer = query_gemini(request.question, chat_history)

        # Update conversation history
        chat_history.append({"question": request.question, "answer": answer})

        return {"question": request.question, "answer": answer, "history": chat_history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Root route (optional)
@app.get("/")
async def home():
    return {"message": "DineAI Chatbot API is running!"}
