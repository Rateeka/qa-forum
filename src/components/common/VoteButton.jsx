// src/components/common/VoteButton.jsx
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const VoteButton = ({ votes = 0, upvoters = [], downvoters = [], onVote, size = 'md' }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const isUpvoted = currentUser && upvoters.includes(currentUser.uid);
  const isDownvoted = currentUser && downvoters.includes(currentUser.uid);

  const handleVote = async (type) => {
    if (!currentUser) {
      toast.error('Sign in to vote');
      navigate('/login');
      return;
    }
    try {
      await onVote(type);
    } catch {
      toast.error('Failed to register vote');
    }
  };

  const btnSize = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  const iconSize = size === 'sm' ? 14 : 16;
  const voteSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleVote('up')}
        className={`${btnSize} rounded-lg flex items-center justify-center transition-all duration-150 ${
          isUpvoted
            ? 'text-brand-400 bg-brand-900/30 hover:bg-brand-900/50'
            : 'text-gray-500 hover:text-gray-300 hover:bg-surface-800'
        }`}
        title="Upvote"
      >
        <ChevronUp size={iconSize} strokeWidth={2.5} />
      </button>

      <span
        className={`${voteSize} font-bold font-display leading-none ${
          isUpvoted ? 'text-brand-400' : isDownvoted ? 'text-red-400' : 'text-gray-300'
        }`}
      >
        {votes}
      </span>

      <button
        onClick={() => handleVote('down')}
        className={`${btnSize} rounded-lg flex items-center justify-center transition-all duration-150 ${
          isDownvoted
            ? 'text-red-400 bg-red-900/30 hover:bg-red-900/50'
            : 'text-gray-500 hover:text-gray-300 hover:bg-surface-800'
        }`}
        title="Downvote"
      >
        <ChevronDown size={iconSize} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default VoteButton;
