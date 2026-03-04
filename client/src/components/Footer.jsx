import React from 'react';

const Footer = () => {
    return (
        <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
                <span className="mono text-[8px] tracking-[0.2em]"> Tactical Intelligence Stream </span>
            </div>

            <div className="max-w-4xl text-center">
                <p className="mono text-[8px] font-bold text-accent tracking-[0.1em] uppercase pt-1 px-4 leading-tight opacity-80">
                    Legal Disclaimer: This application is for reporting and open-source intelligence (OSINT) purposes only.
                    Information provided is aggregated from external RSS nodes and should not be used for operational,
                    security, or tactical decision-making. Flashpoint is not responsible for the accuracy of external data streams.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mono text-[8px] font-black opacity-40 uppercase tracking-[0.2em]">
                <span>&copy; 2026 CYBER INTEL DEPT - Donald Bury</span>
                <span className="cursor-pointer hover:text-accent transition-colors">Security Protocol v4.0.1 </span>
                <span className="cursor-pointer hover:text-accent transition-colors">Privacy Declaration</span>
                <span className="cursor-pointer hover:text-accent transition-colors">Terms of Engagement</span>
            </div>
        </div>
    );
};

export default Footer;
