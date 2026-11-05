import { BaseDataService } from './BaseDataService';
import { Show, ShowsResponse } from '../types';

export interface ShowsServiceConfig {
  proxyUrl: string;
  cacheKey: string;
  cacheExpiry: number;
  fetchTimeout: number;
}

const defaultConfig: ShowsServiceConfig = {
  proxyUrl: 'https://teamcoco-shows-proxy.eam--oco--pp.workers.dev/shows',
  cacheKey: 'teamcoco_shows',
  cacheExpiry: 1000 * 60 * 60 * 24, // 24 hours
  fetchTimeout: 8000,
};

export class ShowsService extends BaseDataService<Show[], ShowsResponse> {
  constructor(config: Partial<ShowsServiceConfig> = {}) {
    super({ ...defaultConfig, ...config });
  }

  async getShows(): Promise<ShowsResponse> {
    try {
      const shows = await this.getData();
      return { shows };
    } catch (error) {
      return this.getErrorResponse(error);
    }
  }

  protected validateData(data: any): Show[] {
    if (!Array.isArray(data.shows)) {
      throw new Error('Invalid shows data');
    }
    return data.shows;
  }

  protected getErrorResponse(error: any): ShowsResponse {
    return {
      error: true,
      message: error.name === 'AbortError' ? 'Request timed out' : 'Failed to load shows',
      shows: [],
    };
  }
}

export const showsService = new ShowsService();