const Parser = require('rss-parser');
const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['media:thumbnail', 'mediaThumbnail'],
        ],
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
});
const { normalizeRSS } = require('./normalizer');
const { tagItem } = require('./tagger');

const fetchFeed = async (source) => {
    try {
        const feed = await parser.parseURL(source.rssUrl);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        return feed.items
            .filter(item => {
                const pubDate = new Date(item.pubDate || item.isoDate);
                return pubDate >= twentyFourHoursAgo;
            })
            .map(item => {
                const normalized = normalizeRSS(item, source);
                return tagItem(normalized);
            })
            .filter(item => item.isValid);
    } catch (error) {
        console.error(`Error fetching ${source.name}:`, error.message);
        throw error;
    }
};

module.exports = { fetchFeed };
