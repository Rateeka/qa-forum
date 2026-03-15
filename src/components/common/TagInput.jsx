// src/components/common/TagInput.jsx
import { useState, useRef } from 'react';
import { X } from 'lucide-react';

const POPULAR_TAGS = [
  'javascript', 'react', 'python', 'css', 'html', 'node.js',
  'firebase', 'typescript', 'tailwind', 'sql', 'git', 'api',
];

const TagInput = ({ tags, onChange, maxTags = 5 }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  const addTag = (tag) => {
    const cleaned = tag.toLowerCase().trim().replace(/\s+/g, '-');
    if (!cleaned || tags.includes(cleaned) || tags.length >= maxTags) return;
    onChange([...tags, cleaned]);
    setInput('');
    setSuggestions([]);
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (['Enter', ',', ' '].includes(e.key)) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.trim()) {
      setSuggestions(
        POPULAR_TAGS.filter(
          (t) => t.includes(val.toLowerCase()) && !tags.includes(t)
        ).slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div>
      <div
        className="min-h-[44px] flex flex-wrap gap-1.5 px-3 py-2 bg-surface-900 border border-surface-700 rounded-lg focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-900/50 text-brand-300 border border-brand-800/50 text-xs font-medium rounded-md"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-brand-400 hover:text-brand-200 transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        {tags.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? 'Add tags (e.g. javascript, react)' : ''}
            className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none py-0.5"
          />
        )}
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="mt-1 bg-surface-900 border border-surface-700 rounded-lg py-1 shadow-xl z-10 relative">
          {suggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-surface-800 hover:text-white transition-colors"
              onClick={() => addTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <p className="mt-1.5 text-xs text-gray-600">
        {tags.length}/{maxTags} tags · Press Enter, comma, or space to add
      </p>
    </div>
  );
};

export default TagInput;
