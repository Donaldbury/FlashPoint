const Parser = require('rss-parser');
const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
});

async function run() {
    const urls = [
        'https://www.reutersagency.com/feed/?best-topics=world&format=xml',
        'https://www.iranintl.com/en/rss',
        'https://feeds.bbci.co.uk/persian/rss.xml',
        'https://news.google.com/rss/search?q=when:24h+allinurl:reuters.com&hl=en-US&gl=US&ceid=US:en'
    ];

    for (const u of urls) {
        console.log(`Fetching ${u}...`);
        try {
            const f = await parser.parseURL(u);
            console.log(`Success: ${f.items.length} items`);
        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }
}
run();
