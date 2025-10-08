import { useEffect, useState } from 'react';
import { X, Clock, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GeologicalErasPanel from './GeologicalErasPanel';
import CinematicErasPanel from './CinematicErasPanel';

interface PlanetData {
  id: string;
  name: string;
  mass_kg: number;
  radius_km: number;
  distance_au: number;
  distance_km: number;
  mean_temp_c: number;
  composition: Record<string, number>;
  atmosphere: string;
  moons: number;
  orbital_period_days: number;
  rotation_period_hours: number;
  info: string;
  color: string;
}

interface PlanetInfoPanelProps {
  planetId: string | null;
  onClose: () => void;
}

const PlanetInfoPanel = ({ planetId, onClose }: PlanetInfoPanelProps) => {
  const [planetData, setPlanetData] = useState<PlanetData | null>(null);
  const [showGeologicalEras, setShowGeologicalEras] = useState(false);
  const [showCinematicEras, setShowCinematicEras] = useState(false);

  useEffect(() => {
    if (!planetId) return;

    fetch('/data/planets.json')
      .then((res) => res.json())
      .then((data) => {
        const planet = data.planets.find((p: PlanetData) => p.id === planetId);
        setPlanetData(planet || null);
      });
  }, [planetId]);

  if (!planetId || !planetData) return null;

  const formatNumber = (num: number) => {
    return num.toExponential(2);
  };

  const formatDistance = (km: number) => {
    return (km / 1000000).toFixed(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full glow-primary"
              style={{ backgroundColor: planetData.color }}
            />
            <div>
              <h2 className="text-3xl font-bold text-primary">{planetData.name}</h2>
              <p className="text-sm text-muted-foreground">سیاره</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-muted/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <p className="text-foreground/90 leading-relaxed">{planetData.info}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">جرم</p>
              <p className="text-lg font-semibold">{formatNumber(planetData.mass_kg)} kg</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">شعاع</p>
              <p className="text-lg font-semibold">{planetData.radius_km.toLocaleString()} km</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">فاصله از خورشید</p>
              <p className="text-lg font-semibold">{formatDistance(planetData.distance_km)} میلیون کیلومتر</p>
              <p className="text-xs text-muted-foreground">{planetData.distance_au} AU</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">دمای میانگین</p>
              <p className="text-lg font-semibold">{planetData.mean_temp_c}°C</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">دوره مداری</p>
              <p className="text-lg font-semibold">{planetData.orbital_period_days.toLocaleString()} روز</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">دوره چرخش</p>
              <p className="text-lg font-semibold">{Math.abs(planetData.rotation_period_hours).toFixed(1)} ساعت</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">ترکیب</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(planetData.composition).map(([element, percentage]) => (
                <span
                  key={element}
                  className="px-3 py-1 bg-secondary/30 rounded-full text-sm"
                >
                  {element}: {percentage}%
                </span>
              ))}
            </div>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">جو</p>
            <p className="text-lg">{planetData.atmosphere}</p>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">قمرها</p>
            <p className="text-lg font-semibold">{planetData.moons}</p>
          </div>
        </div>

        {planetId === 'earth' && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button
              onClick={() => setShowGeologicalEras(true)}
              className="gap-2"
              size="lg"
              variant="outline"
            >
              <Clock className="w-5 h-5" />
              دوره‌های زمین‌شناسی
            </Button>
            <Button
              onClick={() => setShowCinematicEras(true)}
              className="gap-2"
              size="lg"
            >
              <Film className="w-5 h-5" />
              نمایش سینمایی
            </Button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            منابع داده: NASA Planetary Fact Sheet, ESA Space Science
          </p>
        </div>
      </div>

      {showGeologicalEras && (
        <GeologicalErasPanel onClose={() => setShowGeologicalEras(false)} />
      )}

      {showCinematicEras && (
        <CinematicErasPanel onClose={() => setShowCinematicEras(false)} />
      )}
    </div>
  );
};

export default PlanetInfoPanel;
