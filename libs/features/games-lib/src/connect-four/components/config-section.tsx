import { NumberInput } from '@jc/ui-components';
import { Accordion } from '@jc/ui-components';
import { formatLabel } from '@jc/utils';

// Dynamic Config Section Component
interface ConfigSectionProps {
  title: string;
  sectionKey: string;
  config: Record<string, number>;
  onUpdate: (field: string, value: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ConfigSection = ({
  title,
  config,
  onUpdate,
  isOpen,
  onToggle,
}: ConfigSectionProps) => {
  return (
    <Accordion title={title} isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-1">
        {Object.entries(config).map(([field, value]) => (
          <NumberInput
            key={field}
            label={formatLabel(field)}
            value={value}
            onChange={(newValue) => onUpdate(field, newValue)}
          />
        ))}
      </div>
    </Accordion>
  );
};
