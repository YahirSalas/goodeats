#!/bin/bash

# Exit on error
set -e

# Build frontend
cd ../client
npm install
npm run build

# Back to backend (Railway root dir)
cd ../backend