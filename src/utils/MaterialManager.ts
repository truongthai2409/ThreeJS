import * as THREE from 'three';

interface PartInfo {
  name: string;
  material: THREE.Material;
  mesh: THREE.Mesh;
  originalColor: string;
  currentColor: string;
}

export class MaterialManager {
  private parts: Map<string, PartInfo> = new Map();
  private scene: THREE.Object3D;

  constructor(scene: THREE.Object3D) {
    this.scene = scene;
    this.scanMaterials();
  }

  // Quét tất cả materials trong scene
  private scanMaterials(): void {
    console.log('🔍 Scanning materials in scene...');
    
    this.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        console.log(`Found mesh: ${mesh.name || 'unnamed'}`);
        
        if (mesh.material) {
          const material = mesh.material;
          
          // Handle both single material and material array
          if (Array.isArray(material)) {
            material.forEach((mat, index) => {
              const partName = `${mesh.name || 'Part'}_${index}`;
              this.processMaterial(mat, partName, mesh);
            });
          } else {
            const partName = mesh.name || `Mesh_${Math.random().toString(36).substr(2, 9)}`;
            this.processMaterial(material, partName, mesh);
          }
        }
      }
    });

    console.log(`✅ Found ${this.parts.size} materials to manage`);
    console.log('Available parts:', Array.from(this.parts.keys()));
  }

  private processMaterial(material: THREE.Material, partName: string, mesh: THREE.Mesh): void {
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
    
    console.log('🎯 Available parts for customization:', parts);
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
      console.log(`🎨 Changing ${partName} from ${part.currentColor} to ${hexColor}`);
      
      // Use the direct approach you suggested
      if (part.mesh && part.mesh.material) {
        // Handle array of materials
        if (Array.isArray(part.mesh.material)) {
          part.mesh.material.forEach((mat) => {
            if (mat === part.material) {
              (mat as THREE.MeshStandardMaterial).color.set(hexColor);
            }
          });
        } else {
          // Single material
          if (part.mesh.material === part.material) {
            (part.mesh.material as THREE.MeshStandardMaterial).color.set(hexColor);
          }
        }
        
        part.currentColor = hexColor;
        console.log(`✅ Successfully changed ${partName} to ${hexColor}`);
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
      console.log(`- ${name}: ${part.currentColor} (original: ${part.originalColor})`);
    });
  }

  // Test function - change all parts to red to verify it works
  testChangeAllToRed(): void {
    console.log('🧪 Testing: Changing all parts to red...');
    
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
    
    console.log('✅ Test completed - all parts should be red now');
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