from flask import Flask, request, jsonify, session
from flask_cors import CORS
from langchain.prompts import PromptTemplate
from langchain_community.llms import HuggingFaceHub
from langchain_community.vectorstores import Pinecone
import pinecone
from langchain.prompts import PromptTemplate
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_community.embeddings import HuggingFaceEmbeddings
from dotenv import load_dotenv
import traceback
import os

app = Flask(__name__)
CORS(app)
app.secret_key = 'medisation'

load_dotenv()

PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
PINECONE_API_ENV = os.environ.get('PINECONE_API_ENV')

#Create Embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

#Initializing the Pinecone
pinecone.init(api_key=PINECONE_API_KEY,
              environment=PINECONE_API_ENV)

index_name="medical-question-answering"

#Loading the index
retriever=Pinecone.from_existing_index(index_name, embeddings)

#Creating a Prompt Template
prompt_template="""
Use the following pieces of information to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}
History: {history}
Question: {question}

Only return the helpful answer below and nothing else.
Helpful answer:
"""

PROMPT=PromptTemplate(template=prompt_template, input_variables=["context", "history", "question"])

#Create the LLM
llm = HuggingFaceHub(repo_id="smrynrz20/bart_samsum")

# Create a new memory buffer instance
memory = ConversationBufferMemory(memory_key="chat_history", k = 3, return_messages=True)

chain=ConversationalRetrievalChain.from_llm(
    llm=llm, 
    chain_type="stuff", 
    retriever=retriever.as_retriever(search_kwargs={'k': 2}),
)

@app.route("/chat", methods=["POST"])
async def chat():
    try:
        data = request.get_json()  
        print("Received data:", data) 

        question = data['msg'] 
        chat_history = []

        result = await chain.ainvoke({"question": question, "chat_history": chat_history})

        return jsonify({"msg": result["answer"]})  # Make sure to send JSON with a key that the frontend expects.
    except Exception as e:
        print("Error processing request:", e)
        traceback.print_exc()  # Print detailed traceback to help identify where exactly the error occurred.
        return jsonify({"msg": "Error processing your request"}), 500

if __name__ == "__main__":
    app.run(debug=True)