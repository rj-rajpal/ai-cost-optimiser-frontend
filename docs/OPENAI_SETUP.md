# OpenAI Service Setup Guide

This guide explains how to set up and use the OpenAI service in your AI Cost Optimizer application.

## Overview

The OpenAI service provides direct integration with OpenAI's Chat Completions API, allowing you to:
- Send direct messages to various OpenAI models
- Maintain conversation history
- Stream responses in real-time
- Get cost optimization advice
- Estimate usage costs

## Configuration

### 1. Environment Variables

Create a `.env` file in your project root and add your OpenAI API key:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-actual-api-key-here

# Other existing variables...
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Get Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

⚠️ **Important**: Never commit your API key to version control. The `.env` file should be added to `.gitignore`.

## Usage Examples

### Basic Import

```javascript
import { openaiService } from '../services';
// or
import openaiService from '../services/openaiService';
```

### 1. Simple Message

```javascript
// Send a simple message
const response = await openaiService.sendMessage("What is React?");
console.log(response); // AI's response as string
```

### 2. Chat with System Prompt

```javascript
// Send message with system instructions
const systemPrompt = "You are a helpful AI cost optimization expert.";
const userMessage = "How can I reduce my OpenAI API costs?";

const response = await openaiService.sendWithSystemPrompt(
  systemPrompt, 
  userMessage
);
console.log(response);
```

### 3. Conversation with History

```javascript
// Maintain conversation history
const messageHistory = [
  { role: 'user', content: 'Hello!' },
  { role: 'assistant', content: 'Hi! How can I help you today?' }
];

const result = await openaiService.continueConversation(
  messageHistory, 
  "Tell me about AI costs"
);

console.log(result.response); // Latest AI response
console.log(result.updatedHistory); // Complete conversation history
console.log(result.usage); // Token usage information
```

### 4. Streaming Responses

```javascript
// Stream responses for real-time UI updates
const messages = [
  { role: 'user', content: 'Explain machine learning in detail' }
];

const fullResponse = await openaiService.streamChatCompletion(
  messages,
  (chunk, data) => {
    // Called for each chunk of the response
    console.log('Chunk:', chunk);
    // Update your UI here
  },
  { model: 'gpt-4' }
);

console.log('Complete response:', fullResponse);
```

### 5. Cost Optimization Advice

```javascript
// Get specialized cost optimization advice
const advice = await openaiService.getCostOptimizationAdvice(
  "I'm spending $500/month on GPT-4. How can I optimize this?"
);
console.log(advice);
```

### 6. Cost Estimation

```javascript
// Estimate costs before making requests
const messages = [
  { role: 'user', content: 'Write a long article about AI' }
];

const estimate = openaiService.estimateCost(messages, 'gpt-4');
console.log(`Estimated input cost: $${estimate.estimatedInputCost.toFixed(4)}`);
console.log(`Input tokens: ${estimate.inputTokens}`);
```

### 7. Model Information

```javascript
// Get available models
const models = await openaiService.getModels();
console.log('Available models:', models.map(m => m.id));
```

## Advanced Configuration

### Custom Model and Parameters

```javascript
const options = {
  model: 'gpt-4',
  temperature: 0.3,
  max_tokens: 500,
  top_p: 0.9
};

const response = await openaiService.sendMessage(
  "Explain quantum computing", 
  options
);
```

### Direct Chat Completion

```javascript
// Use the full chat completion API
const messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Hello!' }
];

const fullResponse = await openaiService.chatCompletion(messages, {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  max_tokens: 150
});

console.log(fullResponse.choices[0].message.content);
console.log('Usage:', fullResponse.usage);
```

## React Component Integration

### Simple Chat Component

```jsx
import React, { useState } from 'react';
import { openaiService } from '../services';

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      const result = await openaiService.sendMessage(message);
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      
      {response && (
        <div>
          <h4>Response:</h4>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
```

### Streaming Chat Component

```jsx
import React, { useState } from 'react';
import { openaiService } from '../services';

const StreamingChat = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [streaming, setStreaming] = useState(false);

  const handleStreamSend = async () => {
    if (!message.trim()) return;
    
    setStreaming(true);
    setResponse('');
    
    const messages = [{ role: 'user', content: message }];
    
    try {
      await openaiService.streamChatCompletion(
        messages,
        (chunk) => {
          setResponse(prev => prev + chunk);
        }
      );
    } catch (error) {
      console.error('Streaming error:', error);
      setResponse('Error: ' + error.message);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div>
      <div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleStreamSend} disabled={streaming}>
          {streaming ? 'Streaming...' : 'Send'}
        </button>
      </div>
      
      <div>
        <h4>Response:</h4>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {response}
          {streaming && <span className="cursor">|</span>}
        </div>
      </div>
    </div>
  );
};
```

## Error Handling

The service includes comprehensive error handling:

```javascript
try {
  const response = await openaiService.sendMessage("Hello");
  console.log(response);
} catch (error) {
  switch (true) {
    case error.message.includes('API key'):
      console.error('Please configure your OpenAI API key');
      break;
    case error.message.includes('quota'):
      console.error('API quota exceeded');
      break;
    case error.message.includes('rate limit'):
      console.error('Rate limit exceeded, please wait');
      break;
    case error.message.includes('Network error'):
      console.error('Network connection issue');
      break;
    default:
      console.error('Unexpected error:', error.message);
  }
}
```

## Model Pricing (2024)

The service includes built-in pricing information for cost estimation:

| Model | Input (per 1K tokens) | Output (per 1K tokens) |
|-------|----------------------|------------------------|
| GPT-4 | $0.03 | $0.06 |
| GPT-4 Turbo | $0.01 | $0.03 |
| GPT-3.5 Turbo | $0.001 | $0.002 |
| GPT-4o | $0.005 | $0.015 |
| GPT-4o Mini | $0.00015 | $0.0006 |

## Best Practices

### 1. API Key Security
- Never hardcode API keys in your source code
- Use environment variables for configuration
- Add `.env` to your `.gitignore` file
- Use different API keys for development and production

### 2. Cost Management
- Use the `estimateCost()` method before expensive operations
- Choose the right model for your use case (GPT-3.5 for simple tasks)
- Implement request caching for repeated queries
- Monitor your usage on the OpenAI dashboard

### 3. Error Handling
- Always wrap API calls in try-catch blocks
- Implement retry logic for transient errors
- Provide user-friendly error messages
- Log errors for debugging

### 4. Performance
- Use streaming for long responses
- Implement request debouncing for user input
- Cache model lists and other static data
- Consider implementing request queues for high-volume applications

### 5. User Experience
- Show loading states during API calls
- Implement streaming for real-time responses
- Provide cost estimates to users
- Allow users to select different models

## Integration with Existing Services

You can use the OpenAI service alongside the existing `chatService`:

```javascript
import { chatService, openaiService } from '../services';

// Use chatService for structured cost optimization data
const structuredResponse = await chatService.sendInteractiveMessage(
  "Optimize my AI costs"
);

// Use openaiService for general AI interactions
const generalResponse = await openaiService.sendMessage(
  "Explain the response above in simple terms"
);
```

## Troubleshooting

### Common Issues

1. **"OpenAI API key is not configured"**
   - Check that `OPENAI_API_KEY` is set in your `.env` file
   - Restart your development server after adding the variable

2. **"Network error: Unable to connect to OpenAI API"**
   - Check your internet connection
   - Verify the API key is valid
   - Check if your firewall is blocking the request

3. **"API quota exceeded"**
   - Check your OpenAI account billing
   - Consider upgrading your plan or adding credits

4. **"Rate limit exceeded"**
   - Implement request throttling
   - Add delays between requests
   - Consider upgrading to a higher tier plan

## Environment File Template

Create a `.env` file in your project root:

```env
# Required: OpenAI API Key
OPENAI_API_KEY=sk-proj-your-actual-api-key-here

# Existing configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_APP_ENV=development
```

Remember to add `.env` to your `.gitignore` file if it's not already there! 