import { useEffect, useState } from 'react';
import api from '../services/api';

function getLocalDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function LogModal({ isOpen, onClose, type, onSuccess }) {
  const [amountInMl, setAmountInMl] = useState('');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmountInMl('');
      setFoodName('');
      setCalories('');
      setErrorMessage('');
    }
  }, [isOpen, type]);

  if (!isOpen) {
    return null;
  }

  const isWater = type === 'water';
  const title = isWater ? 'Log Water' : 'Log Diet';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (isWater) {
        await api.post('/water', {
          date: getLocalDateString(),
          amountMl: Number(amountInMl),
        });
      } else {
        await api.post('/diet', {
          date: getLocalDateString(),
          totalCalories: Number(calories),
          protein: 0,
          carbs: 0,
          fats: 0,
          notes: foodName,
        });
      }

      await onSuccess?.();
      onClose();
    } catch (error) {
      setErrorMessage('Unable to save this log. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-gray-900/90 p-8 text-white shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200/60">
              Quick Action
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isWater ? (
            <div>
              <label htmlFor="amountInMl" className="block text-sm font-semibold text-white/75">
                Amount in ml
              </label>
              <input
                id="amountInMl"
                type="number"
                min="1"
                value={amountInMl}
                onChange={(event) => setAmountInMl(event.target.value)}
                required
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-blue-500"
                placeholder="500"
              />
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="foodName" className="block text-sm font-semibold text-white/75">
                  Food name
                </label>
                <input
                  id="foodName"
                  type="text"
                  value={foodName}
                  onChange={(event) => setFoodName(event.target.value)}
                  required
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-blue-500"
                  placeholder="Grilled chicken bowl"
                />
              </div>

              <div>
                <label htmlFor="calories" className="block text-sm font-semibold text-white/75">
                  Calories
                </label>
                <input
                  id="calories"
                  type="number"
                  min="0"
                  value={calories}
                  onChange={(event) => setCalories(event.target.value)}
                  required
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-blue-500"
                  placeholder="650"
                />
              </div>
            </>
          )}

          {errorMessage && (
            <p className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-blue-600 px-4 py-4 font-bold tracking-tight text-white transition hover:scale-[1.02] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {isSubmitting ? 'Saving...' : 'Save Log'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LogModal;
