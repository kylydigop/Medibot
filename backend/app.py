from flask import Flask, request, jsonify, session
from flask_cors import CORS
from langchain.prompts import PromptTemplate
from langchain_community.llms import HuggingFaceHub
from langchain.chains import LLMChain
from langchain.memory import ConversationStringBufferMemory
from dotenv import load_dotenv
import traceback
import os

app = Flask(__name__)
CORS(app)
app.secret_key = 'medisation'

load_dotenv()
HUGGINGFACEHUB_API_TOKEN = os.getenv('HUGGINGFACEHUB_API_TOKEN')

# Creating a Prompt Template
prompt_template = """
Answer the question like you are a medical professional having a conversation with a patient.
If you don't know or not confident with the answer, just say that you don't know, don't try to make up an answer.
Do not return an incomplete sentence.

History: {history}
Question: {question}

Only return the helpful answer below and nothing else.
Helpful answer:
"""

PROMPT = PromptTemplate(template=prompt_template, input_variables=["history", "question"])

# Create the LLM
llm = HuggingFaceHub(repo_id="smrynrz20/finetuned-bart-mquad",
                     model_kwargs={"temperature": 0,
                                   "max_length": 64},)

# Create a new memory buffer instance
memory = ConversationStringBufferMemory(memory_key="history", return_messages=True)

# Initialize the chain with LLM and prompt
chain = LLMChain(
    llm=llm,
    prompt=PROMPT,
    memory=memory
)

def serialize_history(chat_history):
    return [
        {"question": msg["question"], "answer": msg["answer"]}
        for msg in chat_history
    ]

def deserialize_history(chat_history):
    return [
        {"question": msg["question"], "answer": msg.get("answer", "")}
        for msg in chat_history
    ]

def make_serializable(obj):
    if isinstance(obj, list):
        return [make_serializable(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: make_serializable(v) for k, v in obj.items()}
    elif hasattr(obj, 'to_dict'):
        return obj.to_dict()
    else:
        return str(obj)

@app.route("/chat", methods=["POST"])
async def chat():
    try:
        data = request.get_json()
        print("Received data:", data)

        question = data['msg']
        chat_history = session.get('chat_history', [])

        # Deserialize chat history
        deserialized_history = deserialize_history(chat_history)

        # Add current question to the history for processing
        deserialized_history.append({"question": question})

        # Generate the answer using the chain
        result = await chain.ainvoke({"question": question, "history": deserialized_history})

        # Update the chat history with the answer
        deserialized_history[-1]["answer"] = result

        # Store the serialized chat history in the session
        session['chat_history'] = serialize_history(deserialized_history)

        return jsonify({"msg": make_serializable(result)})
    except Exception as e:
        print("Error processing request:", e)
        traceback.print_exc()
        return jsonify({"msg": "Error processing your request"}), 500

if __name__ == "__main__":
    app.run(debug=True)
