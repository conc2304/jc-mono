import clsx from 'clsx';

interface ButtonGroupProps<T> {
  options: {
    label: string;
    value: T;
  }[];
  onChange: (value: T) => void;
  value: T;
}

export const ButtonGroup = <T extends string | number | boolean>({
  options,
  onChange,
  value: currentValue,
}: ButtonGroupProps<T>) => {
  return (
    <div className="m-2 border border-black rounded overflow-hidden">
      {options.map(({ value, label }, i) => {
        console.log(value, currentValue, value === currentValue);

        return (
          <button
            key={label + value?.toString()}
            onClick={() => onChange(value)}
            className={clsx(
              'p-2 bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white',
              i !== options.length - 1 ? 'border-r border-black' : '',
              value === currentValue ? 'bg-cyan-400' : '' // selected value
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
