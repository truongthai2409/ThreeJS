import React, { useState, useEffect } from 'react';
import { useScreen } from '../../../hooks';
import styles from './ControlPanel.module.css';

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
  const screenType = useScreen();
  const [isOpen, setIsOpen] = useState(() => {
    return screenType === 'desktop';
  });
  
  const handleToggle = () => setIsOpen(prev => !prev);
  useEffect(() => {
    if (screenType === 'desktop') {
      setIsOpen(true);  
    } else {
      setIsOpen(false); 
    }
  }, [screenType]);

  const animationLabels: { [key: string]: string } = {
    "anim_TAILGATE_0": "Mở/Đóng Cốp",
    "anim_DOOR_REAR_RIGHT_1": "Cửa Sau Phải",
    "anim_DOOR_REAR_LEFT_2": "Cửa Sau Trái",
    "anim_DOOR_FRONT_RIGHT_3": "Cửa Trước Phải",
    "anim_DOOR_FRONT_LEFT_4": "Cửa Trước Trái"
  };

  // Responsive title based on screen size
  const getTitle = () => {
    switch (screenType) {
      case 'mobile':
        return 'Điều Khiển';
      case 'tablet':
        return 'Điều Khiển Model';
      default:
        return 'Điều Khiển Model';
    }
  };

  // Get grid layout based on screen size
  const getAnimationGridClass = () => {
    if (screenType === 'mobile') {
      return styles.animationGrid; // Single column for mobile
    }
    return styles.animationGrid; 
  };

  return (
    <div className={styles.controlPanel}>
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={styles.toggleButton}
      >
        <span>{getTitle()}</span>
        <span className={`${styles.expandIcon} ${isOpen ? styles.expanded : styles.collapsed}`}>
          ▼
        </span>
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div className={`${styles.content} ${isOpen ? styles.expanded : styles.collapsed}`}>
          {/* Animation Controls */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              {screenType === 'mobile' ? 'Animations' : 'Animations'}
            </h4>
            <div className={getAnimationGridClass()}>
              {availableAnimations.map((animName) => (
                <button
                  key={animName}
                  onClick={() => onAnimationPlay(animName)}
                  className={styles.animationButton}
                >
                  {animationLabels[animName] || animName}
                </button>
              ))}
            </div>
          </div>

          {/* Door Controls */}
          {(onOpenAllDoors || onCloseAllDoors) && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>
                {screenType === 'mobile' ? 'Cửa' : 'Điều Khiển Cửa'}
              </h4>
              <div className={styles.doorControlsGrid}>
                {onOpenAllDoors && (
                  <button
                    onClick={onOpenAllDoors}
                    className={`${styles.doorButton} ${styles.openButton}`}
                  >
                    {screenType === 'mobile' ? 'Mở' : 'Mở Cửa'}
                  </button>
                )}

                {onCloseAllDoors && (
                  <button
                    onClick={onCloseAllDoors}
                    className={`${styles.doorButton} ${styles.closeButton}`}
                  >
                    {screenType === 'mobile' ? 'Đóng' : 'Đóng Cửa'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Rotation Controls */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              {screenType === 'mobile' ? 'Xoay' : 'Điều Khiển Xoay'}
            </h4>
            <div className={styles.rotationGrid}>
              <button
                onClick={onToggleAutoRotation}
                className={`${styles.rotationButton} ${styles.autoRotateButton} ${
                  isAutoRotating ? styles.active : styles.inactive
                }`}
              >
                {isAutoRotating ? (screenType === 'mobile' ? 'Dừng' : 'Dừng') : (screenType === 'mobile' ? 'Quay' : 'Quay')}
              </button>

              <button
                onClick={onResetRotation}
                className={`${styles.rotationButton} ${styles.resetButton}`}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;