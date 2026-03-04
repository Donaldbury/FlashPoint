const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'flashpoint.db'));

// Create items table
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    sourceId TEXT,
    sourceName TEXT,
    sourceType TEXT,
    title TEXT,
    summary TEXT,
    originalUrl TEXT,
    publishedAt TEXT,
    ingestedAt TEXT,
    verificationLevel TEXT,
    tags TEXT,
    actors TEXT,
    media TEXT,
    "references" TEXT
  )
`);

const saveItem = (item) => {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO items (
      id, sourceId, sourceName, sourceType, title, summary, originalUrl, 
      publishedAt, ingestedAt, verificationLevel, tags, actors, media, "references"
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    item.id,
    item.sourceId,
    item.sourceName,
    item.sourceType,
    item.title,
    item.summary,
    item.originalUrl,
    item.publishedAt,
    item.ingestedAt,
    item.verificationLevel,
    JSON.stringify(item.tags),
    JSON.stringify(item.actors),
    JSON.stringify(item.media),
    JSON.stringify(item.references)
  );
  return result.changes > 0;
};

const deleteOldItems = () => {
  const stmt = db.prepare(`DELETE FROM items WHERE datetime(publishedAt) < datetime('now', '-1 day')`);
  return stmt.run();
};

const getItems = (filters = {}) => {
  let query = 'SELECT * FROM items';
  const params = [];
  const clauses = [];

  if (filters.actors && filters.actors.length > 0) {
    // Basic JSON matching for SQLite
    const actorClauses = filters.actors.map(() => 'actors LIKE ?');
    clauses.push(`(${actorClauses.join(' OR ')})`);
    filters.actors.forEach(actor => params.push(`%${actor}%`));
  }

  if (filters.tags && filters.tags.length > 0) {
    const tagClauses = filters.tags.map(() => 'tags LIKE ?');
    clauses.push(`(${tagClauses.join(' OR ')})`);
    filters.tags.forEach(tag => params.push(`%${tag}%`));
  }

  if (filters.sources && filters.sources.length > 0) {
    clauses.push(`sourceId IN (${filters.sources.map(() => '?').join(',')})`);
    params.push(...filters.sources);
  }

  if (filters.verificationLevel && filters.verificationLevel.length > 0) {
    clauses.push(`verificationLevel IN (${filters.verificationLevel.map(() => '?').join(',')})`);
    params.push(...filters.verificationLevel);
  }

  if (clauses.length > 0) {
    query += ' WHERE ' + clauses.join(' AND ');
  }

  query += ' ORDER BY datetime(publishedAt) DESC LIMIT ? OFFSET ?';
  params.push(filters.limit || 50);
  params.push(filters.offset || 0);

  const rows = db.prepare(query).all(...params);
  return rows.map(row => ({
    ...row,
    tags: JSON.parse(row.tags),
    actors: JSON.parse(row.actors),
    media: JSON.parse(row.media),
    references: JSON.parse(row.references)
  }));
};

const getStats = () => {
  const row = db.prepare('SELECT COUNT(*) as totalCount FROM items').get();
  return { totalCount: row.totalCount };
};

module.exports = { saveItem, getItems, deleteOldItems, getStats };
