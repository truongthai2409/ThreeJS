import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useAnimations } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import gsap from "gsap";
import * as THREE from "three";
import ControlPanel from "./ControlPanel";
import ColorPicker from "./ColorPicker";
import LoadingScreen from "./ui/LoadingScreen";
import { MaterialManager } from "../utils/MaterialManager";
import type { ModelRef } from "../types";
import { useLoadingProgress } from "../hooks/useLoadingProgress";

const Model = forwardRef<ModelRef, {
  isAutoRotating: boolean;
  setIsAutoRotating: (value: boolean) => void;
  setAvailableAnimations: (animations: string[]) => void;
  onLoadingProgress: (progress: number, status: string) => void;
}>(({ isAutoRotating, setIsAutoRotating, setAvailableAnimations, onLoadingProgress }, ref) => {
  const { scene, animations } = useGLTF("/models/spaceship.glb");
  const meshRef = useRef<THREE.Group>(null);
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const autoRotationRef = useRef(true);
  const materialManagerRef = useRef<MaterialManager | null>(null);
  const { actions, names } = useAnimations(animations, meshRef);

  // Setup animations khi component mount
  useEffect(() => {
    if (names.length > 0) {
      onLoadingProgress(60, 'Đang xử lý animations...');
      setAvailableAnimations(names);
    }
  }, [names, setAvailableAnimations, onLoadingProgress]);

  // Handle animation play
  useEffect(() => {
    // Sync auto rotation state
    autoRotationRef.current = isAutoRotating;
  }, [isAutoRotating]);

  // Auto rotation khi mới load trang
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (meshRef.current && autoRotationRef.current) {
      meshRef.current.rotation.y += delta * 0.5; // Tốc độ quay tự động
    }
  });

  // Animation play
  const playAnimation = (animationName: string) => {
    const action = actions[animationName];
    if (action) {
      Object.values(actions).forEach(a => a?.stop());
      action.reset();
      action.setLoop(THREE.LoopOnce, 1); // Setup animation để chỉ chạy 1 lần
      action.clampWhenFinished = true;

      // Play selected animation
      action.play();
    }
  };

  // Reset rotation function
  const resetRotation = () => {
    gsap.to(rotationRef.current, {
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
      ease: "power2.out",
    });
  };

  // Toggle auto rotation
  const toggleAutoRotation = () => {
    setIsAutoRotating(!isAutoRotating);
  };

  // Initialize MaterialManager
  useEffect(() => {
    if (scene && !materialManagerRef.current) {
      onLoadingProgress(80, 'Đang quét materials...');
      materialManagerRef.current = new MaterialManager(scene);
      onLoadingProgress(90, 'Hoàn tất khởi tạo...');
    }
  }, [scene, onLoadingProgress]);

  // Get material manager
  const getMaterialManager = () => materialManagerRef.current;

  // Test function
  const testColorChange = () => {
    console.log('🧪 Model: Testing color change...');
    if (materialManagerRef.current) {
      materialManagerRef.current.testChangeAllToRed();
    }
  };

  // Expose functions to parent component via ref
  useImperativeHandle(ref, () => ({
    playAnimation,
    resetRotation,
    toggleAutoRotation,
    getMaterialManager,
    testColorChange
  }), []);

  //center model
  useEffect(() => {
    if (scene && meshRef.current) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = new THREE.Vector3();
      box.getCenter(center);
      scene.position.sub(center);
    }
  }, [scene]);

  useEffect(() => {
    let scrollTimeout: number;

    const handleWheel = (event: WheelEvent) => {
      // Dừng auto rotation khi user scroll
      autoRotationRef.current = false;

      // Smooth scroll rotation
      const targetY = rotationRef.current.y + event.deltaY * 0.005;

      gsap.to(rotationRef.current, {
        duration: 0.8,
        y: targetY,
        ease: "power2.out",
      });

      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        autoRotationRef.current = true;
      }, 2000);
    };
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, []);
  return (
    <group ref={meshRef}>
      <primitive
        object={scene}
        scale={1}
      />
    </group>
  );
});

export default function Scene() {
  const { lightIntensity } = useControls({
    lightIntensity: { value: 3, min: 0, max: 10, step: 0.1 },
  });

  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([]);
  const [availableParts, setAvailableParts] = useState<string[]>([]);
  const [currentColors, setCurrentColors] = useState<{ [key: string]: string }>({});
  const modelRef = useRef<ModelRef>(null);
  
  // Loading progress
  const { loadingState, updateProgress, finishLoading } = useLoadingProgress();

  const handleAnimationPlay = (animationName: string) => {
    modelRef.current?.playAnimation(animationName);
  };

  const handleResetRotation = () => {
    modelRef.current?.resetRotation();
  };

  const handleToggleAutoRotation = () => {
    modelRef.current?.toggleAutoRotation();
  };

  // Test function
  const handleTestColorChange = () => {
    console.log('🧪 Scene: Running color change test...');
    modelRef.current?.testColorChange();
  };

  // Color management functions
  const handleColorChange = (partName: string, color: string) => {
    console.log(`🎨 Scene: Attempting to change ${partName} to ${color}`);
    const materialManager = modelRef.current?.getMaterialManager();
    
    if (!materialManager) {
      console.error('❌ MaterialManager not found');
      return;
    }

    console.log('✅ MaterialManager found, calling changePartColor...');
    const success = materialManager.changePartColor(partName, color);
    
    if (success) {
      console.log('✅ Color change successful, updating state...');
      setCurrentColors(prev => ({
        ...prev,
        [partName]: color
      }));
    } else {
      console.error('❌ Color change failed');
    }
  };

  // Loading progress handler
  const handleLoadingProgress = (progress: number, status: string) => {
    updateProgress(progress, status);
  };

  // Initialize color system when model loads
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🔧 Initializing color system...');
      updateProgress(95, 'Khởi tạo hệ thống màu sắc...');
      
      const materialManager = modelRef.current?.getMaterialManager();
      
      if (materialManager) {
        console.log('✅ MaterialManager found, getting parts and colors...');
        const parts = materialManager.getAvailableParts();
        const colors = materialManager.getCurrentColors();
        
        console.log('📦 Available parts:', parts);
        console.log('🎨 Current colors:', colors);
        
        setAvailableParts(parts);
        setCurrentColors(colors);
        
        // Debug call
        materialManager.debugParts();
        
        // Finish loading
        setTimeout(() => {
          finishLoading();
        }, 500);
      } else {
        console.error('❌ MaterialManager not found during initialization');
      }
    }, 2000); // Increase delay để đảm bảo model đã load hoàn toàn

    return () => clearTimeout(timer);
  }, [availableAnimations, updateProgress, finishLoading]); // Trigger khi animations load xong

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen loadingState={loadingState} />
      
      {/* Main Scene */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <ControlPanel
          onAnimationPlay={handleAnimationPlay}
          onResetRotation={handleResetRotation}
          onToggleAutoRotation={handleToggleAutoRotation}
          isAutoRotating={isAutoRotating}
          availableAnimations={availableAnimations}
        />

        <ColorPicker
          onColorChange={handleColorChange}
          availableParts={availableParts}
          currentColors={currentColors}
          onTestColorChange={handleTestColorChange}
        />

        <Canvas camera={{ position: [0, 1, 4] }}>
        {/* Ánh sáng */}
        <ambientLight intensity={lightIntensity} />
        <directionalLight position={[5, 5, 5]} />

          {/* Model với animation controls */}
          <Model
            ref={modelRef}
            isAutoRotating={isAutoRotating}
            setIsAutoRotating={setIsAutoRotating}
            setAvailableAnimations={setAvailableAnimations}
            onLoadingProgress={handleLoadingProgress}
          />
          <axesHelper args={[5]} />

          {/* Điều khiển xoay/pan/zoom */}
          <OrbitControls
            enableZoom={false}
          />

        </Canvas>
      </div>
    </>
  );
}
