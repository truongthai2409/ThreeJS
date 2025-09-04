import React, { useState } from 'react';

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

  // Handle color change with validation
  const handleColorChange = (color: string) => {
    if (selectedPart && color) {
      console.log(`Changing ${selectedPart} to ${color}`);
      onColorChange(selectedPart, color);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.9)',
      borderRadius: '12px',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '15px 20px',
          background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span>🎨 Đổi Màu</span>
        <span style={{
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}>
          ▼
        </span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ padding: '20px', minWidth: '280px' }}>
          {/* Part Selection */}
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{
              color: '#fff',
              fontSize: '14px',
              marginBottom: '8px',
              opacity: 0.9
            }}>
              🎯 Chọn bộ phận:
            </h4>
            <select
              value={selectedPart}
              onChange={(e) => setSelectedPart(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Chọn bộ phận --</option>
              {availableParts.map((part) => (
                <option key={part} value={part} style={{ background: '#333' }}>
                  {getPartLabel(part)}
                </option>
              ))}
            </select>
          </div>

          {selectedPart && (
            <>
              {/* Current Color */}
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{
                  color: '#fff',
                  fontSize: '14px',
                  marginBottom: '8px',
                  opacity: 0.9
                }}>
                  🎨 Màu hiện tại:
                </h4>
                <div style={{
                  width: '100%',
                  height: '35px',
                  backgroundColor: currentColors[selectedPart] || '#808080',
                  borderRadius: '6px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  {currentColors[selectedPart] || '#808080'}
                </div>
              </div>

              {/* Color Picker */}
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="color"
                  value={currentColors[selectedPart] || '#808080'}
                  onChange={(e) => handleColorChange(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Preset Colors */}
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{
                  color: '#fff',
                  fontSize: '14px',
                  marginBottom: '8px',
                  opacity: 0.9
                }}>
                  🎭 Màu có sẵn:
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '6px'
                }}>
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: color,
                        border: currentColors[selectedPart] === color 
                          ? '3px solid #fff' 
                          : '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '15px'
              }}>
                <button
                  onClick={() => handleColorChange('#808080')}
                  style={{
                    background: 'linear-gradient(45deg, #666 0%, #999 100%)',
                    border: 'none',
                    color: 'white',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}
                >
                  🔄 Reset
                </button>
                <button
                  onClick={() => {
                    const randomColor = presetColors[Math.floor(Math.random() * presetColors.length)];
                    handleColorChange(randomColor);
                  }}
                  style={{
                    background: 'linear-gradient(45deg, #ff6b6b 0%, #ffa726 100%)',
                    border: 'none',
                    color: 'white',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}
                >
                  🎲 Random
                </button>
              </div>
            </>
          )}

          {/* Test Button - Always visible when expanded */}
          {isExpanded && onTestColorChange && (
            <div style={{ marginTop: '15px' }}>
              <button
                onClick={onTestColorChange}
                style={{
                  width: '100%',
                  background: 'linear-gradient(45deg, #ff0000 0%, #ff6b6b 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(255, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 0, 0, 0.3)';
                }}
              >
                🧪 Test: Đổi Tất Cả Thành Đỏ
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;