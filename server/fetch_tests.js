const https = require('https');
const Parser = require('rss-parser');

const fetchPizzint = () => {
    https.get('https://www.pizzint.watch/', (res) => {
        let html = '';
        res.on('data', c => html += c);
        res.on('end', () => {
            const styles = html.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
            if (styles) console.log("Inline styles length:", styles[0].length);
            const links = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g);
            console.log("CSS Links:", links);

            // If links found, fetch the first css
            if (links) {
                const hrefMatch = links[0].match(/href="([^"]+)"/);
                if (hrefMatch && hrefMatch[1]) {
                    const cssUrl = hrefMatch[1].startsWith('http') ? hrefMatch[1] : 'https://www.pizzint.watch' + hrefMatch[1];
                    console.log("Fetching CSS:", cssUrl);
                    https.get(cssUrl, (resCss) => {
                        let css = '';
                        resCss.on('data', c => css += c);
                        resCss.on('end', () => {
                            console.log("CSS Output snippet:", css.substring(0, 500));
                            // try to find root colors
                            const rootColors = css.match(/:root\s*{([^}]+)}/);
                            if (rootColors) console.log("Root colors:", rootColors[1]);
                        });
                    });
                }
            }
        });
    }).on('error', e => console.error("Pizzint error", e));
};

const fetchFlightradar = async () => {
    const parser = new Parser();
    try {
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=when:24h+allinurl:flightradar24.com+middle%20east+OR+iran+OR+israel&hl=en-US&gl=US&ceid=US:en');
        console.log("Flightradar items:", feed.items.length);
        if (feed.items.length === 0) {
            console.log("No items found. Maybe search query is dead. Let's try without when:24h or different terms: 'flightradar24'");
            const feed2 = await parser.parseURL('https://news.google.com/rss/search?q=flightradar24&hl=en-US&gl=US&ceid=US:en');
            console.log("Alternative query items:", feed2.items.length);
        } else {
            console.log("First item:", feed.items[0]);
        }
    } catch (e) {
        console.error("Flightradar Error:", e.message);
    }
};

fetchPizzint();
fetchFlightradar();
