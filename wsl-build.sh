#!/bin/bash

echo "🚀 WSL-optimized build script"
echo "Moving project to native WSL filesystem for performance..."

# Create temp directory in WSL filesystem
WSL_BUILD_DIR="/tmp/ambacht-build-$(date +%s)"
mkdir -p "$WSL_BUILD_DIR"

# Copy project files (excluding node_modules and dist)
echo "📁 Copying project files..."
rsync -av --exclude='node_modules' --exclude='dist' --exclude='.git' --exclude='*.log' . "$WSL_BUILD_DIR/"

# Change to WSL directory
cd "$WSL_BUILD_DIR"

# Install dependencies in WSL filesystem
echo "📦 Installing dependencies..."
npm ci

# Run build
echo "🔨 Building project..."
npm run build

# Copy dist back to original location
echo "📤 Copying build output back..."
cp -r dist "$OLDPWD/"

# Cleanup
echo "🧹 Cleaning up..."
cd "$OLDPWD"
rm -rf "$WSL_BUILD_DIR"

echo "✅ Build complete! Check the dist/ folder"