import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LiveWidgetFeed = ({ title, endpoint, icon }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchFeeds = async () => {
            try {
                const res = await axios.get(endpoint);
                setItems(res.data || []);
            } catch (err) {
                console.error(`Error fetching proxy live feeds from ${endpoint}`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeeds();
        const fetchInterval = setInterval(fetchFeeds, 60000); // 1-minute updates
        return () => clearInterval(fetchInterval);
    }, [endpoint]);

    useEffect(() => {
        if (items.length <= 1) return;
        const cycleInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, 6000); // Crossfade every 6 seconds

        return () => clearInterval(cycleInterval);
    }, [items]);

    const activeItem = items[currentIndex];

    // Format google proxy relative time "NN minutes ago", or fallback to standard ISO.
    const getFormattedTime = (item) => {
        if (!item) return '';
        if (item.pubDate) {
            const date = new Date(item.pubDate);
            const hoursAgo = Math.round((new Date() - date) / (1000 * 60 * 60));
            if (hoursAgo === 0) return 'JUST NOW';
            return `${hoursAgo}H AGO`;
        }
        return 'LIVE';
    }

    return (
        <div className="widget-item">

            {/* Header / Origin */}
            <div className="widget-item-header">
                <h4 className="widget-item-title">
                    {icon}
                    <span>{title}</span>
                </h4>
                {/* Live pulsing dot */}
                <div className="widget-pulse-container">
                    <span className="widget-pulse-anim"></span>
                    <span className="widget-pulse-dot"></span>
                </div>
            </div>

            <div className="widget-body">
                {loading ? (
                    <div className="widget-loading">
                        <div className="widget-skeleton-1"></div>
                        <div className="widget-skeleton-2"></div>
                    </div>
                ) : items.length > 0 && activeItem ? (
                    <div className="widget-content-anim" key={currentIndex}>
                        <p className="widget-text">
                            &gt; {activeItem.title.replace(/ - [^-]*$/, '')}
                        </p>

                        <div className="widget-meta">
                            <span className="widget-time">
                                [{getFormattedTime(activeItem)}]
                            </span>

                            {/* Auto-cycling structural progress bar visual indicator */}
                            <div className="widget-progress-track">
                                <div className="widget-progress-fill" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="widget-error">
                        <span className="widget-error-title">ERR_NO_DATA</span>
                        <span className="widget-error-text">AWAITING SIGNAL...</span>
                    </div>
                )}
            </div>

            {/* Background Structural Effects */}
            <div className="widget-bg-icon">
                {icon}
            </div>
            {/* Sharp Ambient Strip */}
            <div className="widget-bg-strip"></div>
        </div>
    );
};

export default LiveWidgetFeed;
