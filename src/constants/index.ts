// Các constants cho toàn bộ ứng dụng

export const MODEL_PATH = "/models/spaceship.glb";

export const CAMERA_POSITION = [0, 1, 4] as const;

export const LOADING_MESSAGES = {
  INIT: 'Khởi tạo ứng dụng...',
  LOADING_MODEL: 'Đang tải model 3D...',
  PROCESSING_ANIMATIONS: 'Đang xử lý animations...',
  SCANNING_MATERIALS: 'Đang quét materials...',
  INIT_COLOR_SYSTEM: 'Khởi tạo hệ thống màu sắc...',
  FINALIZING: 'Hoàn tất khởi tạo...',
  COMPLETE: 'Hoàn thành!'
} as const;

export const PRESET_COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800080', '#FFA500', '#FFC0CB', '#808080', '#000000', '#FFFFFF'
] as const;

export const PART_LABELS: { [key: string]: string } = {
  'Body': '🚗 Thân xe',
  'Hood': '🎯 Nắp capo',
  'Door': '🚪 Cửa xe',
  'Wheel': '⚙️ Bánh xe',
  'Bumper': '🛡️ Cản xe',
  'Roof': '🏠 Nóc xe',
  'Window': '🪟 Kính xe',
  'Mirror': '🪞 Gương',
  'Light': '💡 Đèn',
  'Interior': '🛋️ Nội thất'
} as const;

export const COLOR_PRESETS = {
  'Thể thao': {
    'Body': '#FF0000',
    'Hood': '#000000',
    'Roof': '#000000',
    'Door': '#FF0000',
    'Bumper': '#333333'
  },
  'Luxury': {
    'Body': '#1a1a1a',
    'Hood': '#1a1a1a',
    'Roof': '#1a1a1a',
    'Door': '#1a1a1a',
    'Bumper': '#1a1a1a'
  },
  'Racing': {
    'Body': '#FFFF00',
    'Hood': '#000000',
    'Roof': '#FFFF00',
    'Door': '#FFFF00',
    'Bumper': '#FF0000'
  },
  'Ocean': {
    'Body': '#0066CC',
    'Hood': '#004499',
    'Roof': '#87CEEB',
    'Door': '#0066CC',
    'Bumper': '#003366'
  }
} as const;

export const ANIMATION_SETTINGS = {
  AUTO_ROTATION_SPEED: 0.5,
  SCROLL_SENSITIVITY: 0.005,
  SCROLL_RESUME_DELAY: 2000,
  GSAP_DURATION: 0.8,
  GSAP_EASE: "power2.out"
} as const;
