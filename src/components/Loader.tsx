interface ILoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export default function Loader({ size = 'lg', color = '#0ff', className = '' }: ILoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-32 h-32',
  };

  const containerClasses = {
    sm: '',
    md: 'min-h-[200px]',
    lg: 'min-h-screen',
  };

  const pulseColorClass =
    color === 'white' ? 'from-white/10 to-white/5' : 'from-[#0ff]/10 to-[#0ff]/5';

  return (
    <div className={`flex items-center justify-center ${containerClasses[size]} ${className}`}>
      <div className="relative">
        <div className={`relative ${sizeClasses[size]}`}>
          <div
            className={`absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-r-current border-b-current animate-spin ${color === 'white' ? 'text-white' : 'text-[#0ff]'}`}
            style={{ animationDuration: '3s' }}
          />
          <div
            className={`absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-t-current animate-spin ${color === 'white' ? 'text-white' : 'text-[#0ff]'}`}
            style={{ animationDuration: '2s', animationDirection: 'reverse' }}
          />
        </div>
        <div
          className={`absolute inset-0 bg-gradient-to-tr ${pulseColorClass} via-transparent animate-pulse rounded-full blur-sm`}
        />
      </div>
    </div>
  );
}
