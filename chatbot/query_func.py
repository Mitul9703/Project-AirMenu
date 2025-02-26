import requests
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

# Hugging Face API Key (Get it from https://huggingface.co/settings/tokens)
HUGGINGFACE_API_KEY = "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"

# Mistral model hosted on Hugging Face
MISTRAL_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"

# Load embeddings model & FAISS database
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vector_db = FAISS.load_local("faiss_index", embedding_model, allow_dangerous_deserialization=True)

# Function to retrieve relevant chunks
def retrieve_relevant_chunks(query, top_k=3):
    relevant_docs = vector_db.similarity_search(query, k=top_k)
    return [doc.page_content.replace("\n", " ") for doc in relevant_docs]  # Remove newlines

# Function to query Mistral API
def query_mistral(question):
    relevant_chunks = retrieve_relevant_chunks(question)
    
    # Format context into a readable paragraph
    context = " ".join(relevant_chunks)

    prompt = f"""Use the following document context to answer the question concisely.

    Context:
    {context}

    Question: {question}
    Answer:"""

    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
    payload = {"inputs": prompt, "parameters": {"max_length": 300}}

    response = requests.post(f"https://api-inference.huggingface.co/models/{MISTRAL_MODEL}", json=payload, headers=headers)

    try:
        response_json = response.json()
        return response_json[0]["generated_text"].strip()  # Extract clean answer
    except Exception as e:
        return f"Error: {e}"

# Example usage
if __name__ == "__main__":
    while True:
        question = input("Enter your question: ")
        response = query_mistral(question)
        print("\nMistral Response:", response)
