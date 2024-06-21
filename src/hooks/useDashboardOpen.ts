import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

export const useDashboardOpen = () => {
  const [dashboardOpen, setDashboardOpen] = useState(true);

  const openDashboard = useMemoizedFn(() => {
    setDashboardOpen(true);
  });
  const closeDashboard = useMemoizedFn(() => {
    setDashboardOpen(false);
  });

  return {
    dashboardOpen,
    openDashboard,
    closeDashboard,
  };
};
