// src/components/question/QuestionCard.jsx
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, CheckCircle2, ChevronUp } from 'lucide-react';
import TagList from '../common/TagList';
import UserMeta from '../common/UserMeta';
import useUserData from '../../hooks/useUserData';

const StatPill = ({ icon: Icon, value, label, highlight }) => (
  <div
    className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border text-center min-w-[56px] ${
      highlight
        ? 'bg-emerald-900/20 border-emerald-800/40 text-emerald-400'
        : 'bg-surface-800/50 border-surface-700/50 text-gray-400'
    }`}
  >
    <span className={`text-sm font-bold font-display ${highlight ? '' : 'text-gray-200'}`}>
      {value}
    </span>
    <span className="text-[10px] opacity-70 mt-0.5">{label}</span>
  </div>
);

const QuestionCard = ({ question }) => {
  const { userData } = useUserData(question.authorId);

  const isAnswered = question.isAnswered || question.answersCount > 0;

  return (
    <Link to={`/questions/${question.id}`} className="block group">
      <div className="card-hover p-5 group-hover:shadow-lg group-hover:shadow-brand-900/10 transition-all duration-200">
        <div className="flex gap-4">
          {/* Stats column */}
          <div className="hidden sm:flex flex-col gap-2 flex-shrink-0">
            <StatPill
              icon={ChevronUp}
              value={question.votes ?? 0}
              label="votes"
              highlight={question.votes > 0}
            />
            <StatPill
              icon={MessageSquare}
              value={question.answersCount ?? 0}
              label="answers"
              highlight={isAnswered}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1.5">
              {question.isAnswered && (
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              )}
              <h2 className="text-base font-semibold text-gray-100 group-hover:text-brand-300 transition-colors leading-snug line-clamp-2">
                {question.title}
              </h2>
            </div>

            <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
              {question.description?.replace(/[#*`]/g, '')}
            </p>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <TagList tags={question.tags} />

              <div className="flex items-center gap-3 ml-auto">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Eye size={12} />
                  <span>{question.views ?? 0}</span>
                </div>
                <UserMeta
                  userId={question.authorId}
                  displayName={userData?.displayName}
                  photoURL={userData?.photoURL}
                  timestamp={question.createdAt}
                  prefix="asked"
                />
              </div>
            </div>

            {/* Mobile stats */}
            <div className="flex gap-3 mt-3 sm:hidden text-xs text-gray-500">
              <span>{question.votes ?? 0} votes</span>
              <span>{question.answersCount ?? 0} answers</span>
              <span>{question.views ?? 0} views</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;
