

import { GoogleGenAI, Type } from "@google/genai";
import type { StorySegment, GameState, GeminiResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    story: {
      type: Type.STRING,
      description: "The next part of the story. Describe the outcome of the player's action and the current scene. Keep it to a few sentences."
    },
    location: {
      type: Type.STRING,
      description: "The player's new location. Should be a short, descriptive name."
    },
    inventory: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "The player's current inventory. Include all items they are carrying."
    },
    gameOver: {
      type: Type.BOOLEAN,
      description: "Set to true if the player has won, lost, or the story has concluded. Otherwise, false."
    },
    objective: {
        type: Type.STRING,
        description: "A short, one-sentence objective for the player. This can change as the story progresses."
    }
  },
  required: ['story', 'location', 'inventory', 'gameOver', 'objective']
};

const SYSTEM_INSTRUCTION = `You are a creative and engaging text adventure game master. You will create a dynamic story based on player actions.
- The theme is a mysterious, slightly surreal adventure.
- Your response MUST be a valid JSON object matching the provided schema.
- Describe scenes vividly but concisely.
- The game should not be impossible, but present interesting challenges.
- Make the world react logically to the player's actions.
- If the player does something nonsensical, respond with a fitting, sometimes humorous, consequence.
- Keep the narrative moving forward.`;

function buildPrompt(storyHistory: StorySegment[], gameState: GameState, playerAction: string): string {
  const historyText = storyHistory
    .map(segment => `${segment.type === 'player' ? '> ' : ''}${segment.text}`)
    .join('\\n');

  return `
    Here is the story so far:
    ---
    ${historyText}
    ---

    Here is the player's current state:
    - Location: ${gameState.location}
    - Inventory: ${gameState.inventory.join(', ') || 'empty'}
    - Objective: ${gameState.objective}

    The player's next action is:
    > ${playerAction}

    Generate the next part of the story based on this action.
    `;
}

async function callGemini(prompt: string): Promise<GeminiResponse> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as GeminiResponse;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The story could not continue. The ancient spirits are momentarily confused.");
  }
}

export async function getInitialStory(): Promise<GeminiResponse> {
    const initialPrompt = "Start a new text adventure game. The player wakes up in a strange, surreal place with a mysterious objective. Provide the opening narration and initial game state.";
    return callGemini(initialPrompt);
}

export async function getNextStoryStep(storyHistory: StorySegment[], gameState: GameState, playerAction: string): Promise<GeminiResponse> {
    const prompt = buildPrompt(storyHistory, gameState, playerAction);
    return callGemini(prompt);
}