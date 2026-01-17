import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

export function Notification({ type, message, onClose }: NotificationProps) {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600" />,
    },
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300`}>
      {style.icon}
      <div className="flex-1">
        <p className={`${style.text} text-sm font-medium`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${style.text} hover:opacity-70 transition-opacity`}
          aria-label="Schließen"
        >
          ×
        </button>
      )}
    </div>
  );
}
