# Running FASTAPI

## Setup and Execution

1. Navigate to the backend directory:

   ```sh
   cd backend
   ```

2. Activate the virtual environment:

   - On Windows:
     ```sh
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```sh
     source venv/bin/activate
     ```

3. Run the FASTAPI application:
   ```sh
   uvicorn app.main:app --reload
   ```
