import React from 'react';

const FilterBar = ({ filters, setFilters, sources }) => {
    const actors = ['Iran', 'Israel', 'USA'];
    const tags = ['Politics', 'Bombing', 'Deaths', 'Assassinations', 'Defects', 'Conflict', 'Protests', 'Europe', 'Nuclear', 'Crimes'];
    const verificationLevels = ['official', 'verified', 'unverified', 'speculation'];

    const toggleFilter = (key, value) => {
        setFilters(prev => {
            const current = prev[key] || [];
            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [key]: next };
        });
    };

    return (
        <div className="filter-bar bg-bg-surface border border-border p-5 mb-6 shadow-md transition-all duration-300 hover:border-accent hover:shadow-[0_0_15px_rgba(252,187,0,0.15)]">
            <div className="flex flex-col gap-6">
                <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 mono">Actors</h4>
                    <div className="flex flex-wrap gap-2">
                        {actors.map(actor => (
                            <button
                                key={actor}
                                onClick={() => toggleFilter('actors', actor)}
                                className={`tag-btn ${filters.actors?.includes(actor) ? 'tag-btn-active' : 'tag-btn-inactive'}`}
                            >
                                {actor}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 mono">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleFilter('tags', tag)}
                                className={`tag-btn ${filters.tags?.includes(tag) ? 'tag-btn-active' : 'tag-btn-inactive'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 mono">Sources</h4>
                    <div className="flex flex-wrap gap-2">
                        {sources.map(source => (
                            <button
                                key={source.id}
                                onClick={() => toggleFilter('sources', source.id)}
                                className={`tag-btn ${filters.sources?.includes(source.id) ? 'tag-btn-active' : 'tag-btn-inactive'}`}
                            >
                                {source.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 mono">Verification Level</h4>
                    <div className="flex flex-wrap gap-2">
                        {verificationLevels.map(level => (
                            <button
                                key={level}
                                onClick={() => toggleFilter('verificationLevel', level)}
                                className={`tag-btn capitalize ${filters.verificationLevel?.includes(level) ? 'tag-btn-active' : 'tag-btn-inactive'}`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
