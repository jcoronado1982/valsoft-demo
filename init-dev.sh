#!/bin/bash
set -e

echo "🚀 Initializing local development environment..."

# 1. Root .env
if [ ! -f .env ]; then
    echo "📄 Creating root .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Action Required: Update .env with your own secrets."
else
    echo "✅ .env already exists."
fi

# 2. AI Worker .env
if [ ! -f ai/.env ]; then
    echo "📄 Creating ai/.env..."
    # Copying from root if available or template
    cat <<EOT > ai/.env
GEMINI_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
EOT
    echo "⚠️  Action Required: Update ai/.env with your Gemini/Tavily keys."
else
    echo "✅ ai/.env already exists."
fi

# 3. Backend appsettings.Development.json
BACKEND_CONF="backend/Inventory.API/appsettings.Development.json"
BACKEND_TEMP="backend/Inventory.API/appsettings.Development.json.template"

if [ ! -f "$BACKEND_CONF" ]; then
    echo "📄 Creating $BACKEND_CONF from template..."
    cp "$BACKEND_TEMP" "$BACKEND_CONF"
    echo "⚠️  Action Required: Update $BACKEND_CONF with your local settings."
else
    echo "✅ $BACKEND_CONF already exists."
fi

echo ""
echo "✨ Dev environment initialized!"
echo "👉 Next steps:"
echo "   1. Edit the .env and appsettings files mentioned above."
echo "   2. Run 'make setup' to install dependencies."
echo "   3. Run 'make dev' to start the project."
