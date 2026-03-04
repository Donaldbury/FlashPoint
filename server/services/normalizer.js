const normalizeRSS = (item, source) => {
  return {
    id: item.guid || item.link,
    sourceId: source.id,
    sourceName: source.name,
    sourceType: source.type,
    title: item.title,
    summary: item.contentSnippet || item.content || item.summary,
    originalUrl: item.link,
    publishedAt: new Date(item.pubDate || item.isoDate).toISOString(),
    ingestedAt: new Date().toISOString(),
    media: extractMedia(item),
    references: [{ label: source.name, url: item.link }]
  };
};

const extractMedia = (item) => {
  // Try to find image or video in enclosures
  if (item.enclosure && item.enclosure.url) {
    const type = item.enclosure.type && item.enclosure.type.startsWith('video') ? 'video' : 'image';
    return { type, url: item.enclosure.url };
  }

  // Try media:content for feeds that don't use enclosure
  if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
    const type = item.mediaContent.$.medium === 'video' || (item.mediaContent.$.type && item.mediaContent.$.type.startsWith('video')) ? 'video' : 'image';
    return { type, url: item.mediaContent.$.url };
  }

  // Basic regex for images in content if no enclosure
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = (item.content || '').match(imgRegex);
  if (match) {
    return { type: 'image', url: match[1] };
  }

  return null;
};

module.exports = { normalizeRSS };
