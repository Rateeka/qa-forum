// src/pages/EditQuestionPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { getQuestion, updateQuestion } from '../firebase/firestore';
import TagInput from '../components/common/TagInput';

const EditQuestionPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewDesc, setPreviewDesc] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', tags: [] });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const q = await getQuestion(id);
        if (q.authorId !== currentUser?.uid) {
          toast.error('You can only edit your own question');
          navigate(`/questions/${id}`);
          return;
        }
        setForm({
          title: q.title || '',
          description: q.description || '',
          tags: q.tags || [],
        });
      } catch (err) {
        toast.error(err.message || 'Failed to load question');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, currentUser?.uid, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title.trim().length < 10) { toast.error('Title must be at least 10 characters'); return; }
    if (form.description.trim().length < 20) { toast.error('Description must be at least 20 characters'); return; }
    if (!form.tags.length) { toast.error('Add at least one tag'); return; }

    setSaving(true);
    try {
      await updateQuestion(id, currentUser.uid, {
        title: form.title.trim(),
        description: form.description.trim(),
        tags: form.tags,
      });
      toast.success('Question updated!');
      navigate(`/questions/${id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update question');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-6 text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-100 mb-1">Edit Question</h1>
        <p className="text-sm text-gray-500">Update your title, description, and tags</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card p-5">
          <label className="block mb-1.5">
            <span className="text-sm font-medium text-gray-300">Title</span>
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            maxLength={200}
            className="input-field"
            required
          />
          <p className="mt-1.5 text-xs text-gray-600">{form.title.length}/200</p>
        </div>

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
              rows={10}
              className="input-field resize-y font-mono text-sm"
              required
            />
          )}
        </div>

        <div className="card p-5">
          <label className="block mb-1.5">
            <span className="text-sm font-medium text-gray-300">Tags</span>
            <span className="text-red-400 ml-1">*</span>
          </label>
          <TagInput
            tags={form.tags}
            onChange={(tags) => setForm({ ...form, tags })}
          />
        </div>

        <div className="flex items-center justify-between">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            <Save size={15} />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuestionPage;

