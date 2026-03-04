const db = require('./db');

try {
    const items = db.getItems({ limit: 5 });
    console.log(`Retrieved ${items.length} items.`);
    items.forEach(item => {
        console.log(`[${item.sourceName}] (${item.publishedAt}): ${item.title}`);
        console.log(`  Tags: ${item.tags.join(', ')} | Actors: ${item.actors.join(', ')}`);
        console.log(`  Age (hours): ${Math.round((new Date() - new Date(item.publishedAt)) / (1000 * 60 * 60))}`);
        console.log('---');
    });
} catch (e) {
    console.error('Fetch error:', e);
}
