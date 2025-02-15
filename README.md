# Setting Up Urban Mobility Backend on Apple Silicon

## 1. Install Miniforge (Conda for Apple Silicon)

bash

# Install Homebrew if not already installed

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Miniforge

brew install --cask miniforge

## 2. Configure Conda Shell

bash

# Initialize Conda for zsh shell

conda init zsh

# Restart terminal or reload config

source ~/.zshrc

## 3. Create Conda Environment

bash

# Create new environment with Python 3.10 (recommended for scipy 1.11.4)

conda create -n urban_mobility python=3.10

# Activate environment

conda activate urban_mobility

## 4. Install Core Scientific Packages

bash
conda install -c conda-forge \
 numpy=1.26.4 \
 scipy=1.11.4 \
 scikit-learn=1.4.1 \
 pydantic=2.6.1 \
 requests=2.31.0

## 5. Install FastAPI and Uvicorn

bash
conda install -c conda-forge \
 fastapi=0.110.0 \
 uvicorn=0.29.0

## 6. Install Additional Requirements (if any)

For packages not available through Conda:

bash
pip install -r requirements.txt

## Running the Application

bash
cd delivery
uvicorn main:app --reload

for deactivation

conda deactivate
conda env remove -n urban_mobility
