// src/components/answer/AnswerForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createAnswer } from '../../firebase/firestore';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const AnswerForm = ({ questionId, onAnswerAdded }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please sign in to answer');
      navigate('/login');
      return;
    }
    if (content.trim().length < 20) {
      toast.error('Answer must be at least 20 characters');
      return;
    }

    setSubmitting(true);
    try {
      await createAnswer(questionId, currentUser.uid, content.trim());
      setContent('');
      setPreview(false);
      toast.success('Answer posted!');
      onAnswerAdded?.();
    } catch (err) {
      toast.error(err.message || 'Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="card p-5 text-center">
        <p className="text-gray-400 mb-3">Sign in to post an answer</p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => navigate('/login')} className="btn-primary">Sign In</button>
          <button onClick={() => navigate('/signup')} className="btn-secondary">Sign Up</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-gray-200">Your Answer</h3>
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="btn-ghost text-xs gap-1.5"
        >
          {preview ? <EyeOff size={14} /> : <Eye size={14} />}
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {preview ? (
          <div className="min-h-[160px] p-3 bg-surface-900 border border-surface-700 rounded-lg prose-dark text-sm text-gray-300 leading-relaxed">
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <p className="text-gray-600 italic">Nothing to preview yet…</p>
            )}
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your answer here. Markdown is supported.

Use **bold**, *italic*, `code`, or:
```javascript
// code blocks
```"
            rows={8}
            className="input-field resize-y font-mono text-sm leading-relaxed"
            required
          />
        )}

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-gray-600">Markdown supported · Min 20 characters</p>
          <button
            type="submit"
            disabled={submitting || content.trim().length < 20}
            className="btn-primary"
          >
            <Send size={14} />
            {submitting ? 'Posting…' : 'Post Answer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;
