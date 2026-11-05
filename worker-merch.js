export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (request.method === 'OPTIONS') {
      return handleCORS(env);
    }
    
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }
    
    // Try to get from KV (updated by cron)
    let products = [];
    if (env.MERCH_KV) {
      const stored = await env.MERCH_KV.get('teamcoco-merch');
      if (stored) {
        try {
          products = JSON.parse(stored);
        } catch {}
      }
    }
    
    // Fallback: fetch from PodSwag API
    if (!products.length) {
      products = await fetchPodSwagMerch();
      if (products.length && env.MERCH_KV) {
        await env.MERCH_KV.put('teamcoco-merch', JSON.stringify(products), { expirationTtl: 3600 });
      }
    }
    
    // Filter and sort - show top 5 best selling (by default order)
    const topProducts = products.slice(0, 5);
    
    return new Response(JSON.stringify({ products: topProducts }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
        ...corsHeaders(env)
      }
    });
  }
};

async function fetchPodSwagMerch() {
  try {
    const response = await fetch('https://www.podswag.com/collections/team-coco/products.json?limit=50', {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (compatible; TeamCocoApp/1.0)' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.products || !Array.isArray(data.products)) {
      return getFallbackProducts();
    }
    
    const formatted = data.products
      .filter(p => p.available && p.variants?.some(v => v.available))
      .map(formatProduct);
    
    // If no available products from API, use fallback
    if (formatted.length === 0) {
      return getFallbackProducts();
    }
    
    return formatted.slice(0, 5);
       
  } catch (error) {
    return getFallbackProducts();
  }
}

function getFallbackProducts() {
  // Current products from PodSwag Team Coco collection as of 2026-11-03
  return [
    {
      id: "ps-7271413743658",
      name: "Conan O'Brien Needs A Friend: Doodle Hat",
      price: 30.00,
      category: "accessories",
      url: "https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-doodle-hat",
      image: "https://cdn.shopify.com/s/files/1/1850/0373/files/classic-dad-hat-black-front-6634f610c9082.jpg?v=1734030743",
      productType: "Hat"
    },
    {
      id: "ps-7310059208746",
      name: "Conan O'Brien Needs A Friend x Club None: Official Friend Mug",
      price: 15.00,
      category: "collectibles",
      url: "https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-official-friend-mug",
      image: "https://cdn.shopify.com/s/files/1/1850/0373/files/white-glossy-mug-white-11-oz-handle-on-right-664dff50616b3.jpg?v=1734030740",
      productType: "Drinkware"
    },
    {
      id: "ps-7310059077674",
      name: "Conan O'Brien Needs A Friend x Club None: Official Friend Sticker Sheet",
      price: 8.00,
      category: "collectibles",
      url: "https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-official-friend-sticker-sheet",
      image: "https://cdn.shopify.com/s/files/1/1850/0373/files/kiss-cut-sticker-sheet-white-front-664dfeef88f29.jpg?v=1734030742",
      productType: "Sticker"
    },
    {
      id: "ps-7266373140522",
      name: "Conan O'Brien Needs A Friend: Quinquennial Celebration Exclusive LP",
      price: 35.00,
      category: "collectibles",
      url: "https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-quinquennial-celebration-exclusive-lp-2nd-pressing",
      image: "https://cdn.shopify.com/s/files/1/1850/0373/files/CONAF_5YearAnniversary_2ndPress_Gatefold.png?v=1734030746",
      productType: "Vinyl Album"
    },
    {
      id: "ps-7424040665130",
      name: "Conan O'Brien Needs A Friend: Classic Logo Tee",
      price: 30.00,
      category: "apparel",
      url: "https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-classic-logo-tee",
      image: "https://cdn.shopify.com/s/files/1/1850/0373/files/unisex-staple-t-shirt-heather-deep-teal-front-66a96df6b24c4.jpg?v=1734030725",
      productType: "Shirt"
    }
  ];
}

function formatProduct(product) {
  const variant = product.variants?.[0];
  const image = product.images?.[0]?.src || '';
  
  return {
    id: `ps-${product.id}`,
    name: product.title,
    price: parseFloat(variant?.price || '0'),
    category: mapCategory(product.product_type),
    url: `https://www.podswag.com/collections/team-coco/products/${product.handle}`,
    image: image,
    productType: product.product_type
  };
}

function mapCategory(type) {
  const categories = {
    'Shirt': 'apparel',
    'T-Shirt': 'apparel',
    'Hat': 'accessories',
    'Drinkware': 'collectibles',
    'Mug': 'collectibles',
    'Magnet': 'collectibles',
    'Sticker': 'collectibles',
    'Vinyl Album': 'collectibles'
  };
  return categories[type] || 'apparel';
}

function corsHeaders(env) {
  const origin = env.ALLOWED_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

function handleCORS(env) {
  const origin = env.ALLOWED_ORIGIN || '*';
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    }
  });
}