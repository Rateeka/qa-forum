// src/components/common/Avatar.jsx
const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-xl',
  xl: 'w-20 h-20 text-3xl',
};

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const colors = [
    'bg-brand-700 text-brand-200',
    'bg-violet-700 text-violet-200',
    'bg-emerald-700 text-emerald-200',
    'bg-amber-700 text-amber-200',
    'bg-rose-700 text-rose-200',
    'bg-cyan-700 text-cyan-200',
  ];

  const colorIndex = name
    ? name.charCodeAt(0) % colors.length
    : 0;

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'User'}
        className={`${sizeMap[size]} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeMap[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center font-semibold font-display flex-shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
