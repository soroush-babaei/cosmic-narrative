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

interface Era {
  name: string;
  nameEn: string;
  period: string;
  duration: string;
  characteristics: string;
  color: string;
  image: string;
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

      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                style={{ backgroundColor: currentEra.color }}
              >
                {currentIndex + 1}
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white mb-1">{currentEra.name}</h2>
                <p className="text-lg text-white/80">{currentEra.nameEn}</p>
              </div>
              <div className="mr-auto text-right">
                <p className="text-xl font-semibold text-white">{currentEra.duration}</p>
              </div>
            </div>

            <div className="space-y-3 text-white">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white/70">دوره:</span>
                <span className="text-base">{currentEra.period}</span>
              </div>
              <p className="text-lg leading-relaxed text-white/90">
                {currentEra.characteristics}
              </p>
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
