import { TimeSpans } from '@/constants';
import { queryGroupDetail, queryHotPoints } from '@/services/apis';
import { getUtcTimeRange } from '@/utils/time';
import { useModel } from '@@/exports';
import { useDeepCompareEffect, useLocalStorageState, useRequest } from 'ahooks';
import { useEffect, useMemo, useState } from 'react';

const useGroup = () => {
  const { currentApplication, date } = useModel('application', (state) => ({
    currentApplication: state.currentApplication,
    date: state.date,
  }));

  const [currentGroup, setCurrentGroup] = useState<string | string[]>([]);

  const [hotpointLimit, setHotpointLimit] = useLocalStorageState<number>(
    'hotpoint-limit',
    {
      defaultValue: 150,
    },
  );

  const {
    data: groupInfo,
    runAsync: runGroupInfo,
    loading: groupInfoLoading,
    mutate: mutateGroupInfo,
  } = useRequest(
    async (groupId: string) => {
      return await queryGroupDetail({
        input: { datasource: currentApplication.type, group_id: groupId },
        days: 14,
        base: date,
      });
    },
    {
      manual: true,
      loadingDelay: 300,
    },
  );

  useDeepCompareEffect(() => {
    if (typeof currentGroup === 'string') {
      runGroupInfo(currentGroup);
    } else {
      mutateGroupInfo(undefined);
    }
  }, [currentGroup, date]);

  useEffect(() => {
    setCurrentGroup(currentApplication?.overviewGroups);
    mutateGroupInfo(undefined);
  }, [currentApplication]);

  const { data: hotPoints, loading: hotPointsLoading } = useRequest(
    async () => {
      if (!currentGroup || !currentApplication)
        return {
          hour: [],
          day: [],
          week: [],
          month: [],
        };
      const hotPoints: Record<TimeSpan, API.Hotpoint[]> = {
        hour: [],
        day: [],
        week: [],
        month: [],
      };
      for (const timeSpan of TimeSpans) {
        if (timeSpan.enabled) {
          const groupIds =
            typeof currentGroup === 'string' ? [currentGroup] : currentGroup;
          // const endTo = moment().utc();
          // const startFrom = endTo.clone().subtract(1, timeSpan as any);
          const { start, end } = getUtcTimeRange(date);

          hotPoints[timeSpan.value] = (
            await queryHotPoints({
              datasource: currentApplication.type,
              groupIds,
              endTo: end.toISOString(),
              startFrom: start.toISOString(),
            })
          ).hotpoints;
        } else {
          hotPoints[timeSpan.value] = [];
        }
      }
      return hotPoints;
    },
    {
      refreshDeps: [currentGroup, date],
    },
  );

  const hotPointsSortByHot = useMemo(() => {
    const _hotPoints: Record<TimeSpan, API.Hotpoint[]> = {
      hour: [],
      day: [],
      week: [],
      month: [],
    };
    if (!hotPoints) return _hotPoints;

    for (const timeSpan of TimeSpans) {
      _hotPoints[timeSpan.value] = timeSpan.enabled
        ? hotPoints[timeSpan.value]
            .sort((a, b) => b.hot - a.hot)
            .slice(0, hotpointLimit)
        : [];
    }
    return _hotPoints;
  }, [hotPoints, hotpointLimit]);

  const hotPointsSortByGrowth = useMemo(() => {
    const _hotPoints: Record<TimeSpan, API.Hotpoint[]> = {
      hour: [],
      day: [],
      week: [],
      month: [],
    };
    if (!hotPoints) return _hotPoints;

    for (const timeSpan of TimeSpans) {
      _hotPoints[timeSpan.value] = timeSpan.enabled
        ? hotPoints[timeSpan.value]
            .sort((a, b) => b.growth - a.growth)
            .slice(0, 10)
        : [];
    }
    return _hotPoints;
  }, [hotPoints]);

  return {
    currentGroup,
    setCurrentGroup,
    groupInfo,
    groupInfoLoading,
    hotPoints: hotPoints || [],
    hotPointsLoading,
    hotPointsSortByHot,
    hotPointsSortByGrowth,
    hotpointLimit,
    setHotpointLimit,
  };
};

export default useGroup;
