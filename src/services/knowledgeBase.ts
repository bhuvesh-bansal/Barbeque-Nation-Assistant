import { KnowledgeBaseEntry, ScoredEntry } from '../types';
import { logger } from '../utils/logger';

export class KnowledgeBaseService {
  private entries: KnowledgeBaseEntry[] = [];

  async addEntry(entry: KnowledgeBaseEntry): Promise<KnowledgeBaseEntry> {
    try {
      // Validate entry
      if (!entry.question || !entry.answer || !entry.location) {
        throw new Error('Missing required fields');
      }

      const newEntry = {
        ...entry,
        id: this.generateId(),
        metadata: {
          lastUpdated: new Date().toISOString(),
          source: entry.metadata?.source || 'manual'
        }
      };

      this.entries.push(newEntry);
      return newEntry;
    } catch (error) {
      logger.error('Error adding knowledge base entry:', error);
      throw error;
    }
  }

  async searchEntries(query: string, location?: string): Promise<KnowledgeBaseEntry[]> {
    try {
      const searchTerms = query.toLowerCase().split(' ');
      let relevantEntries = this.entries;

      // Filter by location if provided
      if (location) {
        relevantEntries = relevantEntries.filter(entry => 
          entry.location.toLowerCase() === location.toLowerCase()
        );
      }

      // Score and sort entries based on relevance
      const scoredEntries: ScoredEntry[] = relevantEntries.map(entry => ({
        entry,
        score: this.calculateRelevanceScore(entry, searchTerms)
      }));

      // Return top 5 most relevant entries
      return scoredEntries
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(item => item.entry);
    } catch (error) {
      logger.error('Error searching knowledge base:', error);
      throw error;
    }
  }

  async generateAnswer(query: string, context: { location?: string; state: string }): Promise<string> {
    try {
      const relevantEntries = await this.searchEntries(query, context.location);
      
      if (relevantEntries.length === 0) {
        return "I apologize, but I don't have specific information about that. Could you please rephrase your question?";
      }

      // For simple queries, return the most relevant answer
      const bestMatch = relevantEntries[0];
      const searchTerms = query.toLowerCase().split(' ');
      const score = this.calculateRelevanceScore(bestMatch, searchTerms);
      
      if (score > 0.8) {
        return bestMatch.answer;
      }

      // For complex queries, combine relevant information
      const combinedAnswer = relevantEntries
        .map(entry => entry.answer)
        .join('\n\n');

      return combinedAnswer.length > 800 
        ? combinedAnswer.substring(0, 797) + '...'
        : combinedAnswer;
    } catch (error) {
      logger.error('Error generating answer:', error);
      throw error;
    }
  }

  private calculateRelevanceScore(entry: KnowledgeBaseEntry, searchTerms: string[]): number {
    let score = 0;
    const questionWords = entry.question.toLowerCase().split(' ');
    const answerWords = entry.answer.toLowerCase().split(' ');
    const allWords = [...questionWords, ...answerWords, ...entry.tags.map(tag => tag.toLowerCase())];

    // Calculate term frequency
    for (const term of searchTerms) {
      const termCount = allWords.filter(word => word.includes(term)).length;
      score += termCount / allWords.length;
    }

    // Boost score for exact matches in question or tags
    if (entry.question.toLowerCase().includes(searchTerms.join(' '))) {
      score += 0.5;
    }
    if (entry.tags.some(tag => searchTerms.includes(tag.toLowerCase()))) {
      score += 0.3;
    }

    return score;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
} 