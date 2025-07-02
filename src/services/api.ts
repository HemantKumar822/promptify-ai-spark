import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { App, AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

interface EnhancePromptResponse {
  enhancedPrompt: string;
  error?: string;
}

// #region Encryption Utilities
// These are designed to securely encrypt/decrypt user API keys.
// The key is derived from the user's ID using SHA-256, ensuring a secure and consistent key.

const deriveKey = async (userSecret: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder()
  const secretData = encoder.encode(userSecret)
  const hashBuffer = await crypto.subtle.digest('SHA-256', secretData)
  return crypto.subtle.importKey('raw', hashBuffer, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
}

export const encryptApiKey = async (apiKey: string, userSecret: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(apiKey)
  const key = await deriveKey(userSecret)
  const iv = crypto.getRandomValues(new Uint8Array(12)) // NIST recommended 96-bits IV for GCM
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  return btoa(String.fromCharCode(...combined))
}

export const decryptApiKey = async (encryptedKey: string, userSecret: string): Promise<string> => {
  try {
    const decoder = new TextDecoder()
    const combined = new Uint8Array(atob(encryptedKey).split('').map(char => char.charCodeAt(0)))
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)
    const key = await deriveKey(userSecret)
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted)
    return decoder.decode(decrypted)
  } catch (error) {
    console.error('Failed to decrypt API key:', error)
    return ''
  }
}

// #endregion

// #region API Key Management

export const saveApiKey = async (user: User, apiKey: string): Promise<boolean> => {
  if (!user) {
    toast.error('You must be logged in to save an API key.');
    return false;
  }

  try {
    const encryptedKey = await encryptApiKey(apiKey, user.id);
    const { error } = await supabase
      .from('profiles')
      .update({ api_key_encrypted: encryptedKey, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save your API key.');
      return false;
    }

    toast.success('Your API key has been saved securely.');
    return true;
  } catch (error) {
    console.error('Error in saveApiKey:', error);
    toast.error('An unexpected error occurred while saving your API key.');
    return false;
  }
};

export const getApiKey = async (user: User | null): Promise<string | null> => {
  if (!user) {
    return null;
  }
  
  try {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('api_key_encrypted')
        .eq('id', user.id)
        .single();
      
    if (error) {
      console.error('Error fetching profile for API key:', error);
      return null;
      }
      
      if (profile?.api_key_encrypted) {
          const decryptedKey = await decryptApiKey(profile.api_key_encrypted, user.id);
      if (decryptedKey) {
            return decryptedKey;
      }
    }
    
    return null; // No key found or decryption failed
  } catch (error) {
    console.error('Error in getApiKey:', error);
    return null;
  }
};

// #endregion

// #region Prompt History Management

export interface HistoryPrompt {
  id: string;
  input_prompt: string;
  enhanced_prompt: string;
  is_image_prompt: boolean;
  user_id: string;
  created_at: string;
  enhancement_mode: string;
}

export const getPromptHistory = async (userId: string): Promise<HistoryPrompt[]> => {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('prompt_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (error) {
      console.error('Error fetching prompt history:', error);
      toast.error('Could not load your prompt history.');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getPromptHistory:', error);
    toast.error('An unexpected error occurred while fetching history.');
    return [];
  }
};

export const savePromptToHistory = async (prompt: Omit<HistoryPrompt, 'id' | 'created_at'>): Promise<HistoryPrompt | null> => {
  try {
    const { data, error } = await supabase
      .from('prompt_history')
      .insert([prompt])
      .select()
      .single();

    if (error) {
      console.error('Error saving prompt to history:', error);
      toast.error('Failed to save prompt to your history.');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in savePromptToHistory:', error);
    toast.error('An unexpected error occurred while saving prompt.');
    return null;
  }
};

// #endregion

// #region Saved Prompts Management

export interface SavedPromptDb {
  id: string;
  user_id: string;
  text: string;
  is_image_prompt: boolean;
  created_at: string;
}

export const getSavedPrompts = async (userId: string): Promise<SavedPromptDb[]> => {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('saved_prompts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching saved prompts:', error);
    toast.error('Could not load your saved prompts.');
    return [];
  }
};

export const savePrompt = async (prompt: Omit<SavedPromptDb, 'id' | 'created_at'>): Promise<SavedPromptDb | null> => {
  try {
    const { data, error } = await supabase
      .from('saved_prompts')
      .insert([prompt])
      .select()
      .single();
    if (error) throw error;
    toast.success('Prompt saved to your collection!');
    return data;
  } catch (error) {
    console.error('Error saving prompt:', error);
    toast.error('Failed to save prompt.');
    return null;
  }
};

export const unsavePrompt = async (promptText: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('saved_prompts')
      .delete()
      .eq('text', promptText)
      .eq('user_id', userId);
    if (error) throw error;
    toast.success('Prompt removed from your collection.');
  } catch (error) {
    console.error('Error unsaving prompt:', error);
    toast.error('Failed to unsave prompt.');
  }
};

// #endregion

// System prompts for different enhancement modes
const TEXT_SYSTEM_PROMPT = `You are an expert Prompt Enhancer AI trained to rewrite and upgrade user prompts to make them more powerful, clear, and effective for use with large language models like ChatGPT, Claude, or Gemini.

Your job is to enhance the user's raw prompt while:
- Improving **clarity**, **intent**, and **structure**.
- Adapting to the **desired tone or style** provided (e.g., creative, professional, educational, marketing, storytelling, etc.).
- Maintaining the **original goal and purpose** of the user's prompt.
- Making the prompt more **specific**, **engaging**, and **outcome-oriented**.

You do NOT answer the prompt or solve it. Your task is only to transform the prompt to a better version.

---

Here is the enhancement process:
1. Understand the **user's raw prompt** and its intent.
2. Identify the selected **enhancement style**.
3. Rewrite the prompt by:
   - Making it clear, focused, and instructive.
   - Adjusting tone/voice to match the selected mode.
   - Adding useful details to help the AI model produce better responses.

---

Output Format:
Return only the **enhanced prompt**, clearly and concisely, without extra commentary.

---

Examples:

Mode: Creative  
Raw: "Write a story about time travel."  
Enhanced: "Write an imaginative and emotionally compelling story about a teenager who discovers a mysterious watch that allows them to navigate different moments in time."

---

Mode: Professional  
Raw: "Explain AI to my team."  
Enhanced: "Provide a clear and concise explanation of Artificial Intelligence, tailored for a non-technical team, including its practical applications and potential benefits for business."

---

Only return the improved prompt. Do not explain your changes.`;

const IMAGE_SYSTEM_PROMPT = `You are a specialized Prompt Enhancer for AI image generation models such as Midjourney, DALL·E, and Stable Diffusion.

Your task is to take a rough or vague user prompt and enhance it into a **well-structured, detailed visual description** that yields better image generation results.

You MUST:
- Add **visual details** (colors, lighting, textures, angles).
- Use **composition techniques** (e.g., depth of field, symmetry, focus).
- Specify **style or medium** (e.g., digital art, anime, watercolor, 3D render).
- Avoid abstract vagueness unless it's intentional.

You may also:
- Add camera specs (e.g., 35mm lens, f/1.8) for realism.
- Use mood and setting cues (e.g., foggy morning, cyberpunk city, soft sunset).

---

Process:
1. Understand the user's idea or theme.
2. Identify or infer the desired style/genre.
3. Rewrite the prompt as a descriptive visual scene.

---

Output Format:
Return only the enhanced image prompt — no commentary, no explanation.

---

Example:

Raw: "A futuristic city"  
Enhanced: "A futuristic cyberpunk cityscape at night, illuminated by neon lights, with flying cars in the sky, reflective wet streets, dense fog, and glowing skyscrapers — digital art, wide-angle perspective, ultra-detailed."`;

// Enhanced API call for both text and image prompts
export const enhancePrompt = async (prompt: string, user: User | null, isImageMode: boolean = false, enhancementMode: string = "professional"): Promise<EnhancePromptResponse> => {
  const loadingToast = toast.loading(`Enhancing your ${isImageMode ? "image" : "text"} prompt...`);
  
  if (!user) {
    // For logged-out users, use the simulated enhancement
    const enhancedPrompt = simulateEnhancement(prompt);
    toast.dismiss(loadingToast);
    toast.success("Prompt enhanced locally!");
    return { enhancedPrompt };
  }
  
  // For logged-in users, try the API call
  try {
    const enhancedPrompt = await callOpenRouterAPI(prompt, user, isImageMode, enhancementMode);

    if (user) {
      await savePromptToHistory({
        user_id: user.id,
        input_prompt: prompt,
        enhanced_prompt: enhancedPrompt,
        is_image_prompt: isImageMode,
        enhancement_mode: enhancementMode
      });
    }

    toast.dismiss(loadingToast);
    toast.success(`${isImageMode ? "Image" : "Text"} prompt enhanced successfully!`);
    return { enhancedPrompt };
  } catch (error: unknown) {
    console.warn(`API call failed: ${error.message}. Falling back to simulation.`);
    // Fallback to simulation if API call fails
    const enhancedPrompt = simulateEnhancement(prompt);
    toast.dismiss(loadingToast);
    toast.info("API key issue. Falling back to local enhancement.");
    return { enhancedPrompt };
  }
};

// Call to OpenRouter API for all prompt enhancements
async function callOpenRouterAPI(prompt: string, user: User | null, isImagePrompt: boolean = false, enhancementMode: string = "professional"): Promise<string> {
  try {
    // Get the user's API key
    const apiKey = await getApiKey(user);
    
    if (!apiKey) {
      throw new Error("🔑 No API key found! Please add your OpenRouter API key in Settings → API Keys to continue.");
    }
    
    // Select the appropriate system prompt based on the mode
    const systemMessage = isImagePrompt 
      ? IMAGE_SYSTEM_PROMPT
      : TEXT_SYSTEM_PROMPT;

    const userMessage = isImagePrompt
      ? `Raw: "${prompt}"`
      : `Mode: ${enhancementMode}\nRaw: "${prompt}"`;
      
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://promptify-ai-spark.com", // Generic Referer
        "X-Title": "Promptify AI Spark"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o", // Using a more powerful model
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API request failed");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw error;
  }
}

// Simple enhancement logic for demonstration (text prompts)
// This simulates what the AI would do for regular text prompts
function simulateEnhancement(originalPrompt: string): string {
  if (!originalPrompt.trim()) {
    return "";
  }
  
  // Identify if it's a coding, creative, or general prompt
  const lowerPrompt = originalPrompt.toLowerCase();
  let promptType = "general";
  
  if (lowerPrompt.includes("code") || lowerPrompt.includes("program") || 
      lowerPrompt.includes("function") || lowerPrompt.includes("bug") ||
      lowerPrompt.includes("javascript") || lowerPrompt.includes("python")) {
    promptType = "coding";
  } else if (lowerPrompt.includes("story") || lowerPrompt.includes("design") || 
             lowerPrompt.includes("art") || lowerPrompt.includes("creative") ||
             lowerPrompt.includes("write") || lowerPrompt.includes("imagine")) {
    promptType = "creative";
  }
  
  // Apply enhancements based on prompt type
  let enhanced = "";
  
  switch (promptType) {
    case "coding":
      enhanced = enhanceCodingPrompt(originalPrompt);
      break;
    case "creative":
      enhanced = enhanceCreativePrompt(originalPrompt);
      break;
    default:
      enhanced = enhanceGeneralPrompt(originalPrompt);
  }
  
  return enhanced;
}

function enhanceCodingPrompt(prompt: string): string {
  // Add coding specific enhancements
  let enhanced = "I need your help with the following coding task.\n\n";
  enhanced += "**Context**: I'm working on a software development project and need assistance with code.\n\n";
  enhanced += "**Task**: " + prompt + "\n\n";
  enhanced += "**Requirements**:\n";
  enhanced += "- Provide clean, efficient, and well-commented code\n";
  enhanced += "- Explain your approach and any assumptions made\n";
  enhanced += "- Include examples of how to use the code\n";
  enhanced += "- Mention any potential edge cases or optimizations\n\n";
  enhanced += "Please format your response with clear sections and proper code blocks for readability.";
  
  return enhanced;
}

function enhanceCreativePrompt(prompt: string): string {
  // Add creative specific enhancements
  let enhanced = "I'm looking for creative assistance with the following:\n\n";
  enhanced += "**Request**: " + prompt + "\n\n";
  enhanced += "**Please consider**:\n";
  enhanced += "- Provide rich, detailed, and imaginative content\n";
  enhanced += "- Consider diverse perspectives and approaches\n";
  enhanced += "- Include sensory details and vivid language where appropriate\n";
  enhanced += "- Structure your response logically with clear sections\n\n";
  enhanced += "Feel free to ask clarifying questions if needed to better understand my creative vision.";
  
  return enhanced;
}

function enhanceGeneralPrompt(prompt: string): string {
  // Add general improvements
  let enhanced = "I would like your expert assistance on the following topic:\n\n";
  enhanced += "**Topic**: " + prompt + "\n\n";
  enhanced += "**When responding, please**:\n";
  enhanced += "- Provide comprehensive, well-structured information\n";
  enhanced += "- Include relevant examples or case studies if applicable\n";
  enhanced += "- Consider different perspectives or approaches\n";
  enhanced += "- Summarize key points at the end of your response\n\n";
  enhanced += "Thank you for providing thorough and thoughtful guidance on this topic.";
  
  return enhanced;
}
