export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (request.method === 'OPTIONS') {
      return handleCORS(env);
    }
    
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }
    
    // Fetch shows from Ticketmaster Discovery API
    const shows = await fetchConanShows(env);
    
    // Filter upcoming only
    const today = new Date().toISOString().split('T')[0];
    const upcoming = shows
      .filter(s => s.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return new Response(JSON.stringify({ shows: upcoming }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800',
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
        ...corsHeaders(env)
      }
    });
  }
};

async function fetchConanShows(env) {
  const apiKey = env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    console.warn('[ShowsWorker] No Ticketmaster API key configured');
    return [];
  }
  
  try {
    // Search for Conan O'Brien attractions
    const attractionUrl = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=Conan%20O%27Brien&apikey=${apiKey}`;
    const attractionResponse = await fetch(attractionUrl);
    const attractionData = await attractionResponse.json();
    
    if (!attractionData._embedded?.attractions?.length) {
      console.warn('[ShowsWorker] No Conan O\'Brien attractions found');
      return [];
    }
    
    // Get the first matching attraction ID
    const attraction = attractionData._embedded.attractions[0];
    const attractionId = attraction.id;
    
    // Search for events with this attraction ID
    const today = new Date().toISOString().split('T')[0];
    const eventsUrl = `https://app.ticketmaster.com/discovery/v2/events.json?attractionId=${attractionId}&startDateTime=${today}T00:00:00Z&sort=date,asc&size=50&apikey=${apiKey}`;
    const eventsResponse = await fetch(eventsUrl);
    const eventsData = await eventsResponse.json();
    
    if (!eventsData._embedded?.events?.length) {
      console.log('[ShowsWorker] No upcoming Conan O\'Brien events found');
      return [];
    }
    
    return eventsData._embedded.events.map(formatEvent);
    
  } catch (error) {
    console.error('[ShowsWorker] Error fetching shows:', error);
    return [];
  }
}

function formatEvent(event) {
  const startDate = event.dates?.start?.localDate || event.dates?.start?.dateTime;
  if (!startDate) return null;
  
  const date = new Date(startDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  
  const venue = event._embedded?.venues?.[0];
  const venueName = venue?.name || 'TBA';
  const city = venue?.city?.name || '';
  const state = venue?.state?.stateCode || '';
  const country = venue?.country?.countryCode || 'US';
  const location = [city, state].filter(Boolean).join(', ');
  
  const ticketUrl = event.url || `https://www.ticketmaster.com/event/${event.id}`;
  
  return {
    id: `tm-${event.id}`,
    title: event.name,
    date: startDate,
    day,
    month,
    year,
    venue: venueName,
    city: location,
    country,
    ticketUrl,
    source: 'ticketmaster'
  };
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