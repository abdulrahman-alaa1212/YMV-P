
"use client"; 

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, LayoutList, FileText, LogOut, KeyRound, Brain, Send } from 'lucide-react'; // Added KeyRound, Brain, and Send
import { testOpenRouterApiKey, simpleChatCompletion, getOpenRouterModels, initiateOpenRouterOAuth, exchangeCodeForApiKey, OpenRouterModel } from '@/lib/openrouter'; // Added OpenRouter service and simpleChatCompletion, and getOpenRouterModels
import { Input } from '@/components/ui/input'; // Added Input
import { Label } from '@/components/ui/label'; // Added Label
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Added Select components 

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openRouterApiKey, setOpenRouterApiKey] = useState('');
  const [openRouterStatusMessage, setOpenRouterStatusMessage] = useState('');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [aiError, setAiError] = useState('');
  const [openRouterModels, setOpenRouterModels] = useState<OpenRouterModel[]>([]); // State for models
  const [selectedModel, setSelectedModel] = useState<string>(''); // State for selected model
  const [isLoadingModels, setIsLoadingModels] = useState(false); // State for loading models 

  useEffect(() => {
    const adminAuth = localStorage.getItem('isAdminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/login');
      return; // Stop further execution if not authenticated
    }
    setIsLoading(false);

    // Check for OAuth code in URL on redirect
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange code for API key
      const callbackUrl = `${window.location.origin}/admin`; // Must match the callback URL used in initiateOpenRouterOAuth
      exchangeCodeForApiKey(code, callbackUrl)
        .then((apiKey) => {
          localStorage.setItem('openRouterApiKey', apiKey);
          setOpenRouterApiKey(apiKey);
          setOpenRouterStatusMessage('Successfully connected with OpenRouter via OAuth!');
          fetchModels(apiKey); // Fetch models after successful connection
          // Clean up URL
          urlParams.delete('code');
          window.history.replaceState({}, document.title, `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`);
        })
        .catch((error: any) => {
          console.error('OAuth exchange failed:', error);
          setOpenRouterStatusMessage(`OAuth connection failed: ${error.message}`);
          // Clean up URL even on error
          urlParams.delete('code');
          window.history.replaceState({}, document.title, `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`);
        });
    } else {
      // Load existing OpenRouter API key from localStorage if no code is present
      const storedKey = localStorage.getItem('openRouterApiKey');
      if (storedKey) {
        setOpenRouterApiKey(storedKey);
        // Attempt to fetch models if key exists on mount
        fetchModels(storedKey);
      }
    }
  }, [router]);

  // Function to fetch models
  const fetchModels = async (key: string) => {
    setIsLoadingModels(true);
    try {
      const models = await getOpenRouterModels();
      setOpenRouterModels(models);
      // Set a default model if available, e.g., the first one or a preferred one
      if (models.length > 0) {
        setSelectedModel(models[0].id); // Select the first model by default
      }
    } catch (error) {
      console.error('Failed to fetch OpenRouter models:', error);
      // Optionally set an error message for the user
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleSaveOpenRouterKey = async () => {
    setIsSavingKey(true);
    setOpenRouterStatusMessage('');
    // Basic validation (can be improved)
    if (!openRouterApiKey.trim()) {
      setOpenRouterStatusMessage('API Key cannot be empty.');
      setIsSavingKey(false);
      return;
    }

    try {
      const isValid = await testOpenRouterApiKey(openRouterApiKey);
      if (isValid) {
        localStorage.setItem('openRouterApiKey', openRouterApiKey);
        setOpenRouterStatusMessage('OpenRouter API Key is valid and saved successfully!');
        fetchModels(openRouterApiKey); // Fetch models after successful key save
      } else {
        setOpenRouterStatusMessage('OpenRouter API Key is invalid. Please check and try again.');
      }
    } catch (error: any) {
      console.error('Error testing/saving OpenRouter API Key:', error);
      setOpenRouterStatusMessage('Failed to test or save API Key. Check console for details.');
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleTestAiFeature = async () => {
    if (!openRouterApiKey) {
      setAiError('OpenRouter API Key is not set. Please save a valid key first.');
      return;
    }
    if (!aiPrompt.trim()) {
      setAiError('Prompt cannot be empty.');
      return;
    }

    setIsGeneratingResponse(true);
    setAiResponse('');
    setAiError('');

    if (!selectedModel) {
      setAiError('Please select an AI model.');
      return;
    }

    try {
      const messages = [{ role: 'user', content: aiPrompt }];
      // Use the selected model
      const result = await simpleChatCompletion(openRouterApiKey, selectedModel, messages);
      
      if (result.choices && result.choices.length > 0 && result.choices[0].message) {
        setAiResponse(result.choices[0].message.content);
      } else {
        setAiError('Received an unexpected response structure from the AI.');
        console.error('Unexpected AI response:', result);
      }
    } catch (error: any) {
      console.error('Error calling AI feature:', error);
      setAiError(error.message || 'Failed to get response from AI. Check console for details.');
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    window.dispatchEvent(new Event('adminAuthChanged')); // Notify navbar
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-10">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
        <p className="text-xl font-semibold text-primary">Verifying access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This ideally should not be reached if redirect works, but as a fallback
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-10">
            <p className="text-xl font-semibold text-destructive">Access Denied.</p>
            <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-3xl font-bold text-primary">Admin Dashboard</CardTitle>
            <CardDescription className="text-lg">
              Manage your Yura Mid-Vision application settings and content.
            </CardDescription>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <LayoutList className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Manage Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 min-h-[60px]">
                Add, edit, or remove AR/MR solution providers from the directory.
              </p>
              <Button disabled className="w-full">Go to Provider Management (Soon)</Button>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Manage Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 min-h-[60px]">
                Update text and images on the landing page and other informational sections.
              </p>
              <Button disabled className="w-full">Go to Content Management (Soon)</Button>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 min-h-[60px]">
                Configure general site settings, themes, or integrations.
              </p>
              <Button disabled className="w-full">Go to Site Settings (Soon)</Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* OpenRouter OAuth PKCE Integration Card */}
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-primary mr-3" />
            <div>
              <CardTitle className="text-2xl font-bold text-primary">OpenRouter AI Integration (OAuth PKCE)</CardTitle>
              <CardDescription className="text-md">
                Connect your OpenRouter account using OAuth PKCE for a more secure integration.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the button below to connect your OpenRouter account. You will be redirected to OpenRouter to authorize the application.
          </p>
          <Button onClick={() => initiateOpenRouterOAuth(`${window.location.origin}/admin`)} className="w-full md:w-auto">
            <KeyRound className="mr-2 h-4 w-4" />
            Connect with OpenRouter (OAuth)
          </Button>
          {/* Status messages for OAuth flow will go here */}
        </CardContent>
      </Card>

      {/* OpenRouter API Configuration Card */}
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-primary mr-3" />
            <div>
              <CardTitle className="text-2xl font-bold text-primary">OpenRouter AI Integration</CardTitle>
              <CardDescription className="text-md">
                Configure your OpenRouter API key to enable AI features.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="openrouter-api-key" className="flex items-center text-md mb-2">
              <KeyRound className="mr-2 h-4 w-4 text-primary" />
              OpenRouter API Key
            </Label>
            <Input
              id="openrouter-api-key"
              type="password" // Use password type to obscure the key
              placeholder="sk-or-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={openRouterApiKey}
              onChange={(e) => setOpenRouterApiKey(e.target.value)}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your API key is stored locally in your browser. 
              <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                Get your key here.
              </a>
            </p>
          </div>
          <Button onClick={handleSaveOpenRouterKey} className="w-full md:w-auto" disabled={isSavingKey || !openRouterApiKey.trim()}>
            {isSavingKey ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Settings className="mr-2 h-4 w-4" />
            )}

            {isSavingKey ? 'Saving...' : 'Save & Test API Key'}
          </Button>
          {openRouterStatusMessage && (
            <p className={`text-sm mt-2 ${openRouterStatusMessage.includes('success') ? 'text-green-600' : 'text-destructive'}`}>
              {openRouterStatusMessage}
            </p>
          )}


          {/* AI Test Section */}
          {openRouterApiKey && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-lg font-semibold mb-2 text-primary flex items-center">
                <Brain className="mr-2 h-5 w-5" /> Test Basic AI Chat
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Enter a prompt to test the connection with a selected AI model via OpenRouter.
            </p>
              <div className="space-y-3">
                {/* Model Selection Dropdown */}
                <div>
                  <Label htmlFor="ai-model-select" className="text-md">Select AI Model:</Label>
                  <Select onValueChange={setSelectedModel} value={selectedModel} disabled={isLoadingModels || openRouterModels.length === 0}>
                    <SelectTrigger id="ai-model-select" className="w-full mt-1">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingModels ? (
                        <SelectItem value="loading" disabled>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading models...
                        </SelectItem>
                      ) : openRouterModels.length === 0 ? (
                        <SelectItem value="no-models" disabled>No models available</SelectItem>
                      ) : (
                        openRouterModels.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {isLoadingModels && <p className="text-sm text-muted-foreground mt-1">Fetching models...</p>}
                </div>

                {/* Prompt Input */}
                <div>
                  <Label htmlFor="ai-prompt" className="text-md">Your Prompt:</Label>
                  <Input 
                    id="ai-prompt"
                    placeholder="e.g., What is the capital of France?"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="text-base mt-1"
                  />
                </div>
                <Button onClick={handleTestAiFeature} disabled={isGeneratingResponse || !aiPrompt.trim() || !openRouterApiKey}>
                  {isGeneratingResponse ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" /> // Assuming Send icon is available or import it
                  )}
                  {isGeneratingResponse ? 'Generating...' : 'Send Prompt'}
                </Button>
                {aiError && (
                  <p className="text-sm text-destructive">Error: {aiError}</p>
                )}
                {aiResponse && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <p className="text-sm font-semibold">AI Response:</p>
                    <p className="text-sm whitespace-pre-wrap">{aiResponse}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
       <p className="text-center text-muted-foreground pt-4">
        Note: This is a basic admin dashboard. A real-world implementation would require robust authentication and dedicated interfaces for each management task.
      </p>
    </div>
  );
}
