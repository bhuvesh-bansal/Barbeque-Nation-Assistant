import { locations } from '../config/locations';
import { menu, searchMenu } from '../config/menu';
import { faqs, getFAQsByTags } from '../config/faqs';
import { aiService } from './aiService';
import { 
  QueryClassification, 
  ChunkedResponse, 
  ValidationResult,
  KnowledgeBaseQuery,
  ErrorResponse,
  CacheEntry,
  CacheConfig,
  QueryMetrics
} from './types';

const TOKEN_LIMIT = 800;
const CACHE_CONFIG: CacheConfig = {
  ttl: 1000 * 60 * 5, // 5 minutes
  maxSize: 1000
};

class KnowledgeBaseService {
  private cache: Map<string, CacheEntry<any>>;
  private metrics: QueryMetrics[];

  constructor() {
    this.cache = new Map();
    this.metrics = [];
  }

  private async classifyQuery(query: string): Promise<QueryClassification> {
    const aiResponse = await aiService.analyzeQuery({ query });
    return {
      intent: aiResponse.intent,
      confidence: aiResponse.confidence,
      entities: aiResponse.entities
    };
  }

  private countTokens(text: string): number {
    // Simple token counting (can be replaced with more accurate tokenizer)
    return text.split(/\s+/).length;
  }

  private chunkResponse(content: string, context: any): ChunkedResponse[] {
    const tokens = content.split(/\s+/);
    const chunks: ChunkedResponse[] = [];
    let currentChunk = '';
    let chunkTokens = 0;
    let chunkIndex = 0;

    for (const token of tokens) {
      if (chunkTokens + 1 > TOKEN_LIMIT) {
        chunks.push({
          chunkId: `${context.intent}-${chunkIndex}`,
          totalChunks: Math.ceil(tokens.length / TOKEN_LIMIT),
          currentChunk: chunkIndex,
          content: currentChunk.trim(),
          hasMore: true,
          context
        });
        currentChunk = token;
        chunkTokens = 1;
        chunkIndex++;
      } else {
        currentChunk += ' ' + token;
        chunkTokens++;
      }
    }

    // Add the last chunk
    if (currentChunk) {
      chunks.push({
        chunkId: `${context.intent}-${chunkIndex}`,
        totalChunks: chunks.length + 1,
        currentChunk: chunkIndex,
        content: currentChunk.trim(),
        hasMore: false,
        context
      });
    }

    return chunks;
  }

  private validateQuery(query: KnowledgeBaseQuery): ValidationResult {
    if (!query.query.trim()) {
      return {
        isValid: false,
        error: 'Query cannot be empty',
        suggestion: 'Please provide a specific question or request'
      };
    }

    if (query.context?.location && !locations[query.context.location.toLowerCase()]) {
      return {
        isValid: false,
        error: 'Invalid location',
        suggestion: 'Please specify a valid location (Delhi or Bangalore)'
      };
    }

    return { isValid: true };
  }

  private getCacheKey(query: KnowledgeBaseQuery): string {
    return `${query.query}-${JSON.stringify(query.context || {})}`;
  }

  private getCachedResponse(key: string): ChunkedResponse[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (cached.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCachedResponse(key: string, response: ChunkedResponse[]): void {
    if (this.cache.size >= CACHE_CONFIG.maxSize) {
      // Remove oldest entry
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data: response,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_CONFIG.ttl
    });
  }

  private logMetrics(metrics: QueryMetrics): void {
    this.metrics.push(metrics);
    // Implement actual logging/monitoring system
    console.log('Query metrics:', metrics);
  }

  public async getResponse(query: KnowledgeBaseQuery): Promise<ChunkedResponse[] | ErrorResponse> {
    const startTime = Date.now();
    const validation = this.validateQuery(query);
    
    if (!validation.isValid) {
      return {
        error: validation.error!,
        code: 'INVALID_QUERY',
        suggestion: validation.suggestion
      };
    }

    const cacheKey = this.getCacheKey(query);
    const cachedResponse = this.getCachedResponse(cacheKey);
    if (cachedResponse) return cachedResponse;

    try {
      const classification = await this.classifyQuery(query.query);
      let response: string = '';

      switch (classification.intent) {
        case 'menu':
          const menuItems = searchMenu(query.query);
          response = this.formatMenuResponse(menuItems, classification.entities);
          break;
        case 'location':
          response = this.formatLocationResponse(classification.entities.city);
          break;
        case 'offers':
          response = this.formatOffersResponse(query.context?.location);
          break;
        case 'faq':
          const relevantFAQs = getFAQsByTags([classification.intent]);
          response = this.formatFAQResponse(relevantFAQs);
          break;
        default:
          return {
            error: 'Could not understand the query',
            code: 'UNKNOWN_INTENT',
            suggestion: 'Try asking about our menu, locations, or current offers'
          };
      }

      const chunks = this.chunkResponse(response, {
        intent: classification.intent,
        query: query.query,
        ...classification.entities
      });

      this.setCachedResponse(cacheKey, chunks);
      
      this.logMetrics({
        queryId: cacheKey,
        timestamp: Date.now(),
        intent: classification.intent,
        processingTime: Date.now() - startTime,
        tokenCount: this.countTokens(response),
        success: true
      });

      return chunks;

    } catch (error) {
      this.logMetrics({
        queryId: cacheKey,
        timestamp: Date.now(),
        intent: 'error',
        processingTime: Date.now() - startTime,
        tokenCount: 0,
        success: false,
        errorType: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        error: 'An error occurred while processing your query',
        code: 'PROCESSING_ERROR',
        suggestion: 'Please try again or rephrase your question'
      };
    }
  }

  private formatMenuResponse(items: any[], entities: Record<string, string | undefined>): string {
    // Implementation remains the same
    return `Here are the menu items that match your query: ${items.map(item => item.name).join(', ')}`;
  }

  private formatLocationResponse(city?: string): string {
    if (!city) {
      return `We have restaurants in Delhi and Bangalore. Which city would you like to know about?`;
    }

    const cityLocations = Object.values(locations).filter(loc => 
      loc.name.toLowerCase().includes(city.toLowerCase())
    );

    return cityLocations.map(loc => 
      `${loc.name} is located at ${loc.address}. Operating hours: ${JSON.stringify(loc.timings)}`
    ).join('\n\n');
  }

  private formatOffersResponse(locationKey?: string): string {
    if (!locationKey) {
      return 'Please specify a location to check current offers.';
    }

    const location = locations[locationKey.toLowerCase()];
    if (!location) return 'Location not found.';

    const offers = [];
    if (location.offers.complimentaryDrinks) offers.push(location.offers.complimentaryDrinks);
    if (location.offers.foodFestival) offers.push('Ongoing food festival');
    if (location.offers.earlyBird) offers.push('Early bird discounts available');
    if (location.specialOffers?.earlyBird) offers.push(location.specialOffers.earlyBird);

    return offers.length > 0 
      ? `Current offers at ${location.name}:\n${offers.join('\n')}`
      : `Currently, we don't have any ongoing special offers at ${location.name}.`;
  }

  private formatFAQResponse(faqs: FAQ[]): string {
    return faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');
  }

  public getMetrics(): QueryMetrics[] {
    return this.metrics;
  }
}

export const knowledgeBaseService = new KnowledgeBaseService(); 