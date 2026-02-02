import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request) {
  try {
    // Launch Library 2 API - Upcoming launches
    const response = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10', {
      headers: {
        'User-Agent': 'Intelligence-Dashboard/1.0'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch launches');
    }

    const data = await response.json();
    
    // Format the launches
    const launches = data.results.map(launch => ({
      id: launch.id,
      name: launch.name,
      date: launch.net, // NET = No Earlier Than
      rocket: launch.rocket?.configuration?.name || 'Unknown',
      agency: launch.launch_service_provider?.name || 'Unknown',
      location: launch.pad?.location?.name || 'Unknown',
      mission: launch.mission?.description || 'No description available',
      status: launch.status?.name || 'Unknown',
      webcast: launch.webcast_live,
      livestream: launch.vidURLs?.[0] || null,
      image: launch.image || launch.rocket?.configuration?.image_url || null,
      probability: launch.probability || null
    }));

    return NextResponse.json(launches);
  } catch (error) {
    console.error('Launch Library API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming launches' }, 
      { status: 500 }
    );
  }
}
