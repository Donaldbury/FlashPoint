import React from 'react';
import { ExternalLink, Video, Image as ImageIcon, Clock, ShieldCheck, ShieldAlert, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const IntelligenceCard = ({ item, onMediaClick, onActorClick, onTagClick, filters }) => {
    const {
        title, summary, sourceName, publishedAt,
        tags, actors, media, verificationLevel, originalUrl
    } = item;

    const isVerified = ['official', 'verified'].includes(verificationLevel);

    const highlightKeywords = (text) => {
        if (!text || typeof text !== 'string') return text;
        const keywords = [
            'iran', 'israel', 'hezbollah', 'hamas', 'idf', 'houthi', 'houthis',
            'strike', 'strikes', 'missile', 'missiles', 'drone', 'drones',
            'cyberattack', 'cyber', 'outage', 'critical', 'usa', 'us',
            'military', 'navy', 'dead', 'killed', 'attack', 'attacks', 'war'
        ];
        const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, i) => {
            if (keywords.some(k => k.toLowerCase() === part.toLowerCase())) {
                return (
                    <span key={i} className="text-accent-alert font-black bg-accent-alert/10 px-1 border border-accent-alert/20 rounded-sm">
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <article className="intelligence-tile fade-in">
            <div className="flex flex-col gap-8">

                {/* Top Header - Source & Time */}
                <div className="flex items-center justify-between border-b border-border pb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            {/* 6. Origin Label + Title Styling */}
                            <span className="origin-style">Origin: </span>
                            <span className="origin-style">{sourceName}</span>
                        </div>
                        {/* 8. Global Icon/Text Alignment Consistency */}
                        <div className={`flex-icon-text px-3 py-1 border text-[10px] font-bold uppercase mono ${isVerified ? 'text-green-500 border-green-500 bg-[#0b0f14]' : 'text-accent-alert border-accent-alert bg-[#0b0f14]'}`}>
                            {isVerified ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                            {verificationLevel}
                        </div>
                    </div>
                    {/* 8. Global Icon/Text Alignment Consistency */}
                    <div className="flex-icon-text mono opacity-40 text-[10px]">
                        <Clock size={12} />
                        <span>{formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-black leading-tight tracking-tight uppercase italic underline decoration-accent/20 decoration-2 underline-offset-8">
                        {title}
                    </h2>

                    <div className="flex flex-col lg:flex-row gap-8 items-start mt-4">
                        <div className="flex-1 space-y-6">
                            <p className="text-base text-text-muted leading-relaxed font-medium">
                                {highlightKeywords(summary)}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {actors.map(actor => (
                                    <button
                                        key={actor}
                                        onClick={() => onActorClick && onActorClick(actor)}
                                        className={`tag-btn ${filters?.actors?.includes(actor) ? 'tag-btn-active' : 'tag-btn-inactive'}`}
                                    >
                                        @{actor.toUpperCase()}
                                    </button>
                                ))}
                                {tags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => onTagClick && onTagClick(tag)}
                                        className={`tag-btn ${filters?.tags?.includes(tag) ? 'tag-btn-active' : 'tag-btn-inactive'}`}
                                    >
                                        #{tag.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-4">
                                {/* 8. Global Icon/Text Alignment Consistency */}
                                <a href={originalUrl} target="_blank" rel="noopener noreferrer" className="flex-icon-text inline-flex mono text-[10px] text-accent font-bold hover:translate-x-1 transition-transform">
                                    VIEW FULL REPORT <ChevronRight size={14} />
                                </a>
                            </div>
                        </div>

                        {media && (
                            <div
                                className="media-thumbnail shadow-lg hover:border-accent transition-colors shrink-0"
                                onClick={() => onMediaClick(media)}
                            >
                                {media.type === 'image' ? (
                                    <img src={media.url} alt="Intel Imagery" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-bg-surface gap-2">
                                        <Video className="w-8 h-8 text-accent" />
                                        <span className="mono text-[8px] opacity-40">Stream Buffer</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default IntelligenceCard;
