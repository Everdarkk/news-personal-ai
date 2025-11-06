// app/api/location/route.ts
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    
    // fetching user ip from header
    const userIp = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim();

    // url from ip
    let geoApiUrl = 'https://get.geojs.io/v1/ip/geo.json'; 

    if (userIp) {
        geoApiUrl = `https://get.geojs.io/v1/ip/geo/${userIp}.json`;
    } 

    const response = await fetch(
        geoApiUrl, 
        { 
            next: { revalidate: 900 } 
        }
    );

    if (!response.ok) {
        // error handling
        return new Response('Failed to fetch location data', { status: response.status });
    }

    const data = await response.json();

    return Response.json(data);
}