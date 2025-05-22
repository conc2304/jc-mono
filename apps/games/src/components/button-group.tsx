import clsx from 'clsx';

interface ButtonGroupProps {
  options: {
    label: string;
    value: string | number | null;
  }[];
  onChange: (value: string | number | null) => void;
  value: string | number | null;
}

export const ButtonGroup = ({
  options,
  onChange,
  value: currentValue,
}: ButtonGroupProps) => {
  return (
    <div className="m-2">
      {options.map(({ value, label }, i) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={clsx(
            'p-2 bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white border-black border',
            i !== options.length - 1 ? 'border-r-0' : '',
            value === currentValue ? 'bg-blue-300' : '', // selected \value
            i === 0 ? 'rounded-l-md' : '', // first
            i === options.length - 1 ? 'rounded-r-md' : '' // last
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
