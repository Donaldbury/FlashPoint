const TAG_MAP = {
    'Politics': ['politics', 'government', 'diplomacy', 'treaty', 'sanctions', 'election', 'minister'],
    'Bombing': ['bomb', 'explosion', 'strike', 'missile', 'rocket', 'airstrike', 'artillery', 'shelling'],
    'Deaths': ['killed', 'died', 'death', 'casualty', 'fatal', 'mortality', 'massacre'],
    'Assassinations': ['assassination', 'assassinated', 'targeted killing', 'eliminated'],
    'Defects': ['defect', 'defection', 'deserter', 'intelligence leak', 'spy'],
    'Conflict': ['war', 'clash', 'battle', 'skirmish', 'fighting', 'military'],
    'Economy': ['economy', 'market', 'trade', 'currency', 'oil', 'gas', 'inflation', 'stock'],
    'Technology': ['cyber', 'hack', 'drone', 'satellite'],
    'Protests': ['protest', 'riot', 'demonstration', 'uprising', 'activist', 'unrest', 'strike'],
    'Europe': ['europe', 'eu', 'uk', 'germany', 'france', 'nato'],
    'Nuclear': ['nuclear', 'uranium', 'enrichment', 'reactor', 'iaea', 'centrifuge'],
    'Crimes': ['war crime', 'atrocity', 'crime', 'human rights', 'violation'],
    'Iran': ['iran', 'tehran', 'irgc', 'khamenei', 'raisi'],
    'Israel': ['israel', 'tel aviv', 'jerusalem', 'idf', 'mossad', 'netanyahu', 'gaza', 'hamas', 'hezbollah'],
    'USA': ['usa', 'united states', 'washington', 'pentagon', 'trump', 'white house', 'centcom']
};

const tagItem = (item) => {
    const text = `${item.title} ${item.summary || ''}`.toLowerCase();
    const tags = [];
    const actors = [];

    for (const [tag, keywords] of Object.entries(TAG_MAP)) {
        if (keywords.some(kw => text.includes(kw))) {
            if (['Iran', 'Israel', 'USA'].includes(tag)) {
                actors.push(tag);
            } else {
                tags.push(tag);
            }
        }
    }

    // Blacklist check for sponsored, generic, or financial content
    const blacklist = ['sponsor', 'advert', 'promo', 'stock market', 'trading', 'shares', 'economy', 'finance', 'sports', 'entertainment', 'hollywood', 'celebrity'];
    const isBlacklisted = blacklist.some(kw => text.includes(kw));

    // Force strict filtering: Must not be blacklisted AND must have at least one valid actor or tag
    // For general news sources (CNN, Fox, BBC), this ensures only relevant conflict news gets through.
    const isValid = !isBlacklisted && (actors.length > 0 || tags.length > 0);

    // Assign verification level based on source type and keywords
    let verificationLevel = 'unverified';
    if (item.sourceType === 'gov_official') {
        verificationLevel = 'official';
    } else if (item.sourceType === 'major_media') {
        verificationLevel = 'verified';
    }

    if (text.includes('claim') || text.includes('unconfirmed') || text.includes('reports suggest')) {
        verificationLevel = 'speculation';
    }

    return { ...item, tags, actors, verificationLevel, isValid };
};

module.exports = { tagItem };
