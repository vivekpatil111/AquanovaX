# AquanovaX

AquanovaX is a decentralized water marketplace. This repository contains both the frontend application and the backend API.

## Project Structure

- `/frontend` - React + Vite frontend application
- `/backend` - Python + FastAPI backend application

## Quick Start

### 1. Start the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file with Supabase credentials
cp .env.example .env

uvicorn app.main:app --reload
```
The API will be available at http://localhost:8000
API Docs: http://localhost:8000/docs

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will be available at http://localhost:5173
