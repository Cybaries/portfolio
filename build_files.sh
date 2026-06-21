#!/bin/bash

# Build script for Vercel
echo "Building Project Packages..."
python3.10 -m pip install -r requirements.txt

echo "Collecting Static Files..."
python3.10 manage.py collectstatic --noinput

echo "Running Migrations..."
python3.10 manage.py migrate

echo "Seeding Database..."
python3.10 manage.py seed_resume