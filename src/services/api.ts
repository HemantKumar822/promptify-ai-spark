
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface EnhancePromptResponse {
  enhancedPrompt: string;
  error?: string;
}

// Get API key from user account or localStorage
const getApiKey = async (): Promise<string> => {
  try {
    // Try to get from user's account first
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
    }
    
    if (user) {
      console.log('Checking for encrypted API key for user:', user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('api_key_encrypted')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }
      
      if (profile?.api_key_encrypted) {
        try {
          console.log('Found encrypted API key, decrypting...');
          // Decrypt the API key
          const decryptedKey = await decryptApiKey(profile.api_key_encrypted, user.id);
          if (decryptedKey && decryptedKey.trim()) {
            console.log('Successfully decrypted API key');
            return decryptedKey;
          }
        } catch (error) {
          console.error('Error decrypting API key:', error);
        }
      }
    }
    
    // Fallback to localStorage
    console.log('Checking localStorage for API key...');
    const localKey = localStorage.getItem('openrouter-api-key');
    if (localKey && localKey.trim()) {
      console.log('Found API key in localStorage');
      return localKey;
    }
    
    console.log('No API key found in profile or localStorage');
    return "";
  } catch (error) {
    console.error('Error in getApiKey:', error);
    return "";
  }
};

// Decrypt function (same as in SettingsModal)
const decryptApiKey = async (encryptedKey: string, userSecret: string): Promise<string> => {
  try {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    const combined = new Uint8Array(atob(encryptedKey).split('').map(char => char.charCodeAt(0)))
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(userSecret.padEnd(32, '0')),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted)
    return decoder.decode(decrypted)
  } catch {
    return ''
  }
};

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

// Check if API key is available
export const hasApiKey = async (): Promise<boolean> => {
  const apiKey = await getApiKey();
  return apiKey.trim() !== "";
};

// Enhanced API call for both text and image prompts
export const enhancePrompt = async (prompt: string, isImageMode: boolean = false, enhancementMode: string = "professional"): Promise<EnhancePromptResponse> => {
  // Display a loading message
  const loadingToast = toast.loading(`Enhancing your ${isImageMode ? "image" : "text"} prompt...`);
  
  try {
    // Use OpenRouter API for all prompt enhancements
    const enhancedPrompt = await callOpenRouterAPI(prompt, isImageMode, enhancementMode);
    toast.dismiss(loadingToast);
    toast.success(`${isImageMode ? "Image" : "Text"} prompt enhanced successfully!`);
    return { enhancedPrompt };
  } catch (error) {
    // Handle errors
    toast.dismiss(loadingToast);
    toast.error("Failed to enhance prompt. Please try again.");
    
    return { 
      enhancedPrompt: "", 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

// Call to OpenRouter API for all prompt enhancements
async function callOpenRouterAPI(prompt: string, isImagePrompt: boolean = false, enhancementMode: string = "professional"): Promise<string> {
  try {
    // Get the user's API key
    const apiKey = await getApiKey();
    
    if (!apiKey || apiKey.trim() === "") {
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
        "HTTP-Referer": window.location.origin,
        "X-Title": "AI Prompt Engineer"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
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
