import { useEffect, useState } from 'react';
import { Droplets, Flame, Footprints, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogModal from '../components/LogModal';
import TrainerChat from '../components/TrainerChat';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const cardClass = 'bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6';
const metricIconClass = 'flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10';

function getLocalDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

function MetricCard({ title, value, description, icon: Icon, isLoading, delayClass = '' }) {
  const cardRevealClass = isLoading ? 'translate-y-3 opacity-90' : 'translate-y-0 opacity-100';

  return (
    <article
      className={`${cardClass} min-h-48 transform transition-all duration-700 ease-out ${delayClass} ${cardRevealClass}`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">{title}</p>
        <div className={metricIconClass}>
          <Icon className="h-5 w-5 text-blue-200" strokeWidth={1.8} />
        </div>
      </div>
      <div className="mt-8">
        {isLoading ? (
          <div className="h-12 w-32 animate-pulse rounded-2xl bg-white/10" />
        ) : (
          <p className="text-5xl font-bold tracking-tight">{formatNumber(value)}</p>
        )}
        <p className="mt-3 text-sm text-white/50">{description}</p>
      </div>
    </article>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [todaySteps, setTodaySteps] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorMessage('');

    const [summaryResult, achievementsResult, stepsResult] = await Promise.allSettled([
      api.get('/dashboard/daily'),
      api.get('/achievements'),
      api.get('/steps'),
    ]);

    if (summaryResult.status === 'fulfilled') {
      setSummary(summaryResult.value.data);
    }

    if (achievementsResult.status === 'fulfilled') {
      const achievementData = achievementsResult.value.data;
      setAchievements(Array.isArray(achievementData) ? achievementData : []);
    }

    if (stepsResult.status === 'fulfilled') {
      const today = getLocalDateString();
      const stepLogs = Array.isArray(stepsResult.value.data) ? stepsResult.value.data : [];
      const todayStepLog = stepLogs.find((stepLog) => stepLog.date === today);
      setTodaySteps(todayStepLog?.stepCount ?? 0);
    }

    if (
      summaryResult.status === 'rejected' ||
      achievementsResult.status === 'rejected' ||
      stepsResult.status === 'rejected'
    ) {
      setErrorMessage('Failed to load some dashboard data. Showing everything available.');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const caloriesConsumed = summary?.caloriesConsumed ?? 0;
  const waterConsumedMl = summary?.waterConsumedMl ?? 0;
  const achievementCardRevealClass = isLoading ? 'translate-y-3 opacity-90' : 'translate-y-0 opacity-100';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.32),_transparent_34%),linear-gradient(135deg,_#020617_0%,_#09090b_48%,_#000000_100%)] text-white">
      <header className="px-8 pt-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200/70">
              Dashboard
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Welcome, {user?.email || 'User'}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-white/55">
              Your daily health signals, progress, and achievements in one polished command center.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white/80 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto mt-8 flex max-w-7xl flex-wrap gap-3 px-8">
        <button
          type="button"
          onClick={() => setActiveModal('water')}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:scale-[1.02] hover:bg-blue-700"
        >
          Log Water
        </button>
        <button
          type="button"
          onClick={() => setActiveModal('diet')}
          className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white/85 backdrop-blur-md transition hover:scale-[1.02] hover:bg-white/15 hover:text-white"
        >
          Log Diet
        </button>
      </div>

      {errorMessage && (
        <div className="mx-auto mt-6 max-w-7xl px-8">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-100/90 backdrop-blur-md">
            {errorMessage}
          </div>
        </div>
      )}

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-8 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Today's Calories"
          value={caloriesConsumed}
          description="Calories consumed today"
          icon={Flame}
          isLoading={isLoading}
        />

        <MetricCard
          title="Water Intake"
          value={waterConsumedMl}
          description="Milliliters logged today"
          icon={Droplets}
          isLoading={isLoading}
          delayClass="delay-75"
        />

        <MetricCard
          title="Steps"
          value={todaySteps}
          description="Steps logged today"
          icon={Footprints}
          isLoading={isLoading}
          delayClass="delay-150"
        />

        <article
          className={`${cardClass} transform transition-all duration-700 ease-out md:col-span-2 lg:col-span-3 delay-200 ${achievementCardRevealClass}`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className={metricIconClass}>
                  <Trophy className="h-5 w-5 text-blue-200" strokeWidth={1.8} />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
                  Recent Achievements
                </p>
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                {isLoading ? 'Loading badges' : `${achievements.length} earned badges`}
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading && (
              <>
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
                    <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-white/10" />
                    <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-white/10" />
                  </div>
                ))}
              </>
            )}

            {!isLoading &&
              achievements.slice(0, 6).map((achievement) => (
                <div
                  key={achievement.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <p className="font-semibold tracking-tight">{achievement.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/50">{achievement.description}</p>
                </div>
              ))}

            {!isLoading && achievements.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/55">
                No achievements earned yet.
              </div>
            )}
          </div>
        </article>
      </section>

      <TrainerChat />

      <LogModal
        isOpen={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        type={activeModal}
        onSuccess={fetchDashboardData}
      />
    </main>
  );
}

export default DashboardPage;
