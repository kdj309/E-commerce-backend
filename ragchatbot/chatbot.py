import json
import os
import bs4
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import JSONLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq


#loading the json from the json converting them to Langchain document
loader = JSONLoader(file_path="./products.json", jq_schema=".products[]", text_content=False)
documents = loader.load()

#splitting the documents
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
all_splits = text_splitter.split_documents(documents)

#creating the faiss index using hugging face model
vectorstore = FAISS.from_documents(all_splits, HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2"))


#initializing the GROQ chat
llm = ChatGroq(temperature=0, model_name="llama3-8b-8192",groq_api_key=os.environ.get("GROQ_API_KEY"))

#Langchain chain for QA
chain = ConversationalRetrievalChain.from_llm(llm,
                                              vectorstore.as_retriever(),
                                              return_source_documents=True)

result = chain({"question": "list the products of Mitera brand", "chat_history": []})

print(result['answer'])

