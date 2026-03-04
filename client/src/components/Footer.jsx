import React from 'react';

const Footer = () => {
    return (
        <div className="flex flex-col items-center justify-center py-4 w-full">
            <div className="text-center mono text-[9px] text-text-muted opacity-60 tracking-widest uppercase mb-2">
                &copy; 2026 DONALD BURY // TACTICAL INTELLIGENCE STREAM
            </div>
            <div className="text-center mono text-[8px] text-accent opacity-40 uppercase tracking-[0.2em]">
                DATA AGGREGATED VIA PUBLIC OSINT & RSS NODES
            </div>
        </div>
    );
};

export default Footer;
