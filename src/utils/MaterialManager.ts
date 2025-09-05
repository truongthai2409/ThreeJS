import * as THREE from 'three';

interface PartInfo {
  name: string;
  material: THREE.Material;
  mesh: THREE.Mesh;
  allMeshes: THREE.Mesh[]; // All meshes in this part group
  originalColor: string;
  currentColor: string;
}

export class MaterialManager { //class convert các mesh từ mô hình
  private parts: Map<string, PartInfo> = new Map();
  private scene: THREE.Object3D;

  constructor(scene: THREE.Object3D) {
    this.scene = scene;
    this.scanMaterials();
  }

  // Quét tất cả materials trong scene
  private scanMaterials(): void {
    console.log('🔍 Scanning materials in scene...');
    
    // Group meshes by part type
    const partGroups = new Map<string, THREE.Mesh[]>();
    
    this.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        console.log(`Found mesh: ${mesh.name || 'unnamed'}`);
        
        if (mesh.material) {
          // Categorize mesh by name patterns
          const partCategory = this.categorizeMeshByName(mesh.name || '');
          
          if (!partGroups.has(partCategory)) {
            partGroups.set(partCategory, []);
          }
          partGroups.get(partCategory)!.push(mesh);
        }
      }
    });

    // Process grouped parts
    partGroups.forEach((meshes, partName) => {
      console.log(`📦 Processing part group: ${partName} (${meshes.length} meshes)`);
      
      // Use the first mesh as representative, but store all meshes
      const representativeMesh = meshes[0];
      const material = Array.isArray(representativeMesh.material) 
        ? representativeMesh.material[0] 
        : representativeMesh.material;
        
      this.processMaterial(material, partName, representativeMesh, meshes);
    });
  }

  // Categorize mesh by name patterns
  private categorizeMeshByName(meshName: string): string {
    const name = meshName.toLowerCase();
    
    // Car body parts
    if (name.includes('body') || name.includes('chassis') || name.includes('frame')) {
      return 'Body';
    }
    if (name.includes('hood') || name.includes('bonnet')) {
      return 'Hood';
    }
    if (name.includes('door')) {
      if (name.includes('front')) return 'Front_Doors';
      if (name.includes('rear') || name.includes('back')) return 'Rear_Doors';
      return 'Doors';
    }
    if (name.includes('wheel') || name.includes('tire') || name.includes('rim')) {
      return 'Wheels';
    }
    if (name.includes('bumper')) {
      if (name.includes('front')) return 'Front_Bumper';
      if (name.includes('rear') || name.includes('back')) return 'Rear_Bumper';
      return 'Bumper';
    }
    if (name.includes('roof') || name.includes('top')) {
      return 'Roof';
    }
    if (name.includes('window') || name.includes('glass') || name.includes('windshield')) {
      return 'Windows';
    }
    if (name.includes('mirror')) {
      return 'Mirrors';
    }
    if (name.includes('light') || name.includes('lamp') || name.includes('headlight')) {
      return 'Lights';
    }
    if (name.includes('grill') || name.includes('grille')) {
      return 'Grille';
    }
    if (name.includes('interior') || name.includes('seat') || name.includes('dashboard')) {
      return 'Interior';
    }
    return meshName || 'Unknown_Part';
  }

  private processMaterial(material: THREE.Material, partName: string, mesh: THREE.Mesh, allMeshes?: THREE.Mesh[]): void {
    // Only process materials that have color property
    if (material instanceof THREE.MeshStandardMaterial || 
        material instanceof THREE.MeshBasicMaterial ||
        material instanceof THREE.MeshLambertMaterial ||
        material instanceof THREE.MeshPhongMaterial) {
      
      console.log(`📦 Processing material: ${partName}`);
      
      // Store reference to original material and mesh
      const originalColor = material.color.getHexString();
      
      this.parts.set(partName, {
        name: partName,
        material: material, // Keep reference to original material
        mesh: mesh,
        allMeshes: allMeshes || [mesh], // Store all meshes in this group
        originalColor: `#${originalColor}`,
        currentColor: `#${originalColor}`
      });
    }
  }

  // Lấy danh sách tất cả parts
  getAvailableParts(): string[] {
    const parts = Array.from(this.parts.keys()).filter(partName => {
      // Filter out parts that shouldn't be customizable
      const excludePatterns = ['window', 'glass', 'transparent', 'light', 'chrome'];
      return !excludePatterns.some(pattern => 
        partName.toLowerCase().includes(pattern)
      );
    });
    
    return parts;
  }

  // Lấy màu hiện tại của tất cả parts
  getCurrentColors(): { [key: string]: string } {
    const colors: { [key: string]: string } = {};
    this.parts.forEach((part, name) => {
      colors[name] = part.currentColor;
    });
    return colors;
  }

  // Thay đổi màu của một part - MAIN FUNCTION
  changePartColor(partName: string, hexColor: string): boolean {
    const part = this.parts.get(partName);
    if (!part) {
      console.warn(`❌ Part "${partName}" not found`);
      return false;
    }

    try {
      console.log(`🎨 Changing ${partName} from ${part.currentColor} to ${hexColor} (${part.allMeshes.length} meshes)`);
      
      let changedCount = 0;
      
      // Apply color to all meshes in this part group
      part.allMeshes.forEach((mesh) => {
        if (mesh.material) {
          // Handle array of materials
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial || 
                  mat instanceof THREE.MeshBasicMaterial ||
                  mat instanceof THREE.MeshLambertMaterial ||
                  mat instanceof THREE.MeshPhongMaterial) {
                mat.color.set(hexColor);
                changedCount++;
              }
            });
          } else {
            // Single material
            const material = mesh.material;
            if (material instanceof THREE.MeshStandardMaterial || 
                material instanceof THREE.MeshBasicMaterial ||
                material instanceof THREE.MeshLambertMaterial ||
                material instanceof THREE.MeshPhongMaterial) {
              material.color.set(hexColor);
              changedCount++;
            }
          }
        }
      });
      
      if (changedCount > 0) {
        part.currentColor = hexColor;
        console.log(`✅ Successfully changed ${partName} to ${hexColor} (${changedCount} materials updated)`);
        return true;
      }
    } catch (error) {
      console.error(`❌ Failed to change color for part "${partName}":`, error);
    }
    
    return false;
  }

  // Reset part về màu gốc
  resetPartColor(partName: string): boolean {
    const partInfo = this.parts.get(partName);
    if (!partInfo) return false;

    return this.changePartColor(partName, partInfo.originalColor);
  }

  // Reset tất cả parts về màu gốc
  resetAllColors(): void {
    this.parts.forEach((_, name) => {
      this.resetPartColor(name);
    });
  }

  // Lấy thông tin về một part
  getPartInfo(partName: string): PartInfo | undefined {
    return this.parts.get(partName);
  }

  // Apply color preset
  applyColorPreset(colorMap: { [partName: string]: string }): void {
    Object.entries(colorMap).forEach(([partName, color]) => {
      this.changePartColor(partName, color);
    });
  }

  // Get color preset (current state)
  getColorPreset(): { [partName: string]: string } {
    const preset: { [partName: string]: string } = {};
    this.parts.forEach((part, name) => {
      preset[name] = part.currentColor;
    });
    return preset;
  }

  // Debug function
  debugParts(): void {
    console.log('🔍 Debug: All managed parts:');
    this.parts.forEach((part, name) => {
      console.log(`- ${name}: ${part.currentColor} (original: ${part.originalColor}) [${part.allMeshes.length} meshes]`);
    });
  }

  // Test function - change all parts to red to verify it works
  testChangeAllToRed(): void {
    
    this.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial || 
                  material instanceof THREE.MeshBasicMaterial ||
                  material instanceof THREE.MeshLambertMaterial ||
                  material instanceof THREE.MeshPhongMaterial) {
                material.color.set("#ff0000");
              }
            });
          } else {
            const material = mesh.material;
            if (material instanceof THREE.MeshStandardMaterial || 
                material instanceof THREE.MeshBasicMaterial ||
                material instanceof THREE.MeshLambertMaterial ||
                material instanceof THREE.MeshPhongMaterial) {
              material.color.set("#ff0000");
            }
          }
        }
      }
    });
    
  }

  // Cleanup
  dispose(): void {
    this.parts.forEach((partInfo) => {
      if (partInfo.material.dispose) {
        partInfo.material.dispose();
      }
    });
    this.parts.clear();
  }
}

// Predefined color presets
export const COLOR_PRESETS = {
  'Thể thao': {
    'Body': '#FF0000',      // Red
    'Hood': '#000000',      // Black
    'Roof': '#000000',      // Black
    'Door': '#FF0000',      // Red
    'Bumper': '#333333'     // Dark Gray
  },
  'Luxury': {
    'Body': '#1a1a1a',     // Dark Black
    'Hood': '#1a1a1a',     // Dark Black
    'Roof': '#1a1a1a',     // Dark Black
    'Door': '#1a1a1a',     // Dark Black
    'Bumper': '#1a1a1a'    // Dark Black
  },
  'Racing': {
    'Body': '#FFFF00',     // Yellow
    'Hood': '#000000',     // Black
    'Roof': '#FFFF00',     // Yellow
    'Door': '#FFFF00',     // Yellow
    'Bumper': '#FF0000'    // Red accents
  },
  'Ocean': {
    'Body': '#0066CC',     // Ocean Blue
    'Hood': '#004499',     // Darker Blue
    'Roof': '#87CEEB',     // Sky Blue
    'Door': '#0066CC',     // Ocean Blue
    'Bumper': '#003366'    // Navy
  }
};

export default MaterialManager;