# Gemini AI Model Configuration

The project now uses **Gemini 2.0 Flash (Experimental)** for better performance and capabilities.

## Available Gemini Models (Recommended Order)

1. **`gemini-2.0-flash-exp`** (Recommended) - Latest experimental model with enhanced reasoning
2. **`gemini-exp-1206`** - Advanced experimental model
3. **`gemini-2.5-pro`** - Production model with higher quality
4. **`gemini-2.5-flash`** - Fast, cost-effective model

## Configuration

Set in `.env.local`:

```bash
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
```

## Model Capabilities Comparison

| Model | Speed | Quality | Context | Best for |
|-------|-------|---------|---------|----------|
| `gemini-2.0-flash-exp` | ⚡️⚡️⚡️ | ⭐️⭐️⭐️⭐️⭐️ | 1M tokens | Production + Quality |
| `gemini-2.5-pro` | ⚡️⚡️ | ⭐️⭐️⭐️⭐️⭐️ | 2M tokens | Complex analysis |
| `gemini-2.5-flash` | ⚡️⚡️⚡️⚡️ | ⭐️⭐️⭐️⭐️ | 1M tokens | Speed + Cost |

## Getting API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Add to `.env.local`

## Testing

After updating the model, restart the dev server:

```bash
npm run dev
```

Test the new model by:
1. Opening `/dashboard`
2. Clicking "Analyze now"
3. Or using `/voice` for conversational analysis
