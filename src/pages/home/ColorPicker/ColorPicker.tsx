import React, { useState } from 'react';
import styles from './ColorPicker.module.css';

interface ColorPickerProps {
  onColorChange: (partName: string, color: string) => void;
  availableParts: string[];
  currentColors: { [key: string]: string };
  onTestColorChange?: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  onColorChange,
  availableParts,
  currentColors,
  onTestColorChange
}) => {
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Preset colors for quick selection
  const presetColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800080', '#FFA500', '#FFC0CB', '#808080', '#000000', '#FFFFFF'
  ];

  // Common car part names mapping
  const partLabels: { [key: string]: string } = {
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
  };

  const getPartLabel = (partName: string): string => {
    const matchedKey = Object.keys(partLabels).find(key => 
      partName.toLowerCase().includes(key.toLowerCase())
    );
    return matchedKey ? partLabels[matchedKey] : `🔧 ${partName}`;
  };

  const handleColorChange = (color: string) => {
    if (selectedPart && color) {
      console.log(`Changing ${selectedPart} to ${color}`);
      onColorChange(selectedPart, color);
    }
  };

  return (
    <div className={styles.colorPicker}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.toggleButton}
      >
        <span>Màu Sắc</span>
        <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : styles.collapsed}`}>
          ▼
        </span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={styles.content}>
          {/* Part Selection */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              🎯 Bộ phận:
            </h4>
            <select
              value={selectedPart}
              onChange={(e) => setSelectedPart(e.target.value)}
              className={styles.partSelect}
            >
              <option value="">-- Chọn bộ phận --</option>
              {availableParts.map((part) => (
                <option key={part} value={part}>
                  {getPartLabel(part)}
                </option>
              ))}
            </select>
          </div>

          {selectedPart && (
            <>
              {/* Current Color */}
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>
                  🎨 Hiện tại:
                </h4>
                <div 
                  className={styles.currentColor}
                  style={{ backgroundColor: currentColors[selectedPart] || '#808080' }}
                >
                  {currentColors[selectedPart] || '#808080'}
                </div>
              </div>

              {/* Color Picker */}
              <div className={styles.section}>
                <input
                  type="color"
                  value={currentColors[selectedPart] || '#808080'}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className={styles.colorInput}
                />
              </div>

              {/* Preset Colors */}
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>
                  🎭 Màu có sẵn:
                </h4>
                <div className={styles.presetColors}>
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`${styles.presetColorButton} ${currentColors[selectedPart] === color ? styles.selected : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className={styles.quickActions}>
                <button
                  onClick={() => handleColorChange('#808080')}
                  className={`${styles.quickActionButton} ${styles.resetButton}`}
                >
                  🔄 Reset
                </button>
                <button
                  onClick={() => {
                    const randomColor = presetColors[Math.floor(Math.random() * presetColors.length)];
                    handleColorChange(randomColor);
                  }}
                  className={`${styles.quickActionButton} ${styles.randomButton}`}
                >
                  🎲 Random
                </button>
              </div>
            </>
          )}

          {/* Test Button - Always visible when expanded */}
          {isExpanded && onTestColorChange && (
            <button
              onClick={onTestColorChange}
              className={styles.testButton}
            >
              🧪 Test All Red
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;