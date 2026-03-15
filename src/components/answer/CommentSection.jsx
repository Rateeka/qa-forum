// src/components/answer/CommentSection.jsx
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { subscribeToComments, addComment, deleteComment } from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import useUserData from '../../hooks/useUserData';
import toast from 'react-hot-toast';

const CommentItem = ({ comment, questionId, answerId, onDelete }) => {
  const { currentUser } = useAuth();
  const { userData } = useUserData(comment.authorId);

  return (
    <div className="flex items-start gap-2 py-1.5 group">
      <div className="flex-1 min-w-0">
        <span className="text-xs text-gray-400 leading-relaxed">
          {comment.content}{' '}
        </span>
        <span className="text-[11px] text-gray-600">
          —{' '}
          <Link
            to={`/profile/${comment.authorId}`}
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            {userData?.displayName || 'Anonymous'}
          </Link>
          {' · '}
          {comment.createdAt?.toDate
            ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })
            : 'just now'}
        </span>
      </div>
      {currentUser?.uid === comment.authorId && (
        <button
          onClick={() => onDelete(comment.id)}
          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
};

const CommentSection = ({ questionId, answerId }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsub = subscribeToComments(questionId, answerId, setComments);
    return unsub;
  }, [questionId, answerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await addComment(questionId, answerId, currentUser.uid, newComment.trim());
      setNewComment('');
      setShowForm(false);
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(questionId, answerId, commentId, currentUser.uid);
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="space-y-1">
      {comments.length > 0 && (
        <div className="divide-y divide-surface-800/50">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              questionId={questionId}
              answerId={answerId}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment…"
            maxLength={500}
            className="flex-1 px-3 py-1.5 bg-surface-900 border border-surface-700 rounded-lg text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
            autoFocus
          />
          <button type="submit" disabled={submitting || !newComment.trim()} className="btn-primary text-xs py-1.5">
            Add
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-xs">
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => {
            if (!currentUser) { navigate('/login'); return; }
            setShowForm(true);
          }}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-brand-400 transition-colors mt-1"
        >
          <Plus size={12} />
          Add comment
        </button>
      )}
    </div>
  );
};

export default CommentSection;
