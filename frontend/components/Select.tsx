'use client';

// Описываем, как выглядит один вариант в списке
interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;                              // текст над списком
  name: string;                               // уникальное имя поля
  value: string;                              // текущее выбранное значение
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // при изменении
  options: Option[];                          // массив вариантов для выбора
  required?: boolean;                         // обязательно ли поле
  error?: string;                             // сообщение об ошибке
}

export default function Select({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
}: SelectProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Выберите...</option>
        
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}