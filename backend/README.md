# AquanovaX Backend

This is the FastAPI backend for AquanovaX, providing a REST API over a Supabase database.

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your Supabase credentials.

4. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

5. Access API documentation:
   Open `http://localhost:8000/docs` in your browser.
