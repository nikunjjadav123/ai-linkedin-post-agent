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

React Frontend (Vite) ↔ FastAPI Backend ↔ LangGraph Stateful Workflow (with MemorySaver) ↔ LinkedIn API

---

## 📁 Project Structure

```
.
├── backend/            # FastAPI & LangGraph logic
├── frontend/           # React + Tailwind CSS + Vite
└── README.md
```

---

## ⚙️ Installation & Running

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Run the server
uvicorn src.app.main:app --reload --port 8000
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
# Run the development server
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend` folder based on `.env.example`.

---

## 🤖 Model Information

* **Provider:** Groq
* **Model:** llama-3.1-8b-instant

---

## 🔁 Workflow (LangGraph)

The workflow is stateful and uses **Human-in-the-Loop (HITL)** interrupts:

1. **Topic Input** (User)
2. **Hook Generation** (AI)
3. **Interrupt 1:** User reviews/edits Hooks.
4. **Post Generation** (AI)
5. **Evaluation & Feedback** (AI)
6. **Hashtag Generation** (AI)
7. **Interrupt 2:** User reviews/edits Post Content & Hashtags.
8. **Publishing** (AI)

---

## 🧩 Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Axios, Lucide Icons
* **Backend:** Python, FastAPI, LangGraph, LangChain
* **LLM:** Groq
* **API:** LinkedIn REST API (OAuth 2.0)

---

## 🚀 Future Enhancements

* Multi-platform posting (Twitter, Instagram)
* Analytics dashboard
* Docker-based deployment

---

## 🎯 Use Case

* Personal branding automation
* Marketing content pipelines
* AI-assisted content creation

---

## 🏆 Highlights

* **Stateful Agentic AI:** Uses LangGraph `MemorySaver` to persist conversation threads.
* **Full-Stack HITL:** Interactive approval flow spanning React and Python.
* **Modern UI:** Clean, responsive design built with Tailwind CSS.

---

## 📌 Important Notes

* Ensure the backend is running on port 8000 for the frontend to communicate correctly.
* Do not commit `.env` file or API keys to version control.

---

## 📌 Author

Nikunj Jadav

---

## 📌 Author

Your Name
