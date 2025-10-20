import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
  className?: string;
}

export const LoadingSpinner = ({ text, className = '' }: LoadingProps) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Loader2 className="h-4 w-4 animate-spin" />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};