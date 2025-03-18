# Use the official Python image (3.10-slim) which supports multi-arch
FROM python:3.10-slim

# Prevent Python from writing .pyc files to disk and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory to /app
WORKDIR /app

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port 4000 (used by uvicorn in this service)
EXPOSE 4000

# Run the FastAPI application using Uvicorn on port 4000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4000", "--reload"]
