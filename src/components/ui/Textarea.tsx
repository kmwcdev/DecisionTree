import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  grow?: boolean;
}

export function Textarea({ label, id, grow = false, className = '', ...props }: TextareaProps) {
  return (
    <div className={`flex flex-col gap-1 ${grow ? 'flex-1 min-h-0' : ''}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-gray-600">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`rounded border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none ${grow ? 'flex-1 min-h-0' : ''} ${className}`}
        {...props}
      />
    </div>
  );
}
