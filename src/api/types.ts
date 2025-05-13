import { LocationDetails } from '../config/locations';
import { MenuItem } from '../config/menu';
import { FAQ } from '../config/faqs';

export interface QueryClassification {
  intent: 'menu' | 'location' | 'booking' | 'faq' | 'offers' | 'unknown';
  confidence: number;
  entities: {
    city?: string;
    cuisine?: string;
    dietary?: string;
    timeSlot?: string;
    [key: string]: string | undefined;
  };
}

export interface ChunkedResponse {
  chunkId: string;
  totalChunks: number;
  currentChunk: number;
  content: string;
  hasMore: boolean;
  context: {
    intent: string;
    query: string;
    [key: string]: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
}

export interface KnowledgeBaseQuery {
  query: string;
  context?: {
    previousIntent?: string;
    location?: string;
    customerPreferences?: string[];
    [key: string]: any;
  };
}

export interface ErrorResponse {
  error: string;
  code: string;
  suggestion?: string;
  alternativeActions?: string[];
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of entries
}

// Monitoring types
export interface QueryMetrics {
  queryId: string;
  timestamp: number;
  intent: string;
  processingTime: number;
  tokenCount: number;
  success: boolean;
  errorType?: string;
} 