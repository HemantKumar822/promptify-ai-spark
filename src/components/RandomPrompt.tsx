
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type EnhancementMode = "professional" | "creative" | "academic" | "technical" | "marketing" | "storytelling";

interface RandomPromptProps {
  onSelectPrompt: (prompt: string) => void;
  isImageMode: boolean;
  enhancementMode?: EnhancementMode;
}

export function RandomPrompt({ onSelectPrompt, isImageMode, enhancementMode = "professional" }: RandomPromptProps) {
  // Creative text prompts
  const CREATIVE_PROMPTS = [
    "Write a short story about a robot that develops emotions",
    "Create an imaginative fairy tale set in a world where dreams become reality",
    "Write a poem about the night sky from the perspective of an astronomer",
    "Develop a creative concept for a video game set in an underwater civilization",
    "Write a dialogue between the sun and the moon discussing their perspectives on humanity"
  ];
  
  // Professional text prompts
  const PROFESSIONAL_PROMPTS = [
    "Draft a concise executive summary for a quarterly business report",
    "Write a professional email requesting a meeting with a potential client",
    "Create a clear and professional job description for a marketing position",
    "Develop talking points for a business presentation on digital transformation",
    "Write a formal proposal for implementing a new workflow system"
  ];
  
  // Academic text prompts
  const ACADEMIC_PROMPTS = [
    "Explain quantum computing concepts for an undergraduate physics course",
    "Develop a thesis statement for a research paper on climate change adaptation",
    "Create an outline for a literature review on artificial intelligence ethics",
    "Write an abstract for an academic paper on behavioral economics",
    "Develop a methodology section for research on sustainable urban planning"
  ];
  
  // Technical text prompts
  const TECHNICAL_PROMPTS = [
    "Create step-by-step documentation for setting up a Docker container",
    "Explain the differences between REST and GraphQL APIs for a technical blog",
    "Write pseudocode for an efficient sorting algorithm with explanations",
    "Develop troubleshooting steps for common network connectivity issues",
    "Create a technical specification for a new software feature"
  ];
  
  // Marketing text prompts
  const MARKETING_PROMPTS = [
    "Write compelling product descriptions for a new line of eco-friendly products",
    "Create a marketing email campaign for a seasonal promotion",
    "Develop a social media strategy for launching a new mobile app",
    "Write engaging copy for a landing page promoting a subscription service",
    "Create a brand story that resonates with millennial consumers"
  ];
  
  // Storytelling text prompts
  const STORYTELLING_PROMPTS = [
    "Tell a captivating story about a chance encounter that changed someone's life",
    "Create an origin story for a fictional character who discovers they have unique abilities",
    "Write a narrative about an unexpected journey through an ancient forest",
    "Develop a short story about cultural traditions passed down through generations",
    "Create a compelling narrative about overcoming adversity in an unfamiliar environment"
  ];

  // Image prompts
  const IMAGE_PROMPTS = [
    "A cyberpunk cityscape at sunset with neon signs and flying cars, cinematic lighting, ultra-detailed, 8K resolution",
    "Ancient temple ruins in a lush jungle, morning mist rising, dramatic lighting, photorealistic, high resolution render",
    "A steampunk flying ship above Victorian London with intricate mechanical details and brass accents, dramatic cloud formations, golden hour lighting",
    "Cosmic jellyfish floating through space nebula, bioluminescent details, photorealistic, volumetric lighting, astrophotography style",
    "A cozy cottage in an enchanted forest, fairy lights strung between trees, magical atmosphere, golden hour lighting, shallow depth of field, 35mm lens",
    "Underwater lost city of Atlantis, ancient architecture, ethereal blue lighting, highly detailed, ray-traced reflections, digital art",
    "Futuristic desert outpost with holographic interfaces, massive sand dunes, sci-fi elements, golden hour, cinematic composition",
    "Miniature world inside an antique pocket watch, tiny buildings and people, intricate mechanics, macro photography, tilt-shift effect",
    "Crystal ice palace in the Arctic, prismatic light refractions, detailed ice architecture, ethereal atmosphere, fantasy concept art",
    "Surreal floating islands with waterfalls cascading into the clouds below, dreamlike quality, digital painting, fantasy landscape"
  ];

  const getRandomPrompt = () => {
    let prompts;
    
    if (isImageMode) {
      prompts = IMAGE_PROMPTS;
    } else {
      // Select the appropriate text prompts based on enhancement mode
      switch (enhancementMode) {
        case "creative":
          prompts = CREATIVE_PROMPTS;
          break;
        case "professional":
          prompts = PROFESSIONAL_PROMPTS;
          break;
        case "academic":
          prompts = ACADEMIC_PROMPTS;
          break;
        case "technical":
          prompts = TECHNICAL_PROMPTS;
          break;
        case "marketing":
          prompts = MARKETING_PROMPTS;
          break;
        case "storytelling":
          prompts = STORYTELLING_PROMPTS;
          break;
        default:
          prompts = PROFESSIONAL_PROMPTS;
      }
    }
    
    const randomIndex = Math.floor(Math.random() * prompts.length);
    onSelectPrompt(prompts[randomIndex]);
    toast.success(`Random ${isImageMode ? "image" : enhancementMode} prompt inserted!`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1 text-xs"
      onClick={getRandomPrompt}
    >
      <Sparkles className="h-3.5 w-3.5" />
      Inspiration
    </Button>
  );
}
