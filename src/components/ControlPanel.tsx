import React from 'react';

interface ControlPanelProps {
  onAnimationPlay: (animationName: string) => void;
  onResetRotation: () => void;
  onToggleAutoRotation: () => void;
  isAutoRotating: boolean;
  availableAnimations: string[];
  onOpenAllDoors?: () => void;
  onCloseAllDoors?: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onAnimationPlay,
  onResetRotation,
  onToggleAutoRotation,
  isAutoRotating,
  availableAnimations,
  onOpenAllDoors,
  onCloseAllDoors
}) => {
  const animationLabels: { [key: string]: string } = {
    "anim_TAILGATE_0": "Mở/Đóng Cốp",
    "anim_DOOR_REAR_RIGHT_1": "Cửa Sau Phải",
    "anim_DOOR_REAR_LEFT_2": "Cửa Sau Trái",
    "anim_DOOR_FRONT_RIGHT_3": "Cửa Trước Phải",
    "anim_DOOR_FRONT_LEFT_4": "Cửa Trước Trái"
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '20px',
      borderRadius: '10px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      minWidth: '250px'
    }}>
      <h3 style={{
        color: '#fff',
        marginBottom: '15px',
        fontSize: '18px',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        Điều Khiển Model
      </h3>

      {/* Animation Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{
          color: '#fff',
          marginBottom: '10px',
          fontSize: '14px',
          opacity: 0.9
        }}>
          Animations
        </h4>
        <div style={{
          display: 'grid',
          gap: '8px',
          gridTemplateColumns: '1fr'
        }}>
          {availableAnimations.map((animName) => (
            <button
              key={animName}
              onClick={() => onAnimationPlay(animName)}
              style={{
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                padding: '10px 15px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              {animationLabels[animName] || animName}
            </button>
          ))}
        </div>
      </div>

      {/* Door Controls */}
      {(onOpenAllDoors || onCloseAllDoors) && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{
            color: '#fff',
            marginBottom: '10px',
            fontSize: '14px',
            opacity: 0.9
          }}>
            Điều Khiển Cửa
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px'
          }}>
            {onOpenAllDoors && (
              <button
                onClick={onOpenAllDoors}
                style={{
                  background: 'linear-gradient(45deg, #4CAF50 0%, #66BB6A 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                }}
              >
                Mở Cửa
              </button>
            )}

            {onCloseAllDoors && (
              <button
                onClick={onCloseAllDoors}
                style={{
                  background: 'linear-gradient(45deg, #F44336 0%, #EF5350 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(244, 67, 54, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(244, 67, 54, 0.3)';
                }}
              >
                Đóng Cửa
              </button>
            )}
          </div>
        </div>
      )}

      {/* Rotation Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{
          color: '#fff',
          marginBottom: '10px',
          fontSize: '14px',
          opacity: 0.9
        }}>
           Điều Khiển Xoay
        </h4>
        <div style={{
          display: 'grid',
          gap: '8px',
          gridTemplateColumns: '1fr 1fr'
        }}>
          <button
            onClick={onToggleAutoRotation}
            style={{
              background: isAutoRotating
                ? 'linear-gradient(45deg, #56ab2f 0%, #a8e6cf 100%)'
                : 'linear-gradient(45deg, #ff6b6b 0%, #ffa726 100%)',
              border: 'none',
              color: 'white',
              padding: '10px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              boxShadow: isAutoRotating
                ? '0 4px 15px rgba(86, 171, 47, 0.3)'
                : '0 4px 15px rgba(255, 107, 107, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {isAutoRotating ? 'Dừng' : 'Quay'}
          </button>

          <button
            onClick={onResetRotation}
            style={{
              background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
              color: 'white',
              padding: '10px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 172, 254, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 172, 254, 0.3)';
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p style={{
          color: '#fff',
          fontSize: '11px',
          margin: 0,
          opacity: 0.8,
          lineHeight: '1.4'
        }}>
          <strong>Hướng dẫn:</strong><br />
          • Scroll chuột để xoay model<br />
          • Click các nút để thực hiện animation<br />
          • Sử dụng chuột để di chuyển camera
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;
