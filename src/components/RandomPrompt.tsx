
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const RANDOM_PROMPTS = [
  "A serene Japanese garden in autumn with maple leaves floating on a koi pond",
  "Design a futuristic smart home interface that's intuitive for elderly users",
  "Write a short story about a robot that develops emotions",
  "Create a step-by-step guide for baking the perfect sourdough bread",
  "Explain quantum computing to a 10-year-old child",
  "Generate ideas for a sustainable urban garden in a small apartment",
  "Describe the optimal workout routine for someone with lower back issues",
  "Draft an email requesting a deadline extension from a professor",
  "How would you explain climate change to someone who doesn't believe in it?",
  "Create a marketing strategy for an eco-friendly clothing brand",
  "Design a logo for a coffee shop named 'Brew Haven'",
  "Write a poem about the night sky from the perspective of an astronomer",
  "What are five unconventional uses for everyday household items?",
  "Create a beginner's guide to investing in cryptocurrency",
  "Explain how blockchain technology works using simple analogies"
];

interface RandomPromptProps {
  onSelectPrompt: (prompt: string) => void;
  isImageMode: boolean;
}

export function RandomPrompt({ onSelectPrompt, isImageMode }: RandomPromptProps) {
  const IMAGE_PROMPTS = [
    "A cyberpunk cityscape at sunset with neon signs and flying cars, cinematic lighting, ultra-detailed",
    "Ancient temple ruins in a lush jungle, mist rising, dramatic lighting, high resolution render",
    "A steampunk flying ship above Victorian London with intricate mechanical details and brass accents",
    "Cosmic jellyfish floating through space nebula, bioluminescent details, photorealistic",
    "A cozy cottage in an enchanted forest, fairy lights, magical atmosphere, golden hour lighting",
    "Underwater lost city of Atlantis, ancient architecture, ethereal blue lighting, highly detailed",
    "Futuristic desert outpost, massive sand dunes, sci-fi elements, golden hour",
    "Miniature world inside an antique pocket watch, tiny buildings and people, intricate mechanics",
    "Crystal ice palace in the Arctic, prismatic light refractions, detailed ice architecture",
    "Surreal floating islands with waterfalls cascading into the clouds below, dreamlike quality",
    "Ancient dragon perched on mountain peak, scales with intricate details, majestic wings, moody atmosphere",
    "Victorian botanical laboratory with exotic plants, glass terrariums, scientific instruments",
    "Abandoned space station corridor with emergency lights, floating debris, photorealistic style",
    "Medieval fantasy tavern interior, warm fireplace, diverse adventurers, ambient lighting",
    "Giant tree city with hanging lanterns, bridges connecting tree houses, sunset glow"
  ];

  const getRandomPrompt = () => {
    const prompts = isImageMode ? IMAGE_PROMPTS : RANDOM_PROMPTS;
    const randomIndex = Math.floor(Math.random() * prompts.length);
    onSelectPrompt(prompts[randomIndex]);
    toast.success("Random prompt inserted!");
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
