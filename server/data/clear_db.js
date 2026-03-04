const db = require('better-sqlite3')('./flashpoint.db');
try {
    const deleted = db.prepare('DELETE FROM items').run();
    console.log(`Deleted ${deleted.changes} items from database to reset state.`);
} catch (e) {
    console.error(e);
}
