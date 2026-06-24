import { useEffect, useState } from 'react';

const BASELINE_DATA = {
  dailySteps: 7420,
  heartRate: 76,
  sleepQuality: 'Good',
};

const SLEEP_QUALITY = ['Excellent', 'Good', 'Fair'];

export default function useWearables() {
  const [wearableData, setWearableData] = useState(BASELINE_DATA);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWearableData((currentData) => {
        const stepDelta = Math.floor(Math.random() * 18);
        const heartRateDelta = Math.floor(Math.random() * 7) - 3;
        const nextHeartRate = Math.min(Math.max(currentData.heartRate + heartRateDelta, 62), 118);
        const nextSleepQuality = SLEEP_QUALITY[Math.floor(Math.random() * SLEEP_QUALITY.length)];

        return {
          dailySteps: currentData.dailySteps + stepDelta,
          heartRate: nextHeartRate,
          sleepQuality: nextSleepQuality,
        };
      });
    }, 3500);

    return () => clearInterval(intervalId);
  }, []);

  return wearableData;
}
