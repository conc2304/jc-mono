interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const NumberInput = ({
  label,
  value,
  onChange,
  min = -20000,
  max = 20000,
}: NumberInputProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm font-medium text-gray-700 flex-1 mr-4">
        {label}:
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
      />
    </div>
  );
};
