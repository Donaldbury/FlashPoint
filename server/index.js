require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const cron = require('node-cron');
const sources = require('./data/sources.json');
const { fetchFeed } = require('./services/fetcher');
const { saveItem, getItems, deleteOldItems, getStats } = require('./data/db');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    ws.on('close', () => console.log('Client disconnected'));
});

const broadcastNewItem = (item) => {
    const message = JSON.stringify({ type: 'NEW_ITEM', payload: item });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

const broadcastStatus = (status) => {
    const message = JSON.stringify({ type: 'STATUS_UPDATE', payload: status });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

// Scheduler: Fetch and process feeds every minute
const sourceHealth = {};
sources.forEach(s => sourceHealth[s.id] = { status: 'ok', lastFetch: null, error: null });

const runFetchJob = async () => {
    console.log('Running background fetch tool...');
    for (const source of sources) {
        if (!source.enabled) continue;

        try {
            const items = await fetchFeed(source);
            console.log(`Fetched ${items.length} items from ${source.name}`);

            let newCount = 0;
            for (const item of items) {
                const isNew = saveItem(item);
                if (isNew) {
                    broadcastNewItem(item);
                }
            }

            // Handle newly fetched items individually by the isNew broadcast above.

            sourceHealth[source.id] = { status: 'ok', lastFetch: new Date().toISOString(), error: null };
        } catch (error) {
            console.error(`Failed to fetch ${source.name}:`, error.message);
            sourceHealth[source.id] = { status: 'error', lastFetch: new Date().toISOString(), error: error.message };
        }
    }

    try {
        const deleted = deleteOldItems();
        console.log(`Deleted ${deleted.changes} items older than 24 hours`);
    } catch (e) {
        console.error('Failed to cleanup old items:', e.message);
    }

    broadcastStatus(sourceHealth);
};

runFetchJob(); // Run immediately on start
cron.schedule('* * * * *', runFetchJob);

// API Endpoints
app.get('/api/feed', (req, res) => {
    try {
        const filters = {
            limit: parseInt(req.query.limit) || 50,
            offset: parseInt(req.query.offset) || 0,
            actors: req.query.actors ? req.query.actors.split(',') : [],
            tags: req.query.tags ? req.query.tags.split(',') : [],
            sources: req.query.sources ? req.query.sources.split(',') : [],
            verificationLevel: req.query.verificationLevel ? req.query.verificationLevel.split(',') : []
        };
        const items = getItems(filters);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/sources', (req, res) => {
    res.json(sources);
});

app.get('/api/health', (req, res) => {
    res.json(sourceHealth);
});

app.get('/api/stats', (req, res) => {
    try {
        const stats = getStats();
        res.json(stats);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/flightradar', async (req, res) => {
    try {
        const parser = new (require('rss-parser'))();
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=flightradar24+middle%20east+OR+iran+OR+israel+OR+lebanon+OR+syria+OR+yemen+OR+iraq+OR+saudi+OR+jordan+OR+egypt&hl=en-US&gl=US&ceid=US:en');
        res.json(feed.items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/polymarket', async (req, res) => {
    try {
        const parser = new (require('rss-parser'))();
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=when:24h+polymarket+middle%20east+OR+iran+OR+israel+OR+usa&hl=en-US&gl=US&ceid=US:en');
        res.json(feed.items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/us-deployments', async (req, res) => {
    try {
        const parser = new (require('rss-parser'))();
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=when:7d+"us+military"+OR+"us+navy"+OR+centcom+OR+"aircraft+carrier"+AND+"middle+east"+OR+"red+sea"+OR+"mediterranean"+OR+"persian+gulf"&hl=en-US&gl=US&ceid=US:en');
        res.json(feed.items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/cyber-comms', async (req, res) => {
    try {
        const parser = new (require('rss-parser'))();
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=when:7d+cyberattack+OR+"internet+outage"+OR+"gps+jamming"+OR+hackers+AND+"middle+east"+OR+iran+OR+israel+OR+lebanon&hl=en-US&gl=US&ceid=US:en');
        res.json(feed.items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/maritime', async (req, res) => {
    try {
        const parser = new (require('rss-parser'))();
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=when:7d+"red+sea"+OR+"strait+of+hormuz"+OR+"suez+canal"+OR+"gulf+of+oman"+AND+tanker+OR+shipping+OR+maritime+OR+houthi+OR+"gps+spoofing"&hl=en-US&gl=US&ceid=US:en');
        res.json(feed.items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/geoint', async (req, res) => {
    try {
        const parser = new (require('rss-parser'))();
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=when:7d+"satellite+imagery"+OR+"maxar"+OR+"planet+labs"+OR+"synthetic+aperture+radar"+AND+"middle+east"+OR+"iran"+OR+"israel"+OR+"lebanon"&hl=en-US&gl=US&ceid=US:en');
        res.json(feed.items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/energy', async (req, res) => {
    try {
        const parser = new (require('rss-parser'))();
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=when:7d+"brent+crude"+OR+"oil+prices"+OR+"energy+infrastructure"+OR+"saudi+aramco"+OR+"strait+of+hormuz"+AND+"middle+east"+OR+"strike"+OR+"opec"+OR+"iran"&hl=en-US&gl=US&ceid=US:en');
        res.json(feed.items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/irgc-deployments', async (req, res) => {
    try {
        const parser = new (require('rss-parser'))();
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=when:7d+"irgc"+OR+"qods+force"+OR+"khamenei"+OR+"revolutionary+guard"+AND+"deployment"+OR+"missile"+OR+"proxy"+OR+"syria"+OR+"lebanon"+OR+"iraq"&hl=en-US&gl=US&ceid=US:en');
        res.json(feed.items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/idf-deployments', async (req, res) => {
    try {
        const parser = new (require('rss-parser'))();
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=when:7d+"idf"+OR+"israel+defense+forces"+OR+"iaf"+AND+"deployment"+OR+"reserves"+OR+"gaza"+OR+"lebanon"+OR+"northern+command"+OR+"strike"&hl=en-US&gl=US&ceid=US:en');
        res.json(feed.items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Flashpoint Server running on port ${PORT}`);
});
