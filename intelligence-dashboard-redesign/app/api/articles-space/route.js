import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.DATABASE_ID_SPACE;

export const revalidate = 1800; // Cache for 30 minutes

export async function GET(request) {
  try {
    let allArticles = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
      const response = await notion.databases.query({
        database_id: databaseId,
        sorts: [
          {
            property: 'Date',
            direction: 'descending',
          },
        ],
        page_size: 100,
        start_cursor: startCursor,
      });

      const articles = response.results.map((page) => {
        const getText = (prop) => prop?.[0]?.plain_text || '';
        
        return {
          id: page.id,
          title: getText(page.properties.Nom?.title) || 'Untitled',
          description: getText(page.properties.Description?.rich_text) || '',
          date: page.properties.Date?.date?.start || '',
          link: page.properties.Link?.url || '',
          priority: page.properties.Priority?.select?.name || '🟢 Low',
          agency: page.properties.Agency?.select?.name || 'Various',
          mission: page.properties['Mission Type']?.select?.name || 'General',
          topic: page.properties['Topic']?.select?.name || 'News',
        };
      });

      allArticles = [...allArticles, ...articles];
      
      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }

    return NextResponse.json(allArticles);
  } catch (error) {
    console.error('Notion API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles from Notion' }, 
      { status: 500 }
    );
  }
}
