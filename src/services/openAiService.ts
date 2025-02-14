import { ItemCarrinho, Carrinho } from '../types';
import { Item } from './itemService';

export interface AiMenuSuggestion {
  items: {
    itemId: number;
    quantity: number;
    reasoning: string;
  }[];
  totalEstimate: number;
  dietaryNotes?: string[];
}

export class OpenAiService {
  private static instance: OpenAiService;
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

  private constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenAI API key not found in environment variables');
    }
  }

  public static getInstance(): OpenAiService {
    if (!OpenAiService.instance) {
      OpenAiService.instance = new OpenAiService();
    }
    return OpenAiService.instance;
  }

  private formatItemsForPrompt(items: Item[]): string {
    return items.map(item => (
      `${item.nome} (ID: ${item.id}) - ${item.quantidade} ${item.unidadeMedida} - ${typeof item.categoria === 'string' ? item.categoria : item.categoria.nome}`
    )).join('. ');
  }

  async getMenuSuggestions(
    userInput: string,
    availableItems: Item[]
  ): Promise<AiMenuSuggestion> {
    try {
      console.log('Getting menu suggestions for input:', userInput);
      console.log('Available items count:', availableItems.length);

      const systemMessage = `You are a menu assistant for a buffet service. Your task is to suggest menu items for customers based on their needs and the available quantities. Each item listing includes its measurement unit (L, ml, g, unidade, M) which you should consider when suggesting quantities.

When responding, only provide a JSON object with the following structure:
{
  "items": [
    {"itemId": number, "quantity": number (in the item's unit of measurement), "reasoning": "string explaining why this quantity"}
  ],
  "totalEstimate": number (total cost),
  "dietaryNotes": ["relevant dietary notes"]
}

Make sure to respect each item's unit of measurement when suggesting quantities.
Available menu items: ${this.formatItemsForPrompt(availableItems)}`;

      const payload = {
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "json_object" }
      };

      console.log('OpenAI Request Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('OpenAI Response Status:', response.status);
      console.log('OpenAI Response Headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('OpenAI Raw Response:', responseText);

      if (!response.ok) {
        console.error('OpenAI API Error:', {
          status: response.status,
          statusText: response.statusText,
          responseText
        });
        throw new Error(`Failed to get AI suggestions: ${response.status} ${response.statusText}`);
      }

      const data = JSON.parse(responseText);
      console.log('OpenAI Parsed Response:', JSON.stringify(data, null, 2));

      if (!data.choices?.[0]?.message?.content) {
        console.error('Invalid OpenAI response format:', data);
        throw new Error('Invalid response format from OpenAI');
      }

      const parsedResponse = this.parseAiResponse(data.choices[0].message.content);
      console.log('Final Parsed AI Response:', JSON.stringify(parsedResponse, null, 2));
      
      return parsedResponse;
    } catch (error) {
      console.error('Error getting AI menu suggestions:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        apiKey: this.apiKey ? 'Present' : 'Missing'
      });
      throw error;
    }
  }

  private parseAiResponse(response: string): AiMenuSuggestion {
    try {
      console.log('Parsing AI response:', response);
      const parsed = JSON.parse(response);
      
      const suggestion: AiMenuSuggestion = {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        totalEstimate: typeof parsed.totalEstimate === 'number' ? parsed.totalEstimate : 0,
        dietaryNotes: Array.isArray(parsed.dietaryNotes) ? parsed.dietaryNotes : []
      };

      console.log('Successfully parsed AI response:', JSON.stringify(suggestion, null, 2));
      return suggestion;
    } catch (error) {
      console.error('Error parsing AI response:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        response,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new Error('Invalid AI response format');
    }
  }
}

export default OpenAiService.getInstance();