// src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Edit2, Check, X, Camera, MessageSquare, HelpCircle, TrendingUp, Calendar } from 'lucide-react';
import { getUserProfile, updateUserProfile, getUserQuestions, getUserAnswers } from '../firebase/firestore';
import { uploadProfilePicture } from '../firebase/storage';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import QuestionCard from '../components/question/QuestionCard';
import { ProfileSkeleton } from '../components/common/Skeleton';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, value, label, color = 'brand' }) => {
  const colors = {
    brand: 'text-brand-400 bg-brand-900/20',
    emerald: 'text-emerald-400 bg-emerald-900/20',
    amber: 'text-amber-400 bg-amber-900/20',
    violet: 'text-violet-400 bg-violet-900/20',
  };
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xl font-bold font-display text-gray-100">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { userId } = useParams();
  const { currentUser, refreshProfile } = useAuth();
  const isOwner = currentUser?.uid === userId;

  const [profile, setProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('questions');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [p, q, a] = await Promise.all([
          getUserProfile(userId),
          getUserQuestions(userId),
          getUserAnswers(userId),
        ]);
        setProfile(p);
        setQuestions(q);
        setAnswers(a);
        setEditForm({ displayName: p.displayName || '', bio: p.bio || '' });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const handleSave = async () => {
    if (!editForm.displayName.trim()) { toast.error('Name cannot be empty'); return; }
    setSaving(true);
    try {
      await updateUserProfile(userId, {
        displayName: editForm.displayName.trim(),
        bio: editForm.bio.trim(),
      });
      setProfile((p) => ({ ...p, ...editForm }));
      setEditing(false);
      await refreshProfile();
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProfilePicture(userId, file);
      await updateUserProfile(userId, { photoURL: url });
      setProfile((p) => ({ ...p, photoURL: url }));
      await refreshProfile();
      toast.success('Profile picture updated!');
    } catch (err) { toast.error(err.message); }
    finally { setUploading(false); }
  };

  if (loading) return <ProfileSkeleton />;
  if (!profile) return <div className="card p-8 text-center text-gray-400">User not found</div>;

  const totalUpvotes = questions.reduce((sum, q) => sum + (q.votes > 0 ? q.votes : 0), 0)
    + answers.reduce((sum, a) => sum + (a.votes > 0 ? a.votes : 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile card */}
      <div className="card p-6">
        <div className="flex items-start gap-5 flex-wrap">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar src={profile.photoURL} name={profile.displayName} size="xl" />
            {isOwner && (
              <label className={`absolute -bottom-1 -right-1 w-7 h-7 bg-brand-600 hover:bg-brand-500 rounded-full flex items-center justify-center cursor-pointer transition-colors ${uploading ? 'opacity-50' : ''}`}>
                <Camera size={14} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-2">
                <input
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  className="input-field text-lg font-bold font-display"
                  placeholder="Display name"
                />
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="input-field text-sm resize-none"
                  rows={2}
                  placeholder="Short bio…"
                  maxLength={200}
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-1.5">
                    <Check size={14} />
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-secondary text-sm py-1.5">
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-bold text-xl text-gray-100">{profile.displayName}</h1>
                  {isOwner && (
                    <button onClick={() => setEditing(true)} className="btn-ghost text-xs gap-1 py-1">
                      <Edit2 size={12} />
                      Edit
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{profile.email}</p>
                {profile.bio && <p className="text-sm text-gray-400 mt-2 leading-relaxed">{profile.bio}</p>}
                {profile.createdAt && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-2">
                    <Calendar size={12} />
                    Joined {formatDistanceToNow(profile.createdAt.toDate(), { addSuffix: true })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={HelpCircle} value={questions.length} label="Questions" color="brand" />
        <StatCard icon={MessageSquare} value={answers.length} label="Answers" color="emerald" />
        <StatCard icon={TrendingUp} value={totalUpvotes} label="Upvotes" color="amber" />
        <StatCard icon={TrendingUp} value={profile.reputation || 0} label="Reputation" color="violet" />
      </div>

      {/* Tabs */}
      <div>
        <div className="flex border-b border-surface-800 mb-4">
          {[
            { id: 'questions', label: `Questions (${questions.length})` },
            { id: 'answers', label: `Answers (${answers.length})` },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all ${
                tab === id
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'questions' && (
          <div className="space-y-3">
            {questions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No questions asked yet</p>
            ) : (
              questions.map((q) => <QuestionCard key={q.id} question={q} />)
            )}
          </div>
        )}

        {tab === 'answers' && (
          <div className="space-y-3">
            {answers.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No answers given yet</p>
            ) : (
              answers.map((a) => (
                <Link key={a.id} to={`/questions/${a.questionId}`} className="block card-hover p-4 group">
                  <p className="text-sm font-medium text-brand-400 group-hover:text-brand-300 mb-1 transition-colors">
                    Re: {a.questionTitle}
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-2">{a.content?.replace(/[#*`]/g, '')}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                    <span>{a.votes ?? 0} votes</span>
                    {a.isAccepted && <span className="badge-accepted">✓ Accepted</span>}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
