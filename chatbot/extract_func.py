from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
import json
from langchain.schema import Document


# Function to load documents (Supports PDF, TXT, DOCX, JSON)
def load_document(file_path):
    ext = os.path.splitext(file_path)[-1].lower()
    
    if ext == ".pdf":
        loader = PyPDFLoader(file_path)
        return loader.load()
    elif ext == ".txt":
        loader = TextLoader(file_path)
        return loader.load()
    elif ext == ".docx":
        loader = Docx2txtLoader(file_path)
        return loader.load()
    elif ext == ".json":
        return load_json(file_path)  # Call JSON processing function
    else:
        raise ValueError("Unsupported file format! Use PDF, TXT, DOCX, or JSON.")


# Function to process JSON and extract text
def load_json(json_path):
    """Loads JSON and flattens it into a readable text format."""
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    def extract_text(obj, prefix=""):
        """Recursively extracts text from a JSON object."""
        text_data = []
        if isinstance(obj, dict):
            for key, value in obj.items():
                text_data.append(f"{prefix}{key}: {extract_text(value, prefix='')}")
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                text_data.append(f"{prefix}Item {i+1}: {extract_text(item, prefix='')}")
        else:
            text_data.append(str(obj))
        return " ".join(text_data)

    extracted_text = extract_text(data)

    # Wrap extracted text inside a LangChain Document object
    return [Document(page_content=extracted_text)]


from langchain_text_splitters import RecursiveCharacterTextSplitter

# Function to split text into chunks
def split_into_chunks(docs, chunk_size=500, chunk_overlap=100):
    """Splits documents into smaller chunks for FAISS storage."""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    
    # Ensure input is a list of `Document` objects
    if not isinstance(docs, list):
        raise ValueError("Expected a list of LangChain Document objects")

    return text_splitter.split_documents(docs)



# Load and combine multiple documents
file_paths = [r"DineAI.pdf", r"data.json"]  # Add all files here
all_chunks = []

for file_path in file_paths:
    docs = load_document(file_path)
    chunks = split_into_chunks(docs)
    all_chunks.extend(chunks)
    print(f"Loaded {len(chunks)} chunks from {file_path}")

# Load Hugging Face sentence-transformer model for embedding
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Load existing FAISS index if it exists, else create a new one
try:
    vector_db = FAISS.load_local("faiss_index", embedding_model, allow_dangerous_deserialization=True)
    print("Existing FAISS index loaded.")
    vector_db.add_documents(all_chunks)  # Add new chunks to existing DB
except:
    print("No existing FAISS found, creating a new one.")
    vector_db = FAISS.from_documents(all_chunks, embedding_model)

# Save updated FAISS index
vector_db.save_local("faiss_index")

print("FAISS database updated with new documents.")


