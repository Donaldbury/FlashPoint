import React from 'react';
import { Target, Activity, Layout, Globe, ChevronLeft } from 'lucide-react';

const AboutSection = ({ icon: Icon, title, children }) => (
    <section className="mb-20 last:mb-0">
        {/* 8. Global Icon/Text Alignment Consistency on Section headers */}
        <div className="flex-icon-text mb-8 gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-sm shrink-0">
                <Icon size={24} />
            </div>
            <h3 className="text-2xl font-black italic tracking-tight uppercase text-accent border-b-2 border-accent/20 pb-2 w-full">{title}</h3>
        </div>
        <div className="bg-bg-card border border-border rounded-2xl p-10 shadow-lg text-text-muted leading-relaxed">
            {children}
        </div>
    </section>
);

const About = ({ onBack, sources }) => {
    return (
        <div className="fade-in max-w-[800px] w-full px-4 py-8">
            {/* 4. About Page - Return button alignment (using global flex-icon-text) */}
            <button
                onClick={onBack}
                className="flex-icon-text mb-16 mono text-accent font-black hover:translate-x-[-4px] transition-transform cursor-pointer px-4 py-2 border border-accent/20 rounded-md bg-accent/5"
            >
                <ChevronLeft size={16} /> <span>RETURN TO STREAM</span>
            </button>

            {/* 5. About Page - UI Redesign. Structured with elegant hierarchy. */}
            <header className="mb-20 text-center">
                <h2 className="text-6xl font-black italic tracking-tighter mb-6 uppercase drop-shadow-md">Mission: Flashpoint</h2>
                <p className="text-xl text-text-muted font-medium mx-auto max-w-2xl leading-relaxed">
                    Tactical intelligence aggregation for the Iran-Israel-USA conflict axis.
                    Flashpoint provides a unified, real-time window into official communications
                    and verified field reports.
                </p>
            </header>

            <AboutSection icon={Target} title="Operational Goal">
                <p className="mb-6 indent-8">
                    The primary objective of Flashpoint is to reduce technical friction in monitoring
                    high-stakes geopolitical events. By normalizing data from disparate RSS nodes into
                    a single tactical dashboard, we provide chronological clarity in a chaotic information
                    environment.
                </p>
                <p className="indent-8">
                    Information is strictly aggregated from recognized official outlets and
                    verified independent press to ensure a baseline of situational awareness.
                </p>
            </AboutSection>

            <AboutSection icon={Activity} title="Status Indicators">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-medium">
                    <div className="p-6 bg-bg-surface rounded-xl border border-border">
                        <h4 className="text-text-main font-bold mb-4 flex-icon-text uppercase tracking-widest text-sm">
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
                            <span>Stable Protocol</span>
                        </h4>
                        <p className="text-sm leading-relaxed opacity-80">All connected intelligence news nodes are consistently delivering data packets with sub-second latency.</p>
                    </div>
                    <div className="p-6 bg-bg-surface rounded-xl border border-border">
                        <h4 className="text-text-main font-bold mb-4 flex-icon-text uppercase tracking-widest text-sm">
                            <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_var(--accent-glow)]"></div>
                            <span>Degraded Protocol</span>
                        </h4>
                        <p className="text-sm leading-relaxed opacity-80">One or more regional data nodes are experiencing connection timeouts or unusually high server latency.</p>
                    </div>
                </div>
            </AboutSection>

            <AboutSection icon={Layout} title="Intelligence Anatomy">
                <div className="space-y-6 text-sm font-medium bg-bg-surface p-8 rounded-xl border border-border">
                    <div className="flex gap-4 p-4 hover:bg-bg-card transition-colors rounded-lg">
                        <span className="mono text-accent w-32 shrink-0 font-bold">Source Origin</span>
                        <span className="opacity-80">The geographic and institutional source of the intelligence packet.</span>
                    </div>
                    <div className="flex gap-4 border-t border-border p-4 hover:bg-bg-card transition-colors rounded-lg">
                        <span className="mono text-accent w-32 shrink-0 font-bold">Verification</span>
                        <span className="opacity-80">An assessment of the data's reliability (Official, Verified, Unverified, Speculation).</span>
                    </div>
                    <div className="flex gap-4 border-t border-border p-4 hover:bg-bg-card transition-colors rounded-lg">
                        <span className="mono text-accent w-32 shrink-0 font-bold">Summary</span>
                        <span className="opacity-80">A condensed, tactical breakdown of the core message or event.</span>
                    </div>
                </div>
            </AboutSection>

            <AboutSection icon={Globe} title="Active Intelligence Nodes">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sources.map(source => (
                        <div key={source.id} className="p-5 rounded-xl bg-bg-surface border border-border flex items-center justify-between hover:border-accent transition-colors">
                            <div>
                                <span className="font-black text-sm text-text-main uppercase tracking-tight block mb-1">{source.name}</span>
                                <p className="text-[10px] mono opacity-50 text-accent">{source.country.toUpperCase()}</p>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
                        </div>
                    ))}
                </div>
            </AboutSection>
        </div>
    );
};

export default About;
