// src/lib/openrouter.ts

const OPENROUTER_API_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * Interface for the response from OpenRouter's model list endpoint (simplified).
 */
export interface OpenRouterModel {
  id: string;
  name: string;
}

// Helper function to generate a random string for the code verifier
function generateCodeVerifier(length: number = 64): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Helper function to generate the code challenge from the code verifier using SHA-256
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  // Convert ArrayBuffer to base64url string
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Function to initiate the OpenRouter OAuth PKCE flow
export async function initiateOpenRouterOAuth(callbackUrl: string): Promise<void> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store the code verifier for later use in the callback
  localStorage.setItem('openRouterCodeVerifier', codeVerifier);

  const authUrl = `https://openrouter.ai/auth?callback_url=${encodeURIComponent(callbackUrl)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;

  // Redirect the user to the OpenRouter authorization page
  window.location.href = authUrl;
}

// Function to exchange the authorization code for an API key
export async function exchangeCodeForApiKey(code: string, callbackUrl: string): Promise<string> {
  const codeVerifier = localStorage.getItem('openRouterCodeVerifier');

  if (!codeVerifier) {
    throw new Error('Code verifier not found in localStorage.');
  }

  const response = await fetch('https://openrouter.ai/api/v1/auth/keys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: code,
      code_verifier: codeVerifier,
      code_challenge_method: 'S256',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to exchange code for API key: ${response.statusText} - ${errorData.message || ''}`);
  }

  const data = await response.json();
  // Clean up the stored code verifier
  localStorage.removeItem('openRouterCodeVerifier');
  return data.key;
}

export async function getOpenRouterModels(): Promise<OpenRouterModel[]> {
  const response = await fetch('https://openrouter.ai/api/v1/models');
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }
  const data = await response.json();
  // Assuming the API returns an array of models directly or within a 'data' key
  // Adjust based on actual API response structure
  return data.data || data;
}

/**
 * Tests the OpenRouter API key by attempting to fetch the list of available models.
 * @param apiKey The OpenRouter API key.
 * @returns A promise that resolves to true if the key is valid, false otherwise.
 * @throws An error if the API request fails for network or other reasons.
 */
export async function testOpenRouterApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey || !apiKey.trim()) {
    console.error('OpenRouter API key is empty.');
    return false;
  }

  try {
    const response = await fetch(`${OPENROUTER_API_BASE_URL}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // const data = await response.json(); // Optionally process data
      // console.log('Successfully fetched models:', data);
      return true; // Key is likely valid if we get a 2xx response
    } else {
      console.error('OpenRouter API key test failed:', response.status, await response.text());
      return false;
    }
  } catch (error) {
    console.error('Error testing OpenRouter API key:', error);
    throw error; // Re-throw for the caller to handle, or return false
  }
}

/**
 * Example function to make a simple chat completion request to OpenRouter.
 * This is a placeholder and would need to be adapted based on specific model requirements.
 * @param apiKey The OpenRouter API key.
 * @param model The model to use (e.g., 'openai/gpt-3.5-turbo').
 * @param messages The array of messages for the chat.
 * @returns A promise that resolves to the API response.
 */
export async function simpleChatCompletion(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>
) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('OpenRouter API key is required.');
  }

  try {
    const response = await fetch(`${OPENROUTER_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // OpenRouter might require specific headers for some models or features
        // 'HTTP-Referer': 'YOUR_SITE_URL', // Optional: See OpenRouter docs
        // 'X-Title': 'YOUR_APP_NAME', // Optional: See OpenRouter docs
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        // Add other parameters like temperature, max_tokens as needed
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenRouter chat completion error:', response.status, errorBody);
      throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error with OpenRouter chat completion:', error);
    throw error;
  }
}