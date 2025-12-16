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
                <div className="bg-[#000]/40 rounded-[45px] p-5 min-h-[300px] max-w-[90vw] w-[280px] flex flex-col items-start justify-start gap-3">
                    
                    {/* Welcome Notification Card */}
                    <div className="w-full bg-white/10 hover:bg-white/15 transition-colors rounded-3xl p-4 border border-white/5 shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="text-white text-sm font-bold">Welcome! 👋</h4>
                            <span className="text-[10px] text-gray-400">Now</span>
                        </div>
                        <p className="text-gray-200 text-xs leading-relaxed font-medium opacity-90">
                           Thanks for joining! Head over to the Virtual Map to start exploring sites.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Portal>
  );
};