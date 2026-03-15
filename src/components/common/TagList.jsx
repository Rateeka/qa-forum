// src/components/common/TagList.jsx
import { Link } from 'react-router-dom';

const TagList = ({ tags = [], onClick }) => {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Link
          key={tag}
          to={`/tags/${tag}`}
          className="tag-chip"
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(tag);
          }}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
};

export default TagList;
