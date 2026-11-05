import { BaseDataService } from './BaseDataService';
import { MerchItem, MerchResponse } from '../types';

export interface MerchServiceConfig {
  proxyUrl: string;
  cacheKey: string;
  cacheExpiry: number;
  fetchTimeout: number;
}

const defaultConfig: MerchServiceConfig = {
  proxyUrl: 'https://teamcoco-merch-proxy.eam--oco--pp.workers.dev/merch',
  cacheKey: 'teamcoco_merch',
  cacheExpiry: 1000 * 60 * 60 * 6, // 6 hours
  fetchTimeout: 8000,
};

export class MerchService extends BaseDataService<MerchItem[], MerchResponse> {
  constructor(config: Partial<MerchServiceConfig> = {}) {
    super({ ...defaultConfig, ...config });
  }

  async getMerch(): Promise<MerchResponse> {
    try {
      const products = await this.getData();
      // Treat empty array as error to trigger fallback
      if (!products || products.length === 0) {
        throw new Error('Empty products from proxy');
      }
      return { products };
    } catch (error) {
      return this.getErrorResponse(error);
    }
  }

  protected validateData(data: any): MerchItem[] {
    if (!Array.isArray(data.products)) {
      throw new Error('Invalid merch data');
    }
    return data.products;
  }

  protected getErrorResponse(error: any): MerchResponse {
    return {
      error: true,
      message: error.name === 'AbortError' ? 'Request timed out' : 'Failed to load merch',
      products: [],
    };
  }
}

export const merchService = new MerchService();

// Re-export fallback data for screens to use
export const fallbackMerchData: MerchItem[] = [
  {
    id: 'ps-7271413743658',
    name: "Conan O'Brien Needs A Friend: Doodle Hat",
    price: 30.00,
    image: 'https://cdn.shopify.com/s/files/1/1850/0373/files/classic-dad-hat-black-front-6634f610c9082.jpg?v=1734030743',
    category: 'accessories',
    url: 'https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-doodle-hat',
  },
  {
    id: 'ps-7310059208746',
    name: "Conan O'Brien Needs A Friend x Club None: Official Friend Mug",
    price: 15.00,
    image: 'https://cdn.shopify.com/s/files/1/1850/0373/files/white-glossy-mug-white-11-oz-handle-on-right-664dff50616b3.jpg?v=1734030740',
    category: 'collectibles',
    url: 'https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-official-friend-mug',
  },
  {
    id: 'ps-7310059077674',
    name: "Conan O'Brien Needs A Friend x Club None: Official Friend Sticker Sheet",
    price: 8.00,
    image: 'https://cdn.shopify.com/s/files/1/1850/0373/files/kiss-cut-sticker-sheet-white-front-664dfeef88f29.jpg?v=1734030742',
    category: 'collectibles',
    url: 'https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-official-friend-sticker-sheet',
  },
  {
    id: 'ps-7266373140522',
    name: "Conan O'Brien Needs A Friend: Quinquennial Celebration Exclusive LP",
    price: 35.00,
    image: 'https://cdn.shopify.com/s/files/1/1850/0373/files/CONAF_5YearAnniversary_2ndPress_Gatefold.png?v=1734030746',
    category: 'collectibles',
    url: 'https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-quinquennial-celebration-exclusive-lp-2nd-pressing',
  },
  {
    id: 'ps-7424040665130',
    name: "Conan O'Brien Needs A Friend: Classic Logo Tee",
    price: 30.00,
    image: 'https://cdn.shopify.com/s/files/1/1850/0373/files/unisex-staple-t-shirt-heather-deep-teal-front-66a96df6b24c4.jpg?v=1734030725',
    category: 'apparel',
    url: 'https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-classic-logo-tee',
  },
];