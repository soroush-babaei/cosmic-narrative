import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CosmicCanvasProps {
  onPlanetClick: (planetId: string) => void;
  animationPhase: number;
  isPlaying: boolean;
  speed: number;
}

const CosmicCanvas = ({ onPlanetClick, animationPhase, isPlaying, speed }: CosmicCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetsRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  // Keep refs in sync with props
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

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
    camera.position.set(0, 50, 150);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffd27f, 3, 1000);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Star field
    const createStarField = () => {
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true,
        opacity: 0.8,
      });

      const starVertices = [];
      for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
      }

      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
    };

    createStarField();

    // Sun
    const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd27f,
      emissive: 0xffd27f,
      emissiveIntensity: 1,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Add sun glow
    const glowGeometry = new THREE.SphereGeometry(12, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd27f,
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Planet data with visual scaling and enhanced materials
    const planetData = [
      { id: 'mercury', color: 0x8c7853, size: 1.5, distance: 25, speed: 0.04, emissive: 0x3a2a1a, metalness: 0.7 },
      { id: 'venus', color: 0xffc649, size: 2.2, distance: 35, speed: 0.03, emissive: 0x6a4a20, metalness: 0.3 },
      { id: 'earth', color: 0x4a90e2, size: 2.3, distance: 45, speed: 0.025, emissive: 0x1a3a5a, metalness: 0.4 },
      { id: 'mars', color: 0xe27b58, size: 1.8, distance: 55, speed: 0.02, emissive: 0x5a2a1a, metalness: 0.6 },
      { id: 'jupiter', color: 0xc88b3a, size: 5, distance: 75, speed: 0.01, emissive: 0x4a3a1a, metalness: 0.2 },
      { id: 'saturn', color: 0xfad5a5, size: 4.5, distance: 95, speed: 0.008, emissive: 0x6a5a3a, metalness: 0.3, hasRings: true },
      { id: 'uranus', color: 0x4fd0e7, size: 3, distance: 115, speed: 0.006, emissive: 0x2a5a6a, metalness: 0.5 },
      { id: 'neptune', color: 0x4b70dd, size: 3, distance: 135, speed: 0.005, emissive: 0x1a3a6a, metalness: 0.5 },
    ];

    // Create planets with enhanced visuals
    planetData.forEach((data) => {
      const planetGeometry = new THREE.SphereGeometry(data.size, 64, 64);
      const planetMaterial = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.emissive,
        emissiveIntensity: 0.4,
        metalness: data.metalness,
        roughness: 0.7,
      });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.userData = { 
        id: data.id, 
        distance: data.distance, 
        speed: data.speed, 
        angle: Math.random() * Math.PI * 2,
        isClickable: true 
      };
      planet.position.x = Math.cos(planet.userData.angle) * data.distance;
      planet.position.z = Math.sin(planet.userData.angle) * data.distance;
      
      // Add planet glow
      const glowGeometry = new THREE.SphereGeometry(data.size * 1.15, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
      });
      const planetGlow = new THREE.Mesh(glowGeometry, glowMaterial);
      planet.add(planetGlow);
      
      // Add Saturn's rings
      if (data.hasRings) {
        const ringGeometry = new THREE.RingGeometry(data.size * 1.5, data.size * 2.5, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xfad5a5,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        planet.add(rings);
      }
      
      scene.add(planet);
      planetsRef.current.set(data.id, planet);

      // Add orbit line
      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        orbitPoints.push(
          Math.cos(angle) * data.distance,
          0,
          Math.sin(angle) * data.distance
        );
      }
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.3,
      });
      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbit);
    });

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const planets = Array.from(planetsRef.current.values());
      const intersects = raycaster.intersectObjects(planets);

      if (intersects.length > 0) {
        const planet = intersects[0].object as THREE.Mesh;
        setHoveredPlanet(planet.userData.id);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredPlanet(null);
        renderer.domElement.style.cursor = 'default';
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const planets = Array.from(planetsRef.current.values());
      const intersects = raycaster.intersectObjects(planets);

      if (intersects.length > 0) {
        const planet = intersects[0].object as THREE.Mesh;
        onPlanetClick(planet.userData.id);
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (isPlayingRef.current) {
        planetsRef.current.forEach((planet) => {
          planet.userData.angle += planet.userData.speed * speedRef.current;
          planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
          planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
          planet.rotation.y += 0.01 * speedRef.current;
        });
      }

      // Highlight hovered planet
      planetsRef.current.forEach((planet, id) => {
        const material = planet.material as THREE.MeshStandardMaterial;
        if (id === hoveredPlanet) {
          material.emissiveIntensity = 0.8;
          planet.scale.set(1.15, 1.15, 1.15);
        } else {
          material.emissiveIntensity = 0.4;
          planet.scale.set(1, 1, 1);
        }
      });

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
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      if (containerRef.current && renderer.domElement.parentElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onPlanetClick, hoveredPlanet]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {hoveredPlanet && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-full">
          <p className="text-sm font-medium capitalize">{hoveredPlanet}</p>
        </div>
      )}
    </div>
  );
};

export default CosmicCanvas;
