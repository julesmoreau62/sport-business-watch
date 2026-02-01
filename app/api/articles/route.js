import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

export const revalidate = 1800; // Cache for 30 minutes

export async function GET(request) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
      page_size: 100,
    });

    const articles = response.results.map((page) => {
      // Helper to safely extract text
      const getText = (prop) => prop?.[0]?.plain_text || '';
      
      return {
        id: page.id,
        title: getText(page.properties.Nom?.title) || 'Untitled',
        description: getText(page.properties.Description?.rich_text) || '',
        date: page.properties.Date?.date?.start || '',
        link: page.properties.Link?.url || '',
        priority: page.properties.Priority?.select?.name || '🟢 Low',
        sport: page.properties.Sport?.select?.name || 'Multi-sport',
        topic: page.properties['Thématique']?.multi_select?.[0]?.name || 'Business',
        region: page.properties.Region?.select?.name || 'Global',
      };
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Notion API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles from Notion' }, 
      { status: 500 }
    );
  }
}
