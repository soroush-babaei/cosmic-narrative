import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { X, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import precambrianImg from '@/assets/era-precambrian.jpg';
import paleozoicImg from '@/assets/era-paleozoic.jpg';
import mesozoicImg from '@/assets/era-mesozoic.jpg';
import cenozoicImg from '@/assets/era-cenozoic.jpg';


interface LifeForm {
  icon: string;
  name: string;
}

interface Era {
  name: string;
  nameEn: string;
  period: string;
  duration: string;
  characteristics: string;
  color: string;
  image: string;
  keyEvents: string[];
  lifeForms: LifeForm[];
  climate: string;
  transition: string;
}

const eras: Era[] = [
  {
    name: 'پرکامبرین',
    nameEn: 'Precambrian',
    period: '4.6 میلیارد - 541 میلیون سال پیش',
    duration: '~4 میلیارد سال',
    characteristics: 'تشکیل زمین و ظهور اولین حیات',
    climate: 'جو بدون اکسیژن، اقیانوس‌های داغ و اسیدی',
    transition: 'افزایش اکسیژن در جو منجر به انفجار کامبرین شد',
    color: '#F48C06',
    image: precambrianImg,
    keyEvents: [
      '🌍 تشکیل زمین از گرد و غبار کیهانی',
      '💧 تشکیل اقیانوس‌های اولیه',
      '🦠 ظهور اولین باکتری‌ها',
      '🌿 سیانوباکتری‌ها اکسیژن تولید می‌کنند',
      '🔬 ظهور سلول‌های یوکاریوتی',
      '🧬 موجودات چند سلولی اولیه'
    ],
    lifeForms: [
      { icon: '🦠', name: 'باکتری‌های اولیه' },
      { icon: '🌿', name: 'سیانوباکتری' },
      { icon: '🔬', name: 'تک‌سلولی‌ها' },
      { icon: '🧬', name: 'موجودات نرم‌تن' }
    ]
  },
  {
    name: 'پالئوزوئیک',
    nameEn: 'Paleozoic',
    period: '541 - 252 میلیون سال پیش',
    duration: '~289 میلیون سال',
    characteristics: 'انفجار حیات در دریاها و خشکی',
    climate: 'آب و هوای گرم و مرطوب، جنگل‌های انبوه',
    transition: 'انقراض پرمین بزرگ‌ترین انقراض تاریخ زمین',
    color: '#0077B6',
    image: paleozoicImg,
    keyEvents: [
      '💥 انفجار کامبرین - تنوع عظیم موجودات',
      '🐟 ظهور اولین ماهی‌ها',
      '🌱 گیاهان به خشکی می‌آیند',
      '🦗 ظهور حشرات غول‌پیکر',
      '🌳 جنگل‌های عظیم زغال‌سنگی',
      '🦎 اولین خزندگان به خشکی می‌آیند',
      '☠️ انقراض پرمین - 96% گونه‌ها نابود شدند'
    ],
    lifeForms: [
      { icon: '🦐', name: 'تریلوبیت‌ها' },
      { icon: '🐟', name: 'ماهی‌های زره‌دار' },
      { icon: '🌿', name: 'سرخس‌های غول‌پیکر' },
      { icon: '🦗', name: 'حشرات بزرگ' },
      { icon: '🦎', name: 'دوزیستان و خزندگان' }
    ]
  },
  {
    name: 'مزوزوئیک',
    nameEn: 'Mesozoic',
    period: '252 - 66 میلیون سال پیش',
    duration: '~186 میلیون سال',
    characteristics: 'عصر دایناسورها - سلطه خزندگان',
    climate: 'گرم و خشک، بدون یخچال‌های قطبی',
    transition: 'برخورد شهاب‌سنگ غول‌پیکر به انقراض دایناسورها انجامید',
    color: '#06A77D',
    image: mesozoicImg,
    keyEvents: [
      '🦕 دایناسورها تسلط می‌یابند',
      '🌺 ظهور گیاهان گلدار',
      '🦋 حشرات گرده‌افشان',
      '🦎 خزندگان دریایی و پرنده',
      '🐭 ظهور پستانداران کوچک',
      '🪶 اولین پرندگان واقعی',
      '☄️ برخورد شهاب‌سنگ - انقراض دایناسورها'
    ],
    lifeForms: [
      { icon: '🦕', name: 'دایناسورهای گیاهخوار' },
      { icon: '🦖', name: 'دایناسورهای گوشتخوار' },
      { icon: '🦅', name: 'پتروسورها (خزندگان پرنده)' },
      { icon: '🐊', name: 'کروکودیل‌های غول‌پیکر' },
      { icon: '🐭', name: 'پستانداران کوچک' }
    ]
  },
  {
    name: 'سنوزوئیک',
    nameEn: 'Cenozoic',
    period: '66 میلیون سال پیش - اکنون',
    duration: '~66 میلیون سال',
    characteristics: 'عصر پستانداران و ظهور انسان',
    climate: 'سرد شدن تدریجی، عصرهای یخبندان',
    transition: 'ظهور انسان و تغییرات محیطی توسط بشر',
    color: '#7209B7',
    image: cenozoicImg,
    keyEvents: [
      '🦣 پستانداران بزرگ می‌شوند',
      '🌳 گسترش جنگل‌ها و چمنزارها',
      '🏔️ تشکیل رشته‌کوه‌های آلپ و هیمالیا',
      '❄️ عصرهای یخبندان',
      '🦴 ظهور نخستین‌های انسان‌نما',
      '🧍 ظهور انسان خردمند (Homo sapiens)',
      '🏛️ توسعه تمدن‌های بشری'
    ],
    lifeForms: [
      { icon: '🦣', name: 'ماموت‌ها' },
      { icon: '🦏', name: 'پستانداران بزرگ' },
      { icon: '🐴', name: 'اسب‌های اولیه' },
      { icon: '🐋', name: 'نهنگ‌ها' },
      { icon: '🦍', name: 'نخستی‌ها و انسان' }
    ]
  }
];

const EraScene = ({ era, index }: { era: Era; index: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.1;
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05;
    }
  });

  const texture = new THREE.TextureLoader().load(era.image);
  
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1000;
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  return (
    <group position={[index * 8, 0, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={texture} 
          emissive={new THREE.Color(era.color)}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <points ref={particlesRef}>
        <bufferGeometry attach="geometry" {...particlesGeometry} />
        <pointsMaterial 
          size={0.02} 
          color={era.color}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      <pointLight 
        position={[0, 0, 3]} 
        intensity={2} 
        color={era.color}
        distance={10}
      />
    </group>
  );
};

const CameraController = ({ targetIndex, isPlaying }: { targetIndex: number; isPlaying: boolean }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state) => {
    if (!cameraRef.current) return;

    const targetX = targetIndex * 8;
    const currentX = cameraRef.current.position.x;
    
    cameraRef.current.position.x = THREE.MathUtils.lerp(currentX, targetX, 0.05);
    cameraRef.current.lookAt(targetX, 0, 0);

    if (isPlaying) {
      cameraRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.5 + 3;
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 3, 8]}
      fov={60}
    />
  );
};

interface CinematicErasPanelProps {
  onClose: () => void;
}

const CinematicErasPanel = ({ onClose }: CinematicErasPanelProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % eras.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % eras.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + eras.length) % eras.length);
  };

  const currentEra = eras[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black animate-fade-in">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-6 right-6 z-50 text-white hover:bg-white/20"
      >
        <X className="w-6 h-6" />
      </Button>

      <div className="absolute inset-0">
        <Canvas>
          <CameraController targetIndex={currentIndex} isPlaying={isPlaying} />
          <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
          <ambientLight intensity={0.3} />
          
          {eras.map((era, index) => (
            <EraScene key={era.nameEn} era={era} index={index} />
          ))}
          
          <Environment preset="night" />
        </Canvas>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent max-h-[80vh] overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                style={{ backgroundColor: currentEra.color }}
              >
                {currentIndex + 1}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-1">{currentEra.name}</h2>
                <p className="text-base text-white/70">{currentEra.nameEn} • {currentEra.period}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <h3 className="text-white/70 text-sm font-semibold mb-2">🌡️ آب و هوا</h3>
                <p className="text-white text-sm">{currentEra.climate}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <h3 className="text-white/70 text-sm font-semibold mb-2">🔄 انتقال به دوره بعد</h3>
                <p className="text-white text-sm">{currentEra.transition}</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 mb-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-lg">📋</span>
                <span>رویدادهای کلیدی</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {currentEra.keyEvents.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-white/90 text-sm">
                    <span className="text-xs mt-0.5">•</span>
                    <span>{event}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-lg">🌍</span>
                <span>موجودات زنده</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentEra.lifeForms.map((lifeForm, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 text-white text-sm"
                  >
                    <span className="text-lg">{lifeForm.icon}</span>
                    <span>{lifeForm.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={handlePrev}
              variant="outline"
              size="icon"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              size="icon"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 w-12 h-12"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>

            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex justify-center gap-2">
            {eras.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicErasPanel;
