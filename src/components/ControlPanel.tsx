import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const ControlPanel = ({
  isPlaying,
  onPlayPause,
  onReset,
  speed,
  onSpeedChange,
}: ControlPanelProps) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 glow-primary">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlayPause}
          className="hover:bg-primary/20 hover:text-primary transition-smooth"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="hover:bg-primary/20 hover:text-primary transition-smooth"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <div className="w-px h-8 bg-border/50" />

        <div className="flex items-center gap-3 min-w-[200px]">
          <Zap className="w-4 h-4 text-primary" />
          <Slider
            value={[speed]}
            onValueChange={(values) => onSpeedChange(values[0])}
            min={0.1}
            max={3}
            step={0.1}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground min-w-[3ch] text-right">
            {speed.toFixed(1)}x
          </span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
