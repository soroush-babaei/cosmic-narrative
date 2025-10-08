import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import precambrianImg from '@/assets/era-precambrian.jpg';
import paleozoicImg from '@/assets/era-paleozoic.jpg';
import mesozoicImg from '@/assets/era-mesozoic.jpg';
import cenozoicImg from '@/assets/era-cenozoic.jpg';

interface Era {
  name: string;
  nameEn: string;
  period: string;
  duration: string;
  characteristics: string;
  color: string;
  image: string;
}

interface GeologicalErasPanelProps {
  onClose: () => void;
}

const eras: Era[] = [
  {
    name: 'پرکامبرین',
    nameEn: 'Precambrian',
    period: '4.6 میلیارد - 541 میلیون سال پیش',
    duration: '~4 میلیارد سال',
    characteristics: 'تشکیل زمین، ظهور اولین موجودات تک‌سلولی، تشکیل اقیانوس‌ها و جو اولیه',
    color: '#F48C06',
    image: precambrianImg
  },
  {
    name: 'پالئوزوئیک',
    nameEn: 'Paleozoic',
    period: '541 - 252 میلیون سال پیش',
    duration: '~289 میلیون سال',
    characteristics: 'انفجار کامبرین، ظهور ماهی‌ها، گیاهان و حشرات، تشکیل جنگل‌های اولیه، ظهور خزندگان',
    color: '#0077B6',
    image: paleozoicImg
  },
  {
    name: 'مزوزوئیک',
    nameEn: 'Mesozoic',
    period: '252 - 66 میلیون سال پیش',
    duration: '~186 میلیون سال',
    characteristics: 'عصر دایناسورها، ظهور پرندگان و پستانداران، تشکیل گیاهان گلدار، انقراض دسته‌جمعی',
    color: '#06A77D',
    image: mesozoicImg
  },
  {
    name: 'سنوزوئیک',
    nameEn: 'Cenozoic',
    period: '66 میلیون سال پیش - اکنون',
    duration: '~66 میلیون سال',
    characteristics: 'عصر پستانداران، ظهور انسان، تشکیل کوه‌های مدرن، عصر یخبندان‌ها',
    color: '#7209B7',
    image: cenozoicImg
  }
];

const GeologicalErasPanel = ({ onClose }: GeologicalErasPanelProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-panel max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">دوره‌های زمین‌شناسی زمین</h2>
            <p className="text-sm text-muted-foreground">تاریخچه 4.6 میلیارد ساله سیاره ما</p>
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
          {eras.map((era, index) => (
            <div
              key={era.nameEn}
              className="glass-panel rounded-xl border-l-4 hover:bg-muted/10 transition-all duration-300 overflow-hidden animate-fade-in"
              style={{ 
                borderLeftColor: era.color,
                animationDelay: `${index * 150}ms`
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={era.image} 
                  alt={era.name}
                  className="w-full h-full object-cover hover-scale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      style={{ backgroundColor: era.color }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">{era.name}</h3>
                      <p className="text-sm text-white/90 drop-shadow-md">{era.nameEn}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white drop-shadow-lg">{era.duration}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">دوره:</span>
                  <span className="text-sm text-foreground">{era.period}</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {era.characteristics}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            اطلاعات بر اساس مقیاس زمانی زمین‌شناسی بین‌المللی (International Geological Time Scale)
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeologicalErasPanel;
