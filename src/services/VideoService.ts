import { BaseDataService } from './BaseDataService';
import { VideoResponse } from '../types';

export interface VideoServiceConfig {
  proxyUrl: string;
  cacheKey: string;
  cacheExpiry: number;
  fetchTimeout: number;
}

const defaultConfig: VideoServiceConfig = {
  proxyUrl: 'https://teamcoco-youtube-proxy.eam--oco--pp.workers.dev/latest2',
  cacheKey: 'teamcoco_latest_video',
  cacheExpiry: 1000 * 60 * 15, // 15 minutes
  fetchTimeout: 8000,
};

export class VideoService extends BaseDataService<VideoResponse> {
  constructor(config: Partial<VideoServiceConfig> = {}) {
    super({ ...defaultConfig, ...config });
  }

  protected validateData(data: any): VideoResponse {
    if (!data.videoId || !data.title) {
      throw new Error('Invalid video data');
    }
    return data;
  }

  protected getErrorResponse(error: any): VideoResponse {
    return {
      error: true,
      message: error.name === 'AbortError' ? 'Request timed out' : 'Failed to load latest video',
      videoId: '',
    };
  }

  async getLatestVideo(): Promise<VideoResponse> {
    return this.getData();
  }

  static getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }

  static getDeepLink(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  static getThumbnailUrl(videoId: string, quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' | 'default' = 'maxresdefault'): string {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  }

  static formatVideoDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

export const videoService = new VideoService();