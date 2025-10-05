import { useState, useEffect } from 'react';
import CosmicCanvas from '@/components/CosmicCanvas';
import PlanetInfoPanel from '@/components/PlanetInfoPanel';
import ControlPanel from '@/components/ControlPanel';
import BigBangAnimation from '@/components/BigBangAnimation';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showBigBang, setShowBigBang] = useState(false);
  const [hasSeenBigBang, setHasSeenBigBang] = useState(false);

  // Show Big Bang animation on first load
  useEffect(() => {
    const seen = localStorage.getItem('hasSeenBigBang');
    if (!seen) {
      setShowBigBang(true);
    } else {
      setHasSeenBigBang(true);
    }
  }, []);

  const handlePlanetClick = (planetId: string) => {
    setSelectedPlanet(planetId);
  };

  const handleClosePanel = () => {
    setSelectedPlanet(null);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setAnimationPhase(0);
    setIsPlaying(false);
    setSelectedPlanet(null);
  };

  const handleBigBangComplete = () => {
    setShowBigBang(false);
    setHasSeenBigBang(true);
    localStorage.setItem('hasSeenBigBang', 'true');
  };

  const handleBigBangSkip = () => {
    setShowBigBang(false);
    setHasSeenBigBang(true);
    localStorage.setItem('hasSeenBigBang', 'true');
  };

  const handleReplayBigBang = () => {
    setShowBigBang(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Big Bang Animation */}
      {showBigBang && (
        <div className="absolute inset-0 z-50">
          <BigBangAnimation 
            onComplete={handleBigBangComplete}
            onSkip={handleBigBangSkip}
          />
        </div>
      )}
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 p-6">
        <div className="glass-panel px-6 py-4 rounded-2xl inline-flex items-center gap-3 glow-secondary">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cosmic Evolution Simulator</h1>
            <p className="text-sm text-muted-foreground">
              From the Big Bang to the Solar System
            </p>
          </div>
        </div>
      </header>

      {/* Info Card */}
      <div className="absolute top-6 right-6 z-30 max-w-sm">
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <h2 className="text-lg font-semibold text-primary">Explore the Cosmos</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Click on any planet to view detailed scientific information. Use the controls below
            to pause, resume, or adjust the orbital speed.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full">
              Interactive 3D
            </span>
            <span className="text-xs px-3 py-1 bg-secondary/20 text-secondary rounded-full">
              Real Data
            </span>
            <span className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full">
              Educational
            </span>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <CosmicCanvas
        onPlanetClick={handlePlanetClick}
        animationPhase={animationPhase}
        isPlaying={isPlaying}
        speed={speed}
      />

      {/* Control Panel */}
      <ControlPanel
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        onReplayBigBang={handleReplayBigBang}
        showReplayButton={hasSeenBigBang}
      />

      {/* Planet Info Panel */}
      <PlanetInfoPanel planetId={selectedPlanet} onClose={handleClosePanel} />

      {/* Attribution */}
      <div className="absolute bottom-6 left-6 z-30">
        <div className="glass-panel px-4 py-2 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Data: NASA, ESA | Built with Three.js
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
