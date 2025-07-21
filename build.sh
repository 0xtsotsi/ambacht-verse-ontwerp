#!/bin/bash

echo "🐳 Building React app with Docker (avoiding WSL filesystem issues)..."

# Clean previous builds
rm -rf dist

# Build using Docker
docker run --rm \
  -v "$(pwd)":/app \
  -w /app \
  node:20-alpine \
  sh -c "npm ci && npm run build"

echo "✅ Build complete! Check the dist/ folder"