import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from './ui/button';
import { SkipForward } from 'lucide-react';

interface BigBangAnimationProps {
  onComplete: () => void;
  onSkip: () => void;
}

const BigBangAnimation = ({ onComplete, onSkip }: BigBangAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [phase, setPhase] = useState(1);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 0, 100);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Phase 1: Big Bang explosion
    const explosionParticles: THREE.Points[] = [];
    const createExplosion = () => {
      for (let i = 0; i < 5; i++) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        
        for (let j = 0; j < 1000; j++) {
          vertices.push(0, 0, 0);
          const color = new THREE.Color();
          color.setHSL(Math.random() * 0.2 + 0.1, 1, 0.5 + Math.random() * 0.5);
          colors.push(color.r, color.g, color.b);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
          size: 2,
          vertexColors: true,
          transparent: true,
          opacity: 1,
          blending: THREE.AdditiveBlending,
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData.velocities = [];
        
        for (let j = 0; j < 1000; j++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const speed = 0.5 + Math.random() * 1.5;
          
          particles.userData.velocities.push({
            x: Math.sin(phi) * Math.cos(theta) * speed,
            y: Math.sin(phi) * Math.sin(theta) * speed,
            z: Math.cos(phi) * speed,
          });
        }
        
        scene.add(particles);
        explosionParticles.push(particles);
      }
    };

    // Phase 2: Star formation
    const stars: THREE.Mesh[] = [];
    const createStars = () => {
      for (let i = 0; i < 200; i++) {
        const geometry = new THREE.SphereGeometry(0.3, 8, 8);
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.5, 0.8),
          transparent: true,
          opacity: 0,
        });
        
        const star = new THREE.Mesh(geometry, material);
        const radius = 50 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        star.position.set(
          Math.sin(phi) * Math.cos(theta) * radius,
          Math.sin(phi) * Math.sin(theta) * radius,
          Math.cos(phi) * radius
        );
        
        star.userData.targetOpacity = 0.5 + Math.random() * 0.5;
        scene.add(star);
        stars.push(star);
      }
    };

    // Phase 3: Galaxy formation
    const galaxies: THREE.Points[] = [];
    const createGalaxies = () => {
      for (let g = 0; g < 3; g++) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        
        for (let i = 0; i < 2000; i++) {
          const angle = (i / 2000) * Math.PI * 4;
          const radius = (i / 2000) * 40;
          const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 5;
          const y = (Math.random() - 0.5) * 2;
          const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 5;
          
          vertices.push(x, y, z);
          
          const color = new THREE.Color();
          color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6);
          colors.push(color.r, color.g, color.b);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
          size: 0.8,
          vertexColors: true,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        });
        
        const galaxy = new THREE.Points(geometry, material);
        const offsetX = (g - 1) * 100;
        galaxy.position.set(offsetX, 0, 0);
        galaxy.rotation.x = Math.PI / 4;
        
        scene.add(galaxy);
        galaxies.push(galaxy);
      }
    };

    createExplosion();
    createStars();
    createGalaxies();

    // Central light for Big Bang
    const centralLight = new THREE.PointLight(0xffffff, 0, 200);
    centralLight.position.set(0, 0, 0);
    scene.add(centralLight);

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      
      // Phase 1: Big Bang (0-4 seconds)
      if (elapsed < 4) {
        setPhase(1);
        centralLight.intensity = Math.max(0, 20 - elapsed * 5);
        
        explosionParticles.forEach((particles) => {
          const positions = particles.geometry.attributes.position.array as Float32Array;
          const material = particles.material as THREE.PointsMaterial;
          
          for (let i = 0; i < positions.length / 3; i++) {
            const velocity = particles.userData.velocities[i];
            positions[i * 3] += velocity.x;
            positions[i * 3 + 1] += velocity.y;
            positions[i * 3 + 2] += velocity.z;
          }
          
          particles.geometry.attributes.position.needsUpdate = true;
          material.opacity = Math.max(0, 1 - elapsed / 4);
        });
      }
      
      // Phase 2: Star formation (4-8 seconds)
      else if (elapsed < 8) {
        setPhase(2);
        const progress = (elapsed - 4) / 4;
        
        stars.forEach((star) => {
          const material = star.material as THREE.MeshBasicMaterial;
          material.opacity = Math.min(material.opacity + 0.02, star.userData.targetOpacity);
          
          star.rotation.y += 0.02;
          const scale = 1 + Math.sin(elapsed * 2 + star.position.x) * 0.2;
          star.scale.set(scale, scale, scale);
        });
        
        camera.position.z = 100 - progress * 20;
      }
      
      // Phase 3: Galaxy formation (8-12 seconds)
      else if (elapsed < 12) {
        setPhase(3);
        const progress = (elapsed - 8) / 4;
        
        galaxies.forEach((galaxy, index) => {
          const material = galaxy.material as THREE.PointsMaterial;
          material.opacity = Math.min(material.opacity + 0.01, 0.8);
          galaxy.rotation.y += 0.005 * (index + 1);
        });
        
        // Fade out stars
        stars.forEach((star) => {
          const material = star.material as THREE.MeshBasicMaterial;
          material.opacity = Math.max(0, material.opacity - 0.01);
        });
        
        camera.position.x = progress * 50;
      }
      
      // Phase 4: Zoom to Solar System (12-15 seconds)
      else if (elapsed < 15) {
        setPhase(4);
        const progress = (elapsed - 12) / 3;
        
        camera.position.z = 80 - progress * 30;
        camera.position.x = 50 + progress * 50;
        
        galaxies.forEach((galaxy) => {
          const material = galaxy.material as THREE.PointsMaterial;
          material.opacity = Math.max(0, material.opacity - 0.02);
        });
      }
      
      // Complete
      else {
        onComplete();
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement.parentElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onComplete]);

  const getPhaseText = () => {
    switch (phase) {
      case 1: return 'مهبانگ بزرگ';
      case 2: return 'تشکیل ستاره‌ها';
      case 3: return 'تشکیل کهکشان‌ها';
      case 4: return 'منظومه شمسی';
      default: return '';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Skip button */}
      <Button
        onClick={onSkip}
        className="absolute top-6 right-6 z-50 glass-panel"
        variant="outline"
        size="lg"
      >
        <SkipForward className="w-5 h-5 mr-2" />
        رد کردن
      </Button>

      {/* Phase indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="glass-panel px-8 py-4 rounded-full">
          <p className="text-lg font-semibold">{getPhaseText()}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-64 z-50">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(phase / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BigBangAnimation;
