// app/components/SettingsModal.tsx

import { FaTimes, FaTwitch, FaYoutube } from 'react-icons/fa';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div 
      onClick={onClose} 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start z-50 overflow-y-auto p-4 py-8 md:items-center"
    >
      {/* Modal Content */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1b1b1b] text-white rounded-2xl shadow-xl w-full max-w-2xl relative transform transition-all border border-neutral-800"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
          <h2 className="text-2xl font-bold">Account Settings</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Profile Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-400">Display Name</label>
                <input type="text" defaultValue="Twizshaq" className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-md p-2 mt-1 focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-neutral-400">Email Address</label>
                <input type="email" defaultValue="user@example.com" className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-md p-2 mt-1 focus:border-purple-500 outline-none" />
              </div>
            </div>
          </section>

          {/* Connections Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Connections</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-[#2a2a2a] p-3 rounded-lg">
                <div className="flex items-center gap-3"><FaTwitch size={20} className="text-purple-400" /> Twitch</div>
                <button className="text-sm font-semibold bg-white/10 px-3 py-1 rounded-md hover:bg-white/20">Connect</button>
              </div>
              <div className="flex justify-between items-center bg-[#2a2a2a] p-3 rounded-lg">
                <div className="flex items-center gap-3"><FaYoutube size={20} className="text-red-500" /> YouTube</div>
                <p className="text-sm text-neutral-400">Connected</p>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="p-4 border border-red-500/30 rounded-lg">
            <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
            <p className="text-sm text-neutral-400 my-2">Deleting your account is permanent and cannot be undone. All your data and recordings will be lost.</p>
            <button className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold p-2 rounded-md transition-colors">
              Delete Account
            </button>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 bg-[#2a2a2a]/50 border-t border-neutral-800 rounded-b-2xl">
          <button className="bg-purple-600 hover:bg-purple-700 font-bold py-2 px-6 rounded-lg transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;