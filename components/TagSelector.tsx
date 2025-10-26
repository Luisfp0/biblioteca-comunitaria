"use client";

import { KeyboardEvent, useState } from "react";

interface TagSelectorProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TAG_COLORS = [
  "bg-blue-100 text-blue-800 border-blue-300",
  "bg-green-100 text-green-800 border-green-300",
  "bg-purple-100 text-purple-800 border-purple-300",
  "bg-pink-100 text-pink-800 border-pink-300",
  "bg-yellow-100 text-yellow-800 border-yellow-300",
  "bg-indigo-100 text-indigo-800 border-indigo-300",
  "bg-red-100 text-red-800 border-red-300",
  "bg-orange-100 text-orange-800 border-orange-300",
];

function getColorForTag(tag: string): string {
  // Usa um hash simples da string para sempre retornar a mesma cor para a mesma tag
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export default function TagSelector({
  value,
  onChange,
  placeholder = "Digite uma tag e pressione Enter",
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = inputValue.trim().toLowerCase();

      if (trimmedValue && !value.includes(trimmedValue)) {
        onChange([...value, trimmedValue]);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove a última tag se pressionar Backspace com input vazio
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[46px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
        {value.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getColorForTag(
              tag
            )}`}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:opacity-70 transition-opacity"
              aria-label={`Remover tag ${tag}`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none text-sm text-gray-900 placeholder:text-gray-400"
        />
      </div>
      <p className="text-xs text-gray-500">
        Digite uma tag e pressione Enter para adicionar. Pressione Backspace
        para remover a última tag.
      </p>
    </div>
  );
}
