import { OpenAIEmbeddings } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';

export class EmbeddingUtils {
  private configService: ConfigService;
  private model: OpenAIEmbeddings;

  constructor() {
    this.configService = new ConfigService();
    this.model = new OpenAIEmbeddings({
      apiKey: this.configService.get('OPENAI_API_KEY'),
      modelName: 'text-embedding-ada-002',
    });
  }

  async generateEmbedding(data: string): Promise<number[]> {
    try {
      const response = await this.model.embedQuery(data);
      return response;
    } catch (error) {
      throw new Error(`Failed to generate embedding: ${error}`);
    }
  }

  async cosineSimilarityAndDistance(
    vecA: number[],
    vecB: number[],
    metric: 'cosine' | 'euclidean' = 'cosine',
  ): Promise<{ similarity: number }> {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    // Cosine similarity
    const cosineSimilarity = dotProduct / (magnitudeA * magnitudeB);

    if (metric === 'cosine') {
      return { similarity: cosineSimilarity };
    }

    // Euclidean distance (alternative metric)
    const euclideanDistance = Math.sqrt(
      vecA.reduce((sum, a, idx) => sum + Math.pow(a - vecB[idx], 2), 0),
    );
    return { similarity: 1 / (1 + euclideanDistance) };
  }
}
