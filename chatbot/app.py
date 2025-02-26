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
    - **Chef Recommendations**: Suggest the restaurant's best-rated dishes.
    - **Google Reviews Integration**: Provide customer ratings and feedback on dishes.
    - **Nutritional Information**: Return dish details (calories, protein, carbs, fat).
    - **Allergen Warnings**: Recommend only safe dishes if an allergy is mentioned.
    - **Dish Preparation Details**: Explain how a dish is made.

    Previous conversation:
    {history_formatted}

    Restaurant Menu Context:
    {context}

    IMPORTANT FUNCTION CALLING INSTRUCTIONS:
    When recommending a specific dish to the user, you must BOTH:
    
    1. Provide a normal conversational response to the user
    
    2. AFTER your response, include a JSON function call in this exact format:
    ```json
    {{
      "type": "function_call",
      "function": "displayDishInUI",
      "parameters": {{
        "dish_name": "Name of the dish",
        "price": "$XX.XX",
        "reasoning": "Brief reason why you're recommending this dish based on user preferences",
        "image_url": "dish_name_image"
      }}
    }}
    ```
    
    For example, if recommending Pasta Carbonara, your complete response might be:

    I'd recommend our Pasta Carbonara! It's a creamy pasta dish with pancetta, parmesan, and a rich egg-based sauce. Since you mentioned enjoying creamy pastas, this chef's specialty would be perfect for you.

    ```json
    {{
      "type": "function_call",
      "function": "displayDishInUI",
      "parameters": {{
        "dish_name": "Pasta Carbonara",
        "price": "$16.99",
        "reasoning": "Creamy texture with rich flavor profile matching your preference",
        "image_url": "pasta_carbonara_image"
      }}
    }}
    ```

    If recommending multiple dishes, include multiple function calls, one after another.

    - If the user asks general questions unrelated to specific dishes, just respond normally without the function call.
    - Only use the function call when specifically recommending a dish the user should try.
    - Never mention that you are using function calls in your user-facing text.
    - Make sure to format the JSON exactly as shown, with no mistakes.

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
        print(generated_text)
        # ✅ Remove markdown formatting (e.g., **bold text**, *italic*, etc.)
        cleaned_text = generated_text.replace("**", "").replace("*", "").replace("_", "")
        user_response, function_data = extract_function_calls(generated_text)
        cleaned_user_text = user_response.replace("**", "").replace("*", "").replace("_", "")
        print(cleaned_user_text)
        print(function_data)
        return cleaned_user_text

    except Exception as e:
        return {
            "user_message": f"I apologize, but I encountered an error while processing your request. Please try again.",
            "function_data": None,
            "error": str(e)
        }

import json
import re

def extract_function_calls(text):
    """
    Extracts all JSON function call blocks from the text and removes them completely,
    returning:
      - The pure user-facing text (with all JSON blocks removed)
      - A list of parsed function call dictionaries
    """
    # --- Step 1: Extract all JSON blocks ---
    # This regex captures any text between a "```json" marker and the subsequent "```"
    json_blocks = re.findall(r"```json\s*({.*?})\s*```", text, re.DOTALL)
    
    function_calls = []
    for block in json_blocks:
        try:
            # Parse each JSON block into a Python dictionary
            function_calls.append(json.loads(block))
        except json.JSONDecodeError as e:
            print(f"JSON decoding error: {e}")
            continue

    # --- Step 2: Remove all JSON blocks from the text ---
    # This regex replaces all JSON code blocks with an empty string
    cleaned_text = re.sub(r"```json\s*{.*?}\s*```", "", text, flags=re.DOTALL).strip()

    return cleaned_text, function_calls


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
