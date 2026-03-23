# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server (from backend directory)
uvicorn app.main:app --reload

# Run with explicit port
uvicorn app.main:app --reload --port 8000
```

## Environment Setup

Copy `.env.example` to `.env` and configure:
- `GROQ_API_KEY` - Groq LLM API key
- `GROQ_LLM_MODEL` - Model name (default: `llama3-70b-8192`)
- `LINKEDIN_ACCESS_TOKEN` - OAuth access token for LinkedIn API
- `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` - LinkedIn OAuth credentials
- `LINKEDIN_PERSON_ID` - User URN (format: `urn:li:person:xxxx`)

## Architecture

LangGraph-based agent workflow for LinkedIn content automation:

```
Topic → Hook Generation → Best Hook Selection → Post Generation → Evaluation → Publish
                                ↑___________________need_improvement_______________|
```

### Key Components

**Entry Point**: `src/app/main.py` - FastAPI app with single router

**API Routes** (`src/app/routes/post_routes.py`):
- `POST /linkedin/hooks` - Generate hooks for topic
- `POST /linkedin/best-hook` - Select best hook from generated hooks
- `POST /linkedin/post/generate` - Generate post from hook
- `POST /linkedin/post/evaluate` - Evaluate post quality
- `POST /linkedin/post/publish` - Publish to LinkedIn

**Workflow** (`src/app/workflows/linkedin_workflow.py`):
- Uses LangGraph `StateGraph` with `LinkedInState` TypedDict
- Nodes connected in sequence with conditional loop for improvement

**Nodes** (`src/app/nodes/`):
- `generate_linkedin_hooks.py` - LLM generates 5 hooks with scores
- `find_best_linkedin_hook.py` - Selects highest-scoring hook
- `generate_post.py` - Creates LinkedIn post from selected hook
- `evaluate_post.py` - LLM evaluates post (1-10 score + feedback)
- `publish_post.py` - Calls LinkedIn REST API

**Services** (`src/app/services/`):
- `llm_service.py` - Returns ChatGroq LLM instance
- `linkedin_service.py` - LinkedIn REST API integration

**Prompts** (`src/app/prompts/`):
- Each node has corresponding prompt template using `ChatPromptTemplate`
- Prompts enforce strict JSON output for LLM responses

**Schemas** (`src/app/schemas/`):
- `state.py` - `LinkedInState` TypedDict for LangGraph state
- `schema.py` - Pydantic models for API request/response validation

### State Flow

`LinkedInState` carries: `topic`, `hooks`, `the_best_hook`, `linkedin_post`, `score`, `status`, `message`, `linkedin_post_id`, `feedback`

### Decision Logic

`src/app/workflows/decision.py` - Determines workflow routing. Currently approves all posts (score >= 0). Modify threshold to enable improvement loop.

## Dependencies

Core dependencies (specify in `pyproject.toml` dependencies):
- `fastapi`, `uvicorn` - API framework
- `langgraph`, `langchain-groq` - LangGraph workflow + LLM
- `pydantic` - Schema validation
- `python-dotenv` - Environment loading
- `requests` - LinkedIn API calls