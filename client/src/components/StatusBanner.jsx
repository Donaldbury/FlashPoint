import React from 'react';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';

const humanizeError = (errorStr) => {
    if (!errorStr) return "Unknown Error";
    if (errorStr.includes('ETIMEDOUT')) return 'Connection timed out';
    if (errorStr.includes('ECONNREFUSED')) return 'Connection refused by server';
    if (errorStr.includes('ENOTFOUND')) return 'Domain not found';
    if (errorStr.includes('403')) return 'Access forbidden (403)';
    if (errorStr.includes('404')) return 'Feed not found (404)';
    if (errorStr.includes('500')) return 'Internal server error (500)';
    if (errorStr.includes('502')) return 'Bad gateway (502)';
    if (errorStr.includes('503')) return 'Service unavailable (503)';
    if (errorStr.includes('Parse Error')) return 'Failed to parse RSS feed data';
    return errorStr;
};

const mapFeedIdToName = (id) => {
    const map = {
        'bbc': 'BBC Middle East',
        'reuters': 'Reuters World',
        'timesofisrael': 'Times of Israel',
        'iranintl': 'Iran International',
        'idf': 'IDF Official'
    };
    return map[id] || id.toUpperCase();
};

const StatusBanner = ({ health }) => {
    // health is { operational: boolean, bbc: { status: 'error', error: '...' }, ... }
    const errors = Object.entries(health || {})
        .filter(([key, val]) => val && val.status === 'error')
        .map(([key, val]) => ({
            feedName: mapFeedIdToName(key),
            humanError: humanizeError(val.error)
        }));

    const isConnected = !!health && Object.keys(health).length > 0;

    if (!isConnected) {
        return (
            <div className="bg-[#0b0f14] border border-accent-alert p-3 text-center flex items-center justify-center gap-2 shadow-sm mono text-xs text-accent-alert uppercase tracking-widest">
                <WifiOff className="w-4 h-4 pulse" />
                <span className="font-bold tracking-widest">CONNECTING TO INTELLIGENCE FEED...</span>
            </div>
        );
    }

    if (errors.length === 0) {
        return (
            <div className="bg-[#0b0f14] border border-green-500 p-3 text-center flex items-center justify-center gap-2 shadow-sm mono text-[10px] text-green-500 uppercase tracking-widest">
                <Wifi className="w-4 h-4" />
                <span className="font-bold tracking-widest">ALL SYSTEMS OPERATIONAL // REAL-TIME MONITORING ACTIVE</span>
            </div>
        );
    }

    return (
        <div className="bg-[#0b0f14] border border-accent p-4 flex items-center gap-4 shadow-sm mono text-xs text-accent w-full overflow-hidden uppercase tracking-widest">
            <div className="flex items-center gap-2 font-bold shrink-0">
                <AlertCircle className="w-4 h-4 pulse text-accent" />
                <span className="text-accent text-[11px]">SYSTEM DEGRADATION: {errors.length} NODE{errors.length > 1 ? 'S' : ''} OFFLINE</span>
            </div>
            {/* User Feedback: Inline Marquee Right to Left */}
            <div className="marquee-container ml-2">
                <div className="marquee-content text-[10px] opacity-80 uppercase tracking-widest flex items-center h-full">
                    {errors.map((e, idx) => (
                        <span key={idx} className="marquee-item">
                            <span className="font-bold text-text-main">{e.feedName}</span>
                            <span className="opacity-50">||</span>
                            <span className="text-accent">{e.humanError}</span>
                        </span>
                    ))}
                </div>
                <div className="marquee-content text-[10px] opacity-80 uppercase tracking-widest flex items-center h-full" aria-hidden="true">
                    {errors.map((e, idx) => (
                        <span key={`dup-${idx}`} className="marquee-item">
                            <span className="font-bold text-text-main">{e.feedName}</span>
                            <span className="opacity-50">||</span>
                            <span className="text-accent">{e.humanError}</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatusBanner;
