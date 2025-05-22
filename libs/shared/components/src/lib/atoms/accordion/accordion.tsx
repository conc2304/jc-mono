import { ChevronDown, ChevronRight } from 'lucide-react';

// Accordion Component
interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export const Accordion = ({
  title,
  children,
  isOpen,
  onToggle,
}: AccordionProps) => {
  return (
    <div className="border border-gray-300 rounded-lg mb-3 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left font-medium text-gray-700 transition-colors"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-gray-200">{children}</div>
      )}
    </div>
  );
};
