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

    // Phase 1: Big Bang explosion with shock waves
    const explosionParticles: THREE.Points[] = [];
    const shockWaves: THREE.Mesh[] = [];
    
    const createExplosion = () => {
      // Create multiple layers of explosion particles
      for (let i = 0; i < 10; i++) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const sizes = [];
        
        for (let j = 0; j < 2000; j++) {
          vertices.push(0, 0, 0);
          
          // Realistic Big Bang colors: white hot core, orange-red exterior
          const temp = Math.random();
          const color = new THREE.Color();
          if (temp > 0.7) {
            // White hot core
            color.setRGB(1, 1, 1);
          } else if (temp > 0.4) {
            // Orange-yellow
            color.setHSL(0.08 + Math.random() * 0.05, 1, 0.6 + Math.random() * 0.3);
          } else {
            // Red-orange
            color.setHSL(0.02 + Math.random() * 0.03, 1, 0.5 + Math.random() * 0.2);
          }
          colors.push(color.r, color.g, color.b);
          sizes.push(1 + Math.random() * 3);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
          size: 3,
          vertexColors: true,
          transparent: true,
          opacity: 1,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData.velocities = [];
        particles.userData.layer = i;
        
        for (let j = 0; j < 2000; j++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const speed = (1 + Math.random() * 2) * (1 + i * 0.2);
          
          particles.userData.velocities.push({
            x: Math.sin(phi) * Math.cos(theta) * speed,
            y: Math.sin(phi) * Math.sin(theta) * speed,
            z: Math.cos(phi) * speed,
          });
        }
        
        scene.add(particles);
        explosionParticles.push(particles);
      }
      
      // Create shock wave rings
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.RingGeometry(0.1, 0.5, 64);
        const material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.userData.startTime = i * 0.3;
        scene.add(ring);
        shockWaves.push(ring);
      }
    };

    // Phase 2: Star formation with realistic colors and glow
    const stars: THREE.Mesh[] = [];
    const starGlows: THREE.Mesh[] = [];
    
    const createStars = () => {
      for (let i = 0; i < 300; i++) {
        // Star size variation
        const size = 0.2 + Math.random() * 0.6;
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        
        // Realistic star colors based on temperature
        const temp = Math.random();
        let starColor;
        if (temp > 0.85) {
          // Blue-white (hot)
          starColor = new THREE.Color().setHSL(0.6, 0.3, 0.9);
        } else if (temp > 0.6) {
          // White
          starColor = new THREE.Color().setHSL(0.1, 0.1, 0.95);
        } else if (temp > 0.3) {
          // Yellow-white
          starColor = new THREE.Color().setHSL(0.12, 0.5, 0.85);
        } else {
          // Orange-red (cool)
          starColor = new THREE.Color().setHSL(0.05, 0.8, 0.7);
        }
        
        const material = new THREE.MeshBasicMaterial({
          color: starColor,
          transparent: true,
          opacity: 0,
        });
        
        const star = new THREE.Mesh(geometry, material);
        const radius = 50 + Math.random() * 150;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        star.position.set(
          Math.sin(phi) * Math.cos(theta) * radius,
          Math.sin(phi) * Math.sin(theta) * radius,
          Math.cos(phi) * radius
        );
        
        star.userData.targetOpacity = 0.7 + Math.random() * 0.3;
        star.userData.twinkleSpeed = 0.5 + Math.random() * 1.5;
        scene.add(star);
        stars.push(star);
        
        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(size * 2, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: starColor,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(star.position);
        scene.add(glow);
        starGlows.push(glow);
      }
    };

    // Phase 3: Realistic spiral galaxy formation
    const galaxies: THREE.Points[] = [];
    const galaxyCores: THREE.Mesh[] = [];
    
    const createGalaxies = () => {
      for (let g = 0; g < 3; g++) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const sizes = [];
        
        // Create spiral arms
        const numArms = 4;
        const particlesPerArm = 1500;
        
        for (let arm = 0; arm < numArms; arm++) {
          for (let i = 0; i < particlesPerArm; i++) {
            const t = i / particlesPerArm;
            const angle = (Math.PI * 6 * t) + (arm * (Math.PI * 2 / numArms));
            const radius = t * 50;
            
            // Spiral shape with some randomness
            const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 8 * (1 - t);
            const y = (Math.random() - 0.5) * 3 * (1 - t * 0.8);
            const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 8 * (1 - t);
            
            vertices.push(x, y, z);
            
            // Galaxy colors: blue-white in arms, yellow-orange in core
            const color = new THREE.Color();
            if (t < 0.2) {
              // Core - yellow/orange
              color.setHSL(0.08 + Math.random() * 0.08, 0.9, 0.7);
            } else if (t < 0.5) {
              // Inner arms - white/blue-white
              color.setHSL(0.55 + Math.random() * 0.1, 0.3, 0.8);
            } else {
              // Outer arms - blue
              color.setHSL(0.6 + Math.random() * 0.05, 0.7, 0.6);
            }
            colors.push(color.r, color.g, color.b);
            sizes.push(0.5 + Math.random() * 1.5 * (1 - t * 0.5));
          }
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
          size: 1.2,
          vertexColors: true,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        });
        
        const galaxy = new THREE.Points(geometry, material);
        const offsetX = (g - 1) * 120;
        galaxy.position.set(offsetX, 0, -50);
        galaxy.rotation.x = Math.PI / 3.5;
        galaxy.userData.rotationSpeed = 0.003 + Math.random() * 0.002;
        
        scene.add(galaxy);
        galaxies.push(galaxy);
        
        // Add bright galactic core
        const coreGeometry = new THREE.SphereGeometry(2, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffaa,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.set(offsetX, 0, -50);
        scene.add(core);
        galaxyCores.push(core);
      }
    };

    createExplosion();
    createStars();
    createGalaxies();

    // Central light for Big Bang
    const centralLight = new THREE.PointLight(0xffffff, 0, 300);
    centralLight.position.set(0, 0, 0);
    scene.add(centralLight);
    
    // Add ambient glow sphere for Big Bang
    const glowGeometry = new THREE.SphereGeometry(5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    glowSphere.position.set(0, 0, 0);
    scene.add(glowSphere);

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      
      // Phase 1: Big Bang (0-4 seconds)
      if (elapsed < 4) {
        setPhase(1);
        const progress = elapsed / 4;
        
        // Intense flash at start
        centralLight.intensity = Math.max(0, 50 * Math.exp(-elapsed * 1.5));
        glowSphere.scale.setScalar(1 + progress * 20);
        (glowSphere.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - progress);
        
        explosionParticles.forEach((particles) => {
          const positions = particles.geometry.attributes.position.array as Float32Array;
          const material = particles.material as THREE.PointsMaterial;
          const layer = particles.userData.layer;
          
          for (let i = 0; i < positions.length / 3; i++) {
            const velocity = particles.userData.velocities[i];
            // Accelerating expansion
            const accel = 1 + progress * 0.5;
            positions[i * 3] += velocity.x * accel;
            positions[i * 3 + 1] += velocity.y * accel;
            positions[i * 3 + 2] += velocity.z * accel;
          }
          
          particles.geometry.attributes.position.needsUpdate = true;
          // Layered fade for depth
          material.opacity = Math.max(0, (1 - progress) * (1 - layer * 0.05));
        });
        
        // Animate shock waves
        shockWaves.forEach((wave, index) => {
          const waveTime = elapsed - wave.userData.startTime;
          if (waveTime > 0) {
            wave.scale.setScalar(1 + waveTime * 15);
            (wave.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - waveTime * 0.5);
          }
        });
        
        camera.rotation.z = Math.sin(elapsed * 2) * 0.02;
      }
      
      // Phase 2: Star formation (4-8 seconds)
      else if (elapsed < 8) {
        setPhase(2);
        const progress = (elapsed - 4) / 4;
        
        stars.forEach((star, index) => {
          const material = star.material as THREE.MeshBasicMaterial;
          const glowMaterial = starGlows[index].material as THREE.MeshBasicMaterial;
          
          // Gradual appearance
          material.opacity = Math.min(material.opacity + 0.015, star.userData.targetOpacity);
          glowMaterial.opacity = Math.min(glowMaterial.opacity + 0.01, star.userData.targetOpacity * 0.3);
          
          // Twinkling effect
          const twinkle = Math.sin(elapsed * star.userData.twinkleSpeed + index) * 0.15;
          const scale = 1 + twinkle;
          star.scale.set(scale, scale, scale);
          starGlows[index].scale.set(scale * 1.5, scale * 1.5, scale * 1.5);
        });
        
        // Smooth camera movement
        camera.position.z = 100 - progress * 20;
        camera.position.y = progress * 10;
      }
      
      // Phase 3: Galaxy formation (8-12 seconds)
      else if (elapsed < 12) {
        setPhase(3);
        const progress = (elapsed - 8) / 4;
        
        galaxies.forEach((galaxy, index) => {
          const material = galaxy.material as THREE.PointsMaterial;
          material.opacity = Math.min(material.opacity + 0.012, 0.9);
          
          // Realistic galaxy rotation
          galaxy.rotation.y += galaxy.userData.rotationSpeed;
          galaxy.rotation.z = Math.sin(progress * Math.PI) * 0.1;
          
          // Core glow
          const coreMaterial = galaxyCores[index].material as THREE.MeshBasicMaterial;
          coreMaterial.opacity = Math.min(coreMaterial.opacity + 0.015, 0.8);
          galaxyCores[index].rotation.y += galaxy.userData.rotationSpeed * 2;
        });
        
        // Fade out stars and their glows
        stars.forEach((star, index) => {
          const material = star.material as THREE.MeshBasicMaterial;
          const glowMaterial = starGlows[index].material as THREE.MeshBasicMaterial;
          material.opacity = Math.max(0, material.opacity - 0.015);
          glowMaterial.opacity = Math.max(0, glowMaterial.opacity - 0.01);
        });
        
        // Cinematic camera movement
        camera.position.x = Math.sin(progress * Math.PI * 0.5) * 60;
        camera.position.y = 10 + progress * 20;
        camera.lookAt(0, 0, -50);
      }
      
      // Phase 4: Zoom to Solar System (12-15 seconds)
      else if (elapsed < 15) {
        setPhase(4);
        const progress = (elapsed - 12) / 3;
        const easeProgress = progress * progress * (3 - 2 * progress); // Smooth easing
        
        // Dramatic zoom and pan
        camera.position.z = 80 - easeProgress * 40;
        camera.position.x = 60 - easeProgress * 60;
        camera.position.y = 30 - easeProgress * 30;
        camera.lookAt(0, 0, 0);
        
        // Fade out galaxies
        galaxies.forEach((galaxy, index) => {
          const material = galaxy.material as THREE.PointsMaterial;
          material.opacity = Math.max(0, material.opacity - 0.025);
          
          const coreMaterial = galaxyCores[index].material as THREE.MeshBasicMaterial;
          coreMaterial.opacity = Math.max(0, coreMaterial.opacity - 0.03);
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
