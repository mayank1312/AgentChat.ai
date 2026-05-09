#!/bin/bash

# Quick Start: Ollama + RAG Agent System
# Run this to get everything up and running

echo "🚀 AgentChat.ai - Ollama + RAG Setup"
echo "======================================"
echo ""

# Step 1: Check if Ollama is running
echo "1️⃣  Checking Ollama connection..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running on localhost:11434"
else
    echo "❌ Ollama is NOT running"
    echo "   Please start Ollama with: ollama serve"
    exit 1
fi

# Step 2: Check models
echo ""
echo "2️⃣  Checking available models..."
MODELS=$(curl -s http://localhost:11434/api/tags | jq -r '.models[].model' 2>/dev/null)
if [ -z "$MODELS" ]; then
    echo "⚠️  No models found. Pulling mistral..."
    ollama pull mistral
else
    echo "✅ Available models:"
    echo "$MODELS" | sed 's/^/   - /'
fi

# Step 3: Install dependencies
echo ""
echo "3️⃣  Installing npm dependencies..."
npm install --legacy-peer-deps

# Step 4: Run migrations
echo ""
echo "4️⃣  Running database migrations..."
# npx drizzle-kit push:pg

# Step 5: Start dev server
echo ""
echo "5️⃣  Starting development server..."
echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start dev server: npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Create an agent and start a meeting"
echo "4. Agent will use Ollama for responses!"
echo ""
