import { queryHotpointHistory, queryHotpointStatistics } from '@/services/apis';
import { useModel } from '@@/exports';
import { useRequest } from 'ahooks';
import moment from 'moment';
import { useState } from 'react';

const useHotpoints = () => {
  const { currentApplication, date } = useModel('application', (state) => ({
    currentApplication: state.currentApplication,
    date: state.date,
  }));
  const { currentGroup } = useModel('group', (state) => ({
    currentGroup: state.currentGroup,
  }));

  const [currentHotPoint, setCurrentHotPoint] = useState<string>('');

  const { data: relatedMessages, loading: relatedMessagesLoading } = useRequest(
    async () => {
      return [];
      // if (!currentHotPoint) return [];
      // const startFrom = moment().utc().subtract(6, 'month').startOf('day');
      // const endTo = moment().utc().add(1).startOf('day');
      // return queryRelatedMessages({
      //   datasource: currentApplication.type,
      //   targetIds:
      //     typeof currentGroup === 'string' ? [currentGroup] : currentGroup,
      //   keyword: currentHotPoint,
      //   endTo: endTo.toISOString(),
      //   startFrom: startFrom.toISOString(),
      // });
    },
    {
      refreshDeps: [currentHotPoint],
    },
  );

  const { data: hotpointStatistics, loading: hotpointStatisticsLoading } =
    useRequest(
      async () => {
        if (!currentHotPoint) return undefined;

        return queryHotpointStatistics({
          datasource: currentApplication.type,
          groupIds:
            typeof currentGroup === 'string' ? [currentGroup] : currentGroup,
          keyword: currentHotPoint,
          base: date,
        });
      },
      {
        refreshDeps: [currentHotPoint, date],
        loadingDelay: 300,
      },
    );

  const { data: hotPointTrends, loading: hotPointTrendsLoading } = useRequest(
    async () => {
      if (!currentHotPoint) return [];

      const startFrom = moment().utc().subtract(6, 'days').startOf('day');
      const endTo = moment().utc().add(1, 'day').startOf('day');

      return queryHotpointHistory({
        datasource: currentApplication.type,
        groupIds:
          typeof currentGroup === 'string' ? [currentGroup] : currentGroup,
        keyword: currentHotPoint,
        endTo: endTo.toISOString(),
        startFrom: startFrom.toISOString(),
      });
    },
    {
      refreshDeps: [currentHotPoint],
      loadingDelay: 300,
    },
  );

  return {
    currentHotPoint,
    setCurrentHotPoint,
    relatedMessages: relatedMessages || [],
    relatedMessagesLoading,
    hotpointStatistics,
    hotpointStatisticsLoading,
    hotPointTrends: hotPointTrends || [],
    hotPointTrendsLoading,
  };
};

export default useHotpoints;
