const db = require('./db');
try {
    const deleted = db.deleteOldItems();
    console.log(`Successfully tested db cleanup. Rows affected: ${deleted.changes}`);
} catch (e) {
    console.error('Test db cleanup failed:', e);
}
