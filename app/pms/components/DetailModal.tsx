'use client';

import { X, Calendar, DollarSign, User } from 'lucide-react';
import { memo } from 'react';

interface DetailModalProps {
  isOpen: boolean;
  title: string;
  data: any[];
  columns: { key: string; label: string; format?: (value: any) => string }[];
  onClose: () => void;
}

const DetailModal = memo(({ isOpen, title, data, columns, onClose }: DetailModalProps) => {
  if (!isOpen) return null;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-card border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
            <h2 id="modal-title" className="text-xl font-semibold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="text-foreground/60 hover:text-foreground transition-colors p-1"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {data.length === 0 ? (
              <p className="text-foreground/60 text-center py-8">No data available</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {data.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-card/50 border border-border/50 rounded-lg p-4 hover:border-primary/30 transition-colors"
                  >
                    {columns.map((col) => (
                      <div key={col.key} className="flex justify-between items-start mb-2">
                        <span className="text-foreground/60 text-sm">{col.label}</span>
                        <span className="text-foreground font-medium">
                          {col.format ? col.format(item[col.key]) : item[col.key]}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

DetailModal.displayName = 'DetailModal';
export default DetailModal;
