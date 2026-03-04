import React from 'react';
import { X } from 'lucide-react';

const MediaViewer = ({ media, onClose }) => {
    if (!media) return null;

    return (
        <div className="media-modal-overlay fade-in" onClick={onClose}>
            <div className="media-modal-content relative" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                    <X style={{ width: '1.5rem', height: '1.5rem' }} />
                </button>

                {media.type === 'image' ? (
                    <img
                        src={media.url}
                        alt="Intelligence imagery"
                    />
                ) : (
                    <video
                        src={media.url}
                        controls
                        autoPlay
                    />
                )}

                <div className="absolute top-[calc(100%+0.5rem)] right-0 text-right w-full">
                    <p className="mono text-[0.6rem] text-white/40 tracking-[0.3em] uppercase">Intelligence Source Verified // Press ESC to Close</p>
                </div>
            </div>
        </div>
    );
};

export default MediaViewer;
