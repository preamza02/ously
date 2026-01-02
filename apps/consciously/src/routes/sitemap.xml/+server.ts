import { SITE_URL } from '$lib/constants';

export async function GET() {
    const pages = [
        '/',
        '/time',
        '/financial',
        '/health'
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${pages
            .map(
                (page) => `
	<url>
		<loc>${SITE_URL}${page}</loc>
		<changefreq>weekly</changefreq>
		<priority>${page === '/' ? '1.0' : '0.8'}</priority>
	</url>`
            )
            .join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}
