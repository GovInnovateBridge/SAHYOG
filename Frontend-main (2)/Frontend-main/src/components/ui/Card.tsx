
interface CardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: string; // e.g. 'border-t-blue-500'
  onClick?: () => void;
}

export default function Card({ children, className = '', accentColor, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-gray-200 rounded shadow-sm
        ${accentColor ? `border-t-2 ${accentColor}` : ''}
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Sub-components for structured card layout
Card.Header = function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-5 py-4 border-b border-gray-100 ${className}`}>{children}</div>;
};

Card.Body = function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-5 py-3 bg-gray-50 border-t border-gray-100 rounded-b ${className}`}>{children}</div>;
};
