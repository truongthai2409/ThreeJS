import * as THREE from 'three';
import gsap from 'gsap';
import { ANIMATION_SETTINGS } from '../constants';

export class AnimationController {
  private rotationRef: React.MutableRefObject<{ x: number; y: number; z: number }>;
  private autoRotationRef: React.MutableRefObject<boolean>;
  private scrollTimeout?: number;

  constructor(
    rotationRef: React.MutableRefObject<{ x: number; y: number; z: number }>,
    autoRotationRef: React.MutableRefObject<boolean>
  ) {
    this.rotationRef = rotationRef;
    this.autoRotationRef = autoRotationRef;
  }

  // Setup scroll wheel handler
  setupScrollHandler(onAutoRotationChange: (isRotating: boolean) => void): () => void {
    const handleWheel = (event: WheelEvent) => {
      // Stop auto rotation when user scrolls
      this.autoRotationRef.current = false;
      onAutoRotationChange(false);
      
      // Smooth scroll rotation
      const targetY = this.rotationRef.current.y + event.deltaY * ANIMATION_SETTINGS.SCROLL_SENSITIVITY;
      
      gsap.to(this.rotationRef.current, {
        duration: ANIMATION_SETTINGS.GSAP_DURATION,
        y: targetY,
        ease: ANIMATION_SETTINGS.GSAP_EASE,
      });

      // Reset timeout to resume auto rotation
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = window.setTimeout(() => {
        this.autoRotationRef.current = true;
        onAutoRotationChange(true);
      }, ANIMATION_SETTINGS.SCROLL_RESUME_DELAY);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(this.scrollTimeout);
    };
  }

  // Update rotation in frame loop
  updateRotation(meshRef: React.RefObject<THREE.Group>, delta: number): void {
    if (!meshRef.current) return;

    if (this.autoRotationRef.current) {
      // Auto rotation
      meshRef.current.rotation.y += delta * ANIMATION_SETTINGS.AUTO_ROTATION_SPEED;
    } else {
      // Manual rotation from scroll
      meshRef.current.rotation.x = this.rotationRef.current.x;
      meshRef.current.rotation.y = this.rotationRef.current.y;
      meshRef.current.rotation.z = this.rotationRef.current.z;
    }
  }

  // Reset rotation to origin
  resetRotation(): void {
    gsap.to(this.rotationRef.current, {
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
      ease: ANIMATION_SETTINGS.GSAP_EASE,
    });
  }

  // Toggle auto rotation
  toggleAutoRotation(setIsAutoRotating: (value: boolean) => void): void {
    this.autoRotationRef.current = !this.autoRotationRef.current;
    setIsAutoRotating(this.autoRotationRef.current);
  }

  // Cleanup
  dispose(): void {
    clearTimeout(this.scrollTimeout);
  }
}

// Animation helper functions
export const playModelAnimation = (
  actions: { [key: string]: THREE.AnimationAction | null },
  animationName: string
): void => {
  const action = actions[animationName];
  if (action) {
    // Stop all other animations
    Object.values(actions).forEach(a => a?.stop());
    
    // Reset and configure the selected animation
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    
    // Play animation
    action.play();
  }
};

// Center model in scene
export const centerModel = (scene: THREE.Object3D): void => {
  try {
    console.log('📐 Calculating model bounds...');
    
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(scene);
    
    if (box.isEmpty()) {
      console.warn('⚠️ Model bounding box is empty, skipping centering');
      return;
    }
    
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    
    box.getCenter(center);
    box.getSize(size);
    
    console.log('📏 Model size:', size.x.toFixed(2), size.y.toFixed(2), size.z.toFixed(2));
    console.log('📍 Model center before:', center.x.toFixed(2), center.y.toFixed(2), center.z.toFixed(2));
    
    // Center the model by adjusting position
    scene.position.set(-center.x, -center.y, -center.z);
    
    console.log('✅ Model repositioned to:', scene.position.x.toFixed(2), scene.position.y.toFixed(2), scene.position.z.toFixed(2));
    
    // Optional: Adjust Y position to sit on ground
    const minY = box.min.y;
    scene.position.y = -minY; // Move model so its bottom sits at y=0
    
    console.log('🔧 Adjusted Y position for ground placement:', scene.position.y.toFixed(2));
    
  } catch (error) {
    console.error('❌ Error centering model:', error);
  }
};
