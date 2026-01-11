import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

interface AlertProps {
  type: 'success' | 'error' | 'confirm';
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void; // Only for 'confirm' type
}

export const CustomAlert = ({ type, message, isOpen, onClose, onConfirm }: AlertProps) => {
  if (!isOpen) return null;

  // Change colors/icons based on type
  const config = {
    success: { icon: <FaCheckCircle className="text-green-500 text-4xl" />, btn: 'bg-green-500', title: 'Success!' },
    error: { icon: <FaTimesCircle className="text-red-500 text-4xl" />, btn: 'bg-red-500', title: 'Error!' },
    confirm: { icon: <FaExclamationTriangle className="text-yellow-500 text-4xl" />, btn: 'bg-[#283862]', title: 'Are you sure?' }
  };

  const current = config[type];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center scale-up-center">
        <div className="flex justify-center mb-4">{current.icon}</div>
        <h2 className="text-2xl font-bold mb-2">{current.title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3">
          {type === 'confirm' && (
            <button onClick={onClose} className="flex-1 py-2 bg-gray-200 rounded-lg font-bold">Cancel</button>
          )}
          <button 
            onClick={type === 'confirm' ? onConfirm : onClose} 
            className={`flex-1 py-2 text-white rounded-lg font-bold ${current.btn}`}
          >
            {type === 'confirm' ? 'Yes, Do it' : 'Okay'}
          </button>
        </div>
      </div>
    </div>
  );
};