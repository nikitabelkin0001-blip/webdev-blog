'use client';

interface TextareaProps {
  label: string;                                                  // текст над полем
  name: string;                                                   // уникальное имя поля
  value: string;                                                  // текущий текст в поле
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;  // функция при изменении
  required?: boolean;                                             // обязательно ли поле
  rows?: number;                                                  // высота в строках (по умолчанию 5)
  placeholder?: string;                                           // подсказка внутри поля
  error?: string;                                                 // сообщение об ошибке
}

export default function Textarea({
  label,
  name,
  value,
  onChange,
  required = false,
  rows = 5,
  placeholder = '',
  error,
}: TextareaProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}