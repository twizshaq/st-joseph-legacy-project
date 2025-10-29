import React from 'react';
import Portal from './Portal';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, position }) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest('#noti-panel')) {
        onClose();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        id="noti-panel"
        className="fixed z-[100]"
        style={{ top: position.top, left: position.left }}
      >
        <div className='-translate-x-1/2 max-sm:-translate-x-21/30 max-sm:mt-[10px] mt-[30px]'>
            <div className='bg-white/10 backdrop-blur-[10px] rounded-[48px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                <div className="bg-[#000]/40 rounded-[45px] p-6 min-h-[300px] max-w-[90vw] w-[280px] flex flex-col items-center justify-center">
                    <p className="text-white text-sm font-medium">You have no new notifications.</p>
                </div>
            </div>
        </div>
      </div>
    </Portal>
  );
};