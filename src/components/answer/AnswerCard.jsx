// src/components/answer/AnswerCard.jsx
import { useState } from 'react';
import { CheckCircle2, MessageSquare, ChevronDown, ChevronUp as ChevronUpIcon } from 'lucide-react';
import VoteButton from '../common/VoteButton';
import UserMeta from '../common/UserMeta';
import CommentSection from './CommentSection';
import useUserData from '../../hooks/useUserData';
import { useAuth } from '../../context/AuthContext';
import { voteOnAnswer, acceptAnswer } from '../../firebase/firestore';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const AnswerCard = ({ answer, questionId, questionAuthorId }) => {
  const { currentUser } = useAuth();
  const { userData } = useUserData(answer.authorId);
  const [showComments, setShowComments] = useState(false);

  const handleVote = async (type) => {
    await voteOnAnswer(questionId, answer.id, currentUser.uid, type);
  };

  const handleAccept = async () => {
    if (!currentUser || currentUser.uid !== questionAuthorId) return;
    try {
      await acceptAnswer(questionId, answer.id, questionAuthorId, currentUser.uid);
      toast.success(answer.isAccepted ? 'Answer unaccepted' : 'Answer accepted! ✓');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className={`card p-5 transition-all duration-200 ${
        answer.isAccepted ? 'border-emerald-800/50 bg-emerald-950/10' : ''
      }`}
    >
      <div className="flex gap-4">
        {/* Vote + Accept column */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <VoteButton
            votes={answer.votes}
            upvoters={answer.upvoters}
            downvoters={answer.downvoters}
            onVote={handleVote}
          />

          {/* Accept button */}
          {currentUser?.uid === questionAuthorId && (
            <button
              onClick={handleAccept}
              title={answer.isAccepted ? 'Unaccept answer' : 'Accept this answer'}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${
                answer.isAccepted
                  ? 'text-emerald-400 bg-emerald-900/30'
                  : 'text-gray-600 hover:text-emerald-400 hover:bg-emerald-900/20'
              }`}
            >
              <CheckCircle2 size={18} />
            </button>
          )}

          {answer.isAccepted && currentUser?.uid !== questionAuthorId && (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-400 bg-emerald-900/30">
              <CheckCircle2 size={18} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {answer.isAccepted && (
            <div className="badge-accepted mb-3">
              <CheckCircle2 size={12} />
              Accepted Answer
            </div>
          )}

          <div className="prose-dark text-sm text-gray-300 leading-relaxed max-w-none">
            <ReactMarkdown>{answer.content}</ReactMarkdown>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-800 flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={() => setShowComments(!showComments)}
              className="btn-ghost text-xs gap-1.5"
            >
              <MessageSquare size={13} />
              Comments
              {showComments ? <ChevronUpIcon size={13} /> : <ChevronDown size={13} />}
            </button>

            <UserMeta
              userId={answer.authorId}
              displayName={userData?.displayName}
              photoURL={userData?.photoURL}
              timestamp={answer.createdAt}
              prefix="answered"
            />
          </div>

          {showComments && (
            <div className="mt-3 pt-3 border-t border-surface-800/50">
              <CommentSection questionId={questionId} answerId={answer.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
