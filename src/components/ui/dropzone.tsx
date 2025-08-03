import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Cloud, File, X } from 'lucide-react';
import { Progress } from './progress';

interface DropzoneProps {
  className?: string;
  disabled?: boolean;
  maxFiles?: number;
  onDrop: (files: File[]) => void;
  value?: File[];
  progress?: number;
  onRemove?: (index: number) => void;
}

export function Dropzone({
  className,
  disabled = false,
  maxFiles = 1,
  onDrop,
  value = [],
  progress,
  onRemove,
}: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled,
    maxFiles,
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
  });

  const removeFile = useCallback((index: number) => {
    onRemove?.(index);
  }, [onRemove]);

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          'relative rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          disabled && 'pointer-events-none opacity-60',
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-xs text-gray-600">
          <Cloud className="h-10 w-10 text-gray-400" />
          <div className="text-center">
            <p className="text-base font-medium">
              {isDragActive ? 'Drop the files here' : 'Drag & drop files here'}
            </p>
            <p>or click to select files</p>
          </div>
          <p className="text-xs text-gray-500">
            Only images are allowed (PNG, JPG, JPEG, WebP)
          </p>
        </div>
      </div>

      {/* Preview & Progress */}
      {value.length > 0 && (
        <div className="mt-4">
          <div className="divide-y divide-gray-100">
            {value.map((file, i) => (
              <div key={i} className="flex items-center gap-2 py-2">
                <File className="h-4 w-4 shrink-0" />
                <div className="flex-1 text-sm text-gray-600">
                  {file.name}
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-md p-1 transition-colors hover:bg-gray-100"
                  onClick={() => removeFile(i)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {typeof progress === 'number' && (
            <Progress value={progress} className="mt-2" />
          )}
        </div>
      )}
    </div>
  );
}
