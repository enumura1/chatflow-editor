import React, { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer: ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  
  // Close modal when clicking outside of content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">{title}</h3>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
        <div className="p-4 border-t flex justify-end space-x-2">
          {footer}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
