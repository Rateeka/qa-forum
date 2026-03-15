// src/pages/QuestionDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Eye, MessageSquare, Trash2, ArrowLeft, Share2, Edit2 } from 'lucide-react';
import {
  getQuestion,
  incrementQuestionViews,
  voteOnQuestion,
  subscribeToAnswers,
  deleteQuestion,
} from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';
import VoteButton from '../components/common/VoteButton';
import TagList from '../components/common/TagList';
import UserMeta from '../components/common/UserMeta';
import AnswerCard from '../components/answer/AnswerCard';
import AnswerForm from '../components/answer/AnswerForm';
import useUserData from '../hooks/useUserData';
import { QuestionCardSkeleton } from '../components/common/Skeleton';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData: authorData } = useUserData(question?.authorId);

  // Load question
  useEffect(() => {
    const load = async () => {
      try {
        const q = await getQuestion(id);
        setQuestion(q);
        incrementQuestionViews(id).catch(() => {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Real-time answers subscription
  useEffect(() => {
    if (!id) return;
    const unsub = subscribeToAnswers(id, setAnswers);
    return unsub;
  }, [id]);

  const handleVote = async (type) => {
    if (!question) return;
    await voteOnQuestion(id, currentUser.uid, type);
    // Optimistically refresh
    const updated = await getQuestion(id);
    setQuestion(updated);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this question? This cannot be undone.')) return;
    try {
      await deleteQuestion(id, currentUser.uid);
      toast.success('Question deleted');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <QuestionCardSkeleton />
        <QuestionCardSkeleton />
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-400 mb-3">{error || 'Question not found'}</p>
        <Link to="/" className="btn-secondary">← Back to Questions</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back nav */}
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm -ml-2">
        <ArrowLeft size={15} />
        Back
      </button>

      {/* Question */}
      <div className="card p-6">
        <div className="flex gap-5">
          {/* Vote column */}
          <div className="flex-shrink-0">
            <VoteButton
              votes={question.votes}
              upvoters={question.upvoters}
              downvoters={question.downvoters}
              onVote={handleVote}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h1 className="font-display font-bold text-xl text-gray-100 leading-snug">
                {question.title}
              </h1>
              {question.isAnswered && (
                <span className="badge-accepted flex-shrink-0">✓ Answered</span>
              )}
            </div>

            <div className="prose-dark text-sm text-gray-300 leading-relaxed mb-5">
              <ReactMarkdown>{question.description}</ReactMarkdown>
            </div>

            <TagList tags={question.tags} />

            <div className="mt-4 pt-4 border-t border-surface-800 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Eye size={13} />
                  {question.views ?? 0} views
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={13} />
                  {answers.length} answer{answers.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleShare} className="btn-ghost text-xs gap-1.5">
                  <Share2 size={13} />
                  Share
                </button>
                <Link to={`/questions/${id}/edit`} className="btn-ghost text-xs gap-1.5">
                  <Edit2 size={13} />
                  Edit
                </Link>
                {currentUser?.uid === question.authorId && (
                  <button onClick={handleDelete} className="btn-ghost text-xs gap-1.5 text-red-500 hover:text-red-400">
                    <Trash2 size={13} />
                    Delete
                  </button>
                )}
                <UserMeta
                  userId={question.authorId}
                  displayName={authorData?.displayName}
                  photoURL={authorData?.photoURL}
                  timestamp={question.createdAt}
                  prefix="asked"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers section */}
      {answers.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-lg text-gray-200 mb-3">
            {answers.length} Answer{answers.length !== 1 ? 's' : ''}
          </h2>
          <div className="space-y-4">
            {answers.map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                questionId={id}
                questionAuthorId={question.authorId}
              />
            ))}
          </div>
        </section>
      )}

      {/* Answer form */}
      <section>
        <h2 className="font-display font-semibold text-lg text-gray-200 mb-3">
          Your Answer
        </h2>
        <AnswerForm questionId={id} />
      </section>
    </div>
  );
};

export default QuestionDetailPage;
