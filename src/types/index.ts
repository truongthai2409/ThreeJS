// Types cho toàn bộ dự án

export interface ModelRef {
  playAnimation: (animationName: string) => void;
  resetRotation: () => void;
  toggleAutoRotation: () => void;
  getMaterialManager: () => MaterialManager | null;
  testColorChange: () => void;
  openAllDoors: () => void;
  closeAllDoors: () => void;
}

export interface PartInfo {
  name: string;
  material: THREE.Material;
  mesh: THREE.Mesh;
  originalColor: string;
  currentColor: string;
}

export interface ColorPreset {
  [partName: string]: string;
}

export interface LoadingState {
  isLoading: boolean;
  progress: number;
  status: string;
}

export interface AnimationState {
  isAutoRotating: boolean;
  availableAnimations: string[];
  currentAnimation?: string;
}

export interface ColorState {
  availableParts: string[];
  currentColors: { [key: string]: string };
  selectedPart?: string;
}

// Import MaterialManager type
import { MaterialManager } from '../utils/MaterialManager';
import * as THREE from 'three';
