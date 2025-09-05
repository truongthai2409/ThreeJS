import * as THREE from 'three';
import gsap from 'gsap';
import { ANIMATION_SETTINGS } from '../constants';

export class AnimationController {
  private rotationRef: React.MutableRefObject<{ x: number; y: number; z: number }>;
  private autoRotationRef: React.MutableRefObject<boolean>;
  private scrollTimeout?: number;
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private hoveredObject: THREE.Object3D | null = null;
  private hoverCleanup?: () => void;

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
    if (this.hoverCleanup) {
      this.hoverCleanup();
      this.hoverCleanup = undefined;
    }
  }

  // Handle hover
  setupHoverHandler(
    meshRef: React.RefObject<THREE.Group | null>,
    camera: THREE.Camera,
    domElement: HTMLElement,
    onAutoRotationChange: (isRotating: boolean) => void,
    options?: {
      filter?: (object: THREE.Object3D) => boolean;
    }
  ): () => void {
    const filter = options?.filter;
    let wasAutoRotating = this.autoRotationRef.current;

    const handlePointerMove = (event: MouseEvent) => {
      const rect = domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, camera);
      const root = meshRef.current;
      if (!root) {
        // Resume auto rotation if we were hovering
        if (this.hoveredObject && wasAutoRotating) {
          this.autoRotationRef.current = true;
          onAutoRotationChange(true);
        }
        this.hoveredObject = null;
        domElement.style.cursor = 'default';
        return;
      }

      const intersects = this.raycaster.intersectObject(root, true);
      const first = intersects.find(i => (filter ? filter(i.object) : true));

      if (!first) {
        // Not hovering over model - resume auto rotation if we were hovering before
        if (this.hoveredObject && wasAutoRotating) {
          this.autoRotationRef.current = true;
          onAutoRotationChange(true);
        }
        this.hoveredObject = null;
        domElement.style.cursor = 'default';
        return;
      }

      const newObject = first.object;
      if (this.hoveredObject === newObject) {
        // Still hovering same object - no change
        return;
      }

      // Started hovering over model
      if (!this.hoveredObject) {
        wasAutoRotating = this.autoRotationRef.current;
        if (wasAutoRotating) {
          this.autoRotationRef.current = false;
          onAutoRotationChange(false);
        }
      }

      this.hoveredObject = newObject;
      domElement.style.cursor = 'pointer';
    };

    const handlePointerLeave = () => {
      // Resume auto rotation when leaving canvas area
      if (this.hoveredObject && wasAutoRotating) {
        this.autoRotationRef.current = true;
        onAutoRotationChange(true);
      }
      this.hoveredObject = null;
      domElement.style.cursor = 'default';
    };

    domElement.addEventListener('mousemove', handlePointerMove, { passive: true });
    domElement.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    const cleanup = () => {
      domElement.removeEventListener('mousemove', handlePointerMove as any);
      domElement.removeEventListener('mouseleave', handlePointerLeave as any);
      // Resume auto rotation on cleanup if we were hovering
      if (this.hoveredObject && wasAutoRotating) {
        this.autoRotationRef.current = true;
        onAutoRotationChange(true);
      }
      this.hoveredObject = null;
    };

    // Track cleanup to run from dispose as well
    this.hoverCleanup = cleanup;
    return cleanup;
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
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(scene);
    if (box.isEmpty()) {
      return;
    }
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    
    box.getCenter(center);
    box.getSize(size);

    // Center the model by adjusting position
    scene.position.set(-center.x, -center.y, -center.z);
    
    // Optional: Adjust Y position to sit on ground
    const minY = box.min.y;
    scene.position.y = -minY; // Move model so its bottom sits at y=0
    
  } catch (error) {
    console.error('❌ Error centering model:', error);
  }
};
