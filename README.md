
# Urban Mobility Project [UPLYFT] Setup Guide

This guide provides instructions for setting up the complete Urban Mobility project, including Python backend on Apple Silicon, Node.js backend, and frontend application.

## Python Backend Setup (Apple Silicon)

### Prerequisites
- macOS on Apple Silicon (M1/M2/M3)
- Terminal access

### Installation Steps

1. **Install Miniforge (Conda for Apple Silicon)**
   ```bash
   # Install Homebrew if not already installed
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install Miniforge
   brew install --cask miniforge
   ```

2. **Configure Conda Shell**
   ```bash
   # Initialize Conda for zsh shell
   conda init zsh
   
   # Restart terminal or reload config
   source ~/.zshrc
   ```

3. **Create Conda Environment**
   ```bash
   # Create new environment with Python 3.10
   conda create -n urban_mobility python=3.10
   
   # Activate environment
   conda activate urban_mobility
   ```

4. **Install Required Packages**
   ```bash
   # Install core scientific packages
   conda install -c conda-forge numpy=1.26.4 scipy=1.11.4 scikit-learn=1.4.1 pydantic=2.6.1 requests=2.31.0
   
   # Install FastAPI and Uvicorn
   conda install -c conda-forge fastapi=0.110.0 uvicorn=0.29.0
   
   # Install any additional requirements
   pip install -r requirements.txt
   ```

5. **Run the Python Backend**
   ```bash
   cd delivery
   uvicorn app.main:app --reload
   ```

## Node.js Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd node_backend
   ```

2. **Install Dependencies**
   ```bash
   npm i
   ```

3. **Start PostgreSQL Database**
   ```bash
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=<yourPassword> postgres
   ```
   > Replace `<yourPassword>` with a secure password

4. **Set Up Database with Prisma**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start Node.js Server**
   ```bash
   node app.js
   ```

## Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm i
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Maintenance

**Deactivating Python Environment**
```bash
conda deactivate
```

**Removing Python Environment (if needed)**
```bash
conda env remove -n urban_mobility
```
