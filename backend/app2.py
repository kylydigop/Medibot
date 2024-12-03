from flask import Flask, request, jsonify, session
from flask_cors import CORS
from src.helper import download_hugging_face_embeddings
from langchain_community.vectorstores import Pinecone
import pinecone
from langchain.prompts import PromptTemplate
from langchain_community.llms import CTransformers
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from dotenv import load_dotenv
import traceback
import os

app = Flask(__name__)
app.secret_key = 'medisation'
CORS(app)

load_dotenv()
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
PINECONE_API_ENV = os.environ.get('PINECONE_API_ENV')

embeddings = download_hugging_face_embeddings()

# Creating a Prompt Template
prompt_template = """
Answer the question as if you are a medical professional having a conversation with a patient.  
If you don't know or are not confident with the answer, say that you don't know and advise seeking a medical professional.  
If the question is not related to general illness, its symptoms, or its possible cures, explain that it is not within your scope.  
Always include the following disclaimer at the start of your answer:  

"Disclaimer: I'm here to provide general information and guidance. Please consult a licensed medical professional for personalized advice and treatment."  

Do not return incomplete sentences or speculative responses.  

Context: {context}  
History: {chat_history}  
Question: {question}  

Only return the helpful answer below and nothing else.  
Helpful answer:
"""


PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "chat_history", "question"])

chain_type_kwargs={"prompt": PROMPT}

#Initializing the Pinecone
pinecone.init(api_key=PINECONE_API_KEY,
              environment=PINECONE_API_ENV)

index_name="medical-question-answering"

#Loading the index
docsearch=Pinecone.from_existing_index(index_name, embeddings)

# Create the LLM
llm=CTransformers(model="model/llama-2-7b-chat.ggmlv3.q4_0.bin",
                  model_type="llama",
                  config={'max_new_tokens':128,
                          'temperature':0.01})

# Create a new memory buffer instance
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# Initialize the chain with LLM and prompt
chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    chain_type="stuff",
    retriever=docsearch.as_retriever(search_kwargs={'k': 2}),
    memory=memory,  # Include memory for chat history
)

@app.route("/chat", methods=["POST", "DELETE", "GET"])
def chat():
    try:
        if request.method == "POST":
            data = request.json
            query = data.get("msg")
            chat_history = data.get("history", [])
            
            # Add chat history to session
            result = chain({"question": query, "chat_history": chat_history})
            response = {
                "answer": result["answer"],
                "history": chat_history + [(query, result["answer"])]
            }
            
            return jsonify(response)

        elif request.method == "DELETE":
            memory.clear()
            return jsonify({"msg": "Chat history cleared"})

        elif request.method == "GET":
            # Retrieve chat history from memory
            chat_history = memory.load_memory_variables({}).get("chat_history", [])
            
            # Check if chat history is empty
            if not chat_history:
                return jsonify({"msg": "No History"}), 200
            else:
                return jsonify({"history": chat_history})
            
    except Exception as e:
        print("Error processing request:", e)
        return jsonify({"msg": "Error processing your request"}), 500
        
if __name__ == "__main__":
    app.run(debug=True)