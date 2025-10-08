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
  return <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Big Bang Animation */}
      {showBigBang && <div className="absolute inset-0 z-50">
          <BigBangAnimation onComplete={handleBigBangComplete} onSkip={handleBigBangSkip} />
        </div>}
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 p-6">
        
      </header>

      {/* Info Card */}
      <div className="absolute top-6 right-6 z-30 max-w-sm">
        
      </div>

      {/* 3D Canvas */}
      <CosmicCanvas onPlanetClick={handlePlanetClick} animationPhase={animationPhase} isPlaying={isPlaying} speed={speed} />

      {/* Control Panel */}
      <ControlPanel isPlaying={isPlaying} onPlayPause={handlePlayPause} onReset={handleReset} speed={speed} onSpeedChange={setSpeed} onReplayBigBang={handleReplayBigBang} showReplayButton={hasSeenBigBang} />

      {/* Planet Info Panel */}
      <PlanetInfoPanel planetId={selectedPlanet} onClose={handleClosePanel} />

      {/* Attribution */}
      <div className="absolute bottom-6 left-6 z-30">
        <div className="glass-panel px-4 py-2 rounded-lg">
          <p className="text-xs text-muted-foreground">
            داده‌ها: NASA, ESA | ساخته شده با Three.js
          </p>
        </div>
      </div>
    </div>;
};
export default Index;