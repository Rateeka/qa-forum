// src/pages/AskQuestionPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Lightbulb, Eye, EyeOff, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createQuestion } from '../firebase/firestore';
import TagInput from '../components/common/TagInput';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const TIPS = [
  'Be specific and include details about what you tried',
  'Include relevant code, error messages, or screenshots',
  'Add tags to help others find your question',
  'Check if the question was already asked',
];

const AskQuestionPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', tags: [] });
  const [submitting, setSubmitting] = useState(false);
  const [previewDesc, setPreviewDesc] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title.trim().length < 10) { toast.error('Title must be at least 10 characters'); return; }
    if (form.description.trim().length < 20) { toast.error('Description must be at least 20 characters'); return; }
    if (!form.tags.length) { toast.error('Add at least one tag'); return; }

    setSubmitting(true);
    try {
      const id = await createQuestion(currentUser.uid, {
        title: form.title.trim(),
        description: form.description.trim(),
        tags: form.tags,
      });
      toast.success('Question posted!');
      navigate(`/questions/${id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to post question');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-100 mb-1">Ask a Question</h1>
        <p className="text-sm text-gray-500">Share your problem and get help from the community</p>
      </div>

      {/* Tips */}
      <div className="card p-4 border-brand-800/30 bg-brand-950/10">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={14} className="text-brand-400" />
          <span className="text-sm font-medium text-gray-300">Writing a good question</span>
        </div>
        <ul className="space-y-1">
          {TIPS.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
              <span className="text-brand-500 mt-0.5">·</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="card p-5">
          <label className="block mb-1.5">
            <span className="text-sm font-medium text-gray-300">Title</span>
            <span className="text-red-400 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Be specific. Imagine you're asking a colleague.
          </p>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. How do I center a div in CSS?"
            maxLength={200}
            className="input-field"
            required
          />
          <p className="mt-1.5 text-xs text-gray-600">{form.title.length}/200</p>
        </div>

        {/* Description */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-1.5">
            <label>
              <span className="text-sm font-medium text-gray-300">Description</span>
              <span className="text-red-400 ml-1">*</span>
            </label>
            <button
              type="button"
              onClick={() => setPreviewDesc(!previewDesc)}
              className="btn-ghost text-xs gap-1.5"
            >
              {previewDesc ? <EyeOff size={13} /> : <Eye size={13} />}
              {previewDesc ? 'Edit' : 'Preview'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Include all the information someone would need to answer your question. Markdown supported.
          </p>
          {previewDesc ? (
            <div className="min-h-[200px] p-3 bg-surface-900 border border-surface-700 rounded-lg prose-dark text-sm text-gray-300 leading-relaxed">
              {form.description ? (
                <ReactMarkdown>{form.description}</ReactMarkdown>
              ) : (
                <p className="text-gray-600 italic">Nothing to preview…</p>
              )}
            </div>
          ) : (
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your problem in detail. What have you tried? What error messages are you seeing?"
              rows={10}
              className="input-field resize-y font-mono text-sm"
              required
            />
          )}
        </div>

        {/* Tags */}
        <div className="card p-5">
          <label className="block mb-1.5">
            <span className="text-sm font-medium text-gray-300">Tags</span>
            <span className="text-red-400 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Add up to 5 tags to describe what your question is about.
          </p>
          <TagInput
            tags={form.tags}
            onChange={(tags) => setForm({ ...form, tags })}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
          >
            <Send size={15} />
            {submitting ? 'Posting…' : 'Post Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestionPage;
