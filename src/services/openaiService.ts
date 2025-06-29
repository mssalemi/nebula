import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ClipMarker {
  start_time: string;
  end_time: string;
  summary: string;
}

const parseOpenAIResponse = (responseText: string): ClipMarker[] => {
  try {
    // The response from OpenAI should be a clean JSON string when using JSON mode.
    const markers = JSON.parse(responseText);
    // TODO: Add validation to ensure the parsed object matches the ClipMarker[] interface.
    return markers;
  } catch (error) {
    console.error('Failed to parse OpenAI JSON response:', error);
    throw new Error('Invalid JSON response from OpenAI.');
  }
};

export const getClipMarkers = async (prompt: string): Promise<ClipMarker[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant designed to output JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 2048,
    });

    const responseText = response.choices[0].message?.content;

    if (!responseText) {
      throw new Error('Failed to get a valid response from OpenAI.');
    }

    return parseOpenAIResponse(responseText);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to communicate with OpenAI.');
  }
}; 