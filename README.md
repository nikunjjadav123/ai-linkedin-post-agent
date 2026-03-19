# 🚀 AI-Powered LinkedIn Post Generator & Publisher (HITL)

## 📌 Overview

A backend-driven AI application that generates high-quality LinkedIn posts using LLMs, enables Human-in-the-Loop (HITL) approval, and publishes content directly to LinkedIn via REST API.

This project demonstrates **agentic workflows using LangGraph**, structured AI pipelines, and real-world API integration.

---

## 🧠 Features

* ✨ AI-generated LinkedIn posts from topic input
* 🎯 Hook generation for high engagement
* 🔁 Iterative evaluation & improvement (LangGraph workflow)
* 👤 Human-in-the-Loop (HITL) approval before publishing
* 🔗 Direct publishing using LinkedIn REST API (`/rest/posts`)
* ⚙️ Modular backend architecture (FastAPI + LangGraph)

---

## 🏗️ Architecture

Client / API Consumer → FastAPI Backend → LangGraph Workflow → LinkedIn API

---

## 📁 Project Structure

```
backend/
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name/backend
```

### 2️⃣ Create Virtual Environment

```
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```

### 3️⃣ Install Dependencies

```
pip install -r requirements.txt
```

### 4️⃣ Run the Server

```
uvicorn app.main:app --reload
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder.

We have provided a `.env.example` file to help you understand the required environment variables.

---

## 🤖 Model Information

* **Provider:** Groq
* **Model:** llama-3.1-8b-instant

---

## 🔁 Workflow (LangGraph)

```
Topic 
  ↓
Hook Generation
  ↓
Post Generation
  ↓
Evaluation
  ↓
Human Approval (HITL)
  ↓
Publish to LinkedIn
```

---

## 🧩 Tech Stack

* Python, FastAPI
* LangGraph, LangChain
* Groq (LLM Provider)
* LinkedIn REST API
* OAuth 2.0

---

## 🚀 Future Enhancements

* Add frontend UI for approval workflow
* Multi-platform posting (Twitter, Instagram)
* Prompt optimization loop
* Analytics dashboard
* Docker-based deployment

---

## 🎯 Use Case

* Personal branding automation
* Marketing content pipelines
* AI-assisted content creation

---

## 🏆 Highlights

* Agentic AI workflow design
* Human-in-the-Loop system
* Real-world API integration
* Production-style backend architecture

---

## 📌 Important Notes

* This project currently focuses on backend and workflow logic.
* No frontend implementation is included at this stage.
* Do not commit `.env` file or API keys to version control.

---

## 📌 Author

Your Name
