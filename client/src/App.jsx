import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import './widgets.css';
import IntelligenceCard from './components/IntelligenceCard';
import FilterBar from './components/FilterBar';
import StatusBanner from './components/StatusBanner';
import MediaViewer from './components/MediaViewer';
import LiveWidgetFeed from './components/LiveWidgetFeed';
import Footer from './components/Footer';
import About from './pages/About';
import { Target, Radio, RefreshCw, Sun, Moon, Zap, ShieldCheck, Globe, Info, Activity, Server, AlertTriangle, HeartPulse, Anchor, Eye, Flame, Shield } from 'lucide-react';

const queryClient = new QueryClient();

const FlashpointApp = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [filters, setFilters] = useState({ actors: [], tags: [], sources: [], verificationLevel: [] });
  const [items, setItems] = useState([]);
  const [sources, setSources] = useState([]);
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState({ totalCount: 0 });
  const [activeMedia, setActiveMedia] = useState(null);
  const [newItemsCount, setNewItemsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState('feed');

  const isOperational = health ? Object.values(health).every(h => h && h.status !== 'error') : false;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/sources').then(res => setSources(res.data));
    axios.get('http://localhost:3001/api/health').then(res => setHealth(res.data));
    axios.get('http://localhost:3001/api/stats').then(res => setStats(res.data));
  }, []);

  const { data: initialData, isLoading, refetch } = useQuery({
    queryKey: ['feed', filters, currentPage],
    queryFn: async () => {
      if (currentPage !== 'feed') return items;
      const params = new URLSearchParams(); // FIX: new URLSearchParams
      if (filters.actors.length) params.append('actors', filters.actors.join(','));
      if (filters.tags.length) params.append('tags', filters.tags.join(','));
      if (filters.sources.length) params.append('sources', filters.sources.join(','));
      if (filters.verificationLevel.length) params.append('verificationLevel', filters.verificationLevel.join(','));
      const res = await axios.get(`http://localhost:3001/api/feed?${params.toString()}`);
      return res.data;
    },
    enabled: currentPage === 'feed'
  });

  useEffect(() => {
    if (initialData && currentPage === 'feed') {
      setItems(initialData);
      setNewItemsCount(0);
    }
  }, [initialData, currentPage]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_ITEM') {
        const newItem = data.payload;
        if (newItem && currentPage === 'feed') {
          setNewItemsCount(prev => prev + 1);
        }
        setStats(prev => ({ totalCount: prev.totalCount + 1 }));
        setItems(prev => [newItem, ...prev.filter(i => i.id !== newItem.id)].slice(0, 100));
      } else if (data.type === 'STATUS_UPDATE') {
        setHealth(data.payload);
      }
    };
    return () => ws.close();
  }, [filters, currentPage]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleTileFilterClick = (type, value) => {
    setFilters(prev => {
      const current = prev[type] || [];
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [type]: next };
    });
  };

  return (
    <div className="app-shell">
      <header className="fixed-header">
        <div className="header-left">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--accent-glow)]">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter leading-none italic uppercase">FLASHPOINT</h1>
            <div className="flex-icon-text mt-1 mono opacity-50">
              <ShieldCheck style={{ width: '0.85rem', height: '0.85rem' }} className="text-accent" />
              <span>SECURE PROTOCOL</span>
            </div>
          </div>
          <nav className="ml-10 hidden sm:flex gap-8 items-center h-full">
            <button
              onClick={() => setCurrentPage('feed')}
              className={`mono text-[11px] font-black tracking-widest hover:text-accent transition-all cursor-pointer h-full flex items-center ${currentPage === 'feed' ? 'text-accent border-b-2 border-accent' : 'text-text-muted opacity-40'}`}
            >
              FEED
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className={`mono text-[11px] font-black tracking-widest hover:text-accent transition-all cursor-pointer h-full flex items-center ${currentPage === 'about' ? 'text-accent border-b-2 border-accent' : 'text-text-muted opacity-40'}`}
            >
              ABOUT
            </button>
          </nav>
        </div>

        <div className="header-center">
          <div className="header-stat-group">
            <span className="mono text-[10px] opacity-30 tracking-widest">HEALTH</span>
            <div className="header-stat-value text-[11px] font-black flex-icon-text">
              <HeartPulse style={{ width: '0.9rem', height: '0.9rem' }} className={isOperational ? 'text-green-500' : 'text-accent'} />
              <div className={`w-1.5 h-1.5 rounded-full ${isOperational ? 'bg-green-500' : 'bg-accent'}`}></div>
              <span>{isOperational ? 'STABLE' : 'DEGRADED'}</span>
            </div>
          </div>
          <div className="header-stat-group">
            <span className="mono text-[10px] opacity-30 tracking-widest">NODES</span>
            <div className="header-stat-value text-[11px] font-black flex-icon-text">
              <Server style={{ width: '0.9rem', height: '0.9rem' }} className="opacity-40" /> <span>{sources.length} NODES</span>
            </div>
          </div>
          <div className="header-stat-group">
            <span className="mono text-[10px] opacity-30 tracking-widest">MONITORING</span>
            <div className="header-stat-value text-[11px] font-black flex-icon-text">
              <Activity style={{ width: '0.9rem', height: '0.9rem' }} className="text-accent" /> <span>{stats.totalCount || items.length} EVENTS</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <button onClick={toggleTheme} className="p-2.5 hover:bg-bg-surface rounded-xl transition-all border border-border group cursor-pointer">
            {theme === 'dark' ? <Sun style={{ width: '1.1rem', height: '1.1rem' }} className="text-amber-400 group-hover:rotate-45 transition-transform" /> : <Moon style={{ width: '1.1rem', height: '1.1rem' }} className="text-slate-400 group-hover:-rotate-12 transition-transform" />}
          </button>
        </div>
      </header>

      <div className="content-area">
        {currentPage === 'about' ? (
          <About onBack={() => setCurrentPage('feed')} sources={sources} />
        ) : (
          <div className="main-layout-wrapper">

            {/* Left Sidebar Layout (Widgets Box) */}
            <aside className="widget-sidebar">
              <div className="widget-sidebar-header">
                <Activity style={{ width: '12px', height: '12px' }} />
                Active Telemetry
              </div>
              <div className="widget-sidebar-content">
                <LiveWidgetFeed
                  title="FLIGHTRADAR24"
                  endpoint="http://localhost:3001/api/flightradar"
                  icon={<Radio style={{ width: '16px', height: '16px', color: '#ff6a00' }} />}
                />
                <LiveWidgetFeed
                  title="US DEPLOYMENTS"
                  endpoint="http://localhost:3001/api/us-deployments"
                  icon={<Target style={{ width: '16px', height: '16px', color: '#fcbb00' }} />}
                />
                <LiveWidgetFeed
                  title="CYBER & COMMS"
                  endpoint="http://localhost:3001/api/cyber-comms"
                  icon={<Zap style={{ width: '16px', height: '16px', color: '#3080ff' }} />}
                />
                <LiveWidgetFeed
                  title="POLYMARKET"
                  endpoint="http://localhost:3001/api/polymarket"
                  icon={<Activity style={{ width: '16px', height: '16px', color: '#a0aec0' }} />}
                />
                <LiveWidgetFeed
                  title="MARITIME & TRADE"
                  endpoint="http://localhost:3001/api/maritime"
                  icon={<Anchor style={{ width: '16px', height: '16px', color: '#06b6d4' }} />}
                />
                <LiveWidgetFeed
                  title="SATELLITE GEOINT"
                  endpoint="http://localhost:3001/api/geoint"
                  icon={<Eye style={{ width: '16px', height: '16px', color: '#a855f7' }} />}
                />
                <LiveWidgetFeed
                  title="ENERGY MARKETS"
                  endpoint="http://localhost:3001/api/energy"
                  icon={<Flame style={{ width: '16px', height: '16px', color: '#f97316' }} />}
                />
                <LiveWidgetFeed
                  title="IRGC DEPLOYMENTS"
                  endpoint="http://localhost:3001/api/irgc-deployments"
                  icon={<Target style={{ width: '16px', height: '16px', color: '#10b981' }} />}
                />
                <LiveWidgetFeed
                  title="IDF DEPLOYMENTS"
                  endpoint="http://localhost:3001/api/idf-deployments"
                  icon={<Shield style={{ width: '16px', height: '16px', color: '#3b82f6' }} />}
                />
              </div>
            </aside>

            {/* Central Main Feed Layout */}
            <main className="feed-container">
              <div className="p-10 bg-[#0b0f14] border border-[#2d3748] mb-16 shadow-md transition-all duration-300 hover:border-[#fcbb00] hover:shadow-[0_0_15px_rgba(252,187,0,0.15)]">
                <h3 className="flex-icon-text text-sm font-black mono mb-4 text-accent tracking-widest uppercase">
                  <Globe style={{ width: '1.2rem', height: '1.2rem' }} /> <span>Monitoring Advisory</span>
                </h3>
                <p className="text-text-muted text-sm font-medium leading-relaxed">
                  TACTICAL INTELLIGENCE gathering active. Tracking real-time developments within the <span className="text-text-main font-bold">Iran-Israel-USA</span> axis.
                  Normalized from official state communications and verified OSINT channels.
                </p>
                <p className="text-[10px] mono text-accent mt-4 opacity-70">
                  // RETENTION POLICY: Feed only retains and reflects data from the last 24 hours. Older records are purged.
                </p>
              </div>

              <div className="mb-0">
                <StatusBanner health={health} />
              </div>

              <div className="mb-8 mt-8">
                <FilterBar filters={filters} setFilters={setFilters} sources={sources} />
              </div>

              <div className="flex flex-col">
                {newItemsCount > 0 && (
                  <button
                    onClick={() => {
                      refetch();
                      axios.get('http://localhost:3001/api/stats').then(res => setStats(res.data));
                      setNewItemsCount(0);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full button-red-glow py-4 mb-8 shadow-lg transition-all cursor-pointer font-black text-[11px] mono tracking-widest border border-accent-alert"
                  >
                    DETECTED {newItemsCount} NEW FEEDS // SYNC STREAM
                  </button>
                )}

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center p-32 opacity-20">
                    <RefreshCw className="w-12 h-12 animate-spin mb-6 text-accent" />
                    <span className="mono font-black text-[10px] tracking-widest">BUFFERING STREAM</span>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {items.map(item => (
                      <IntelligenceCard
                        key={item.id}
                        item={item}
                        onMediaClick={setActiveMedia}
                        filters={filters}
                        onActorClick={(actor) => handleTileFilterClick('actors', actor)}
                        onTagClick={(tag) => handleTileFilterClick('tags', tag)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </main>


          </div>
        )}
      </div>

      <footer className="fixed-footer">
        <Footer />
      </footer>
      <MediaViewer media={activeMedia} onClose={() => setActiveMedia(null)} />
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FlashpointApp />
    </QueryClientProvider>
  );
}
