import { TimeSpans } from '@/constants';
import { globalMessage } from '@/layouts';
import {
  mutationAddGroupSubscription,
  mutationApplyNewGroup,
  mutationRemoveGroupSubscription,
  queryGroupSubscriptions,
  queryOverviewGroups,
  queryUserApplies,
} from '@/services/apis';
import { useModel } from '@@/exports';
import { useRequest } from 'ahooks';
import moment from 'moment';
import { useMemo, useState } from 'react';

const useApplication = () => {
  const { currentUser } = useModel('user', (state) => ({
    currentUser: state.currentUser,
  }));

  const [currentApplication, setCurrentApplication] = useState<
    Application | undefined
  >(undefined);
  const [timeSpan, setTimeSpan] = useState<TimeSpan>(
    TimeSpans.find((e) => e.enabled)?.value || 'day',
  );
  const [date, setDate] = useState(
    moment().subtract(1, 'day').format('YYYY-MM-DD'),
    // '2023-07-20',
  );

  const {
    data: overviewList,
    loading: overviewListLoading,
    error: overviewListError,
  } = useRequest(
    async () => {
      if (!!currentApplication?.overviewGroups?.length) {
        return await queryOverviewGroups({
          input: currentApplication.overviewGroups.map((e) => ({
            datasource: currentApplication.type,
            group_id: e,
          })),
          base: date,
        });
      } else {
        return [];
      }
    },
    {
      refreshDeps: [currentApplication, date],
      loadingDelay: 300,
    },
  );

  const {
    data: watchlist,
    refreshAsync: refreshWatchlist,
    loading: watchlistLoading,
    error: watchlistError,
  } = useRequest(
    async () => {
      if (currentUser && currentApplication) {
        return await queryGroupSubscriptions({
          datasource: currentApplication.type,
        });
      } else {
        return [];
      }
    },
    {
      refreshDeps: [currentUser, currentApplication],
      loadingDelay: 300,
    },
  );

  const {
    data: userApply,
    refreshAsync: refreshUserApply,
    loading: userApplyLoading,
    error: userApplyError,
  } = useRequest(
    async () => {
      if (currentUser && currentApplication) {
        const applies = await queryUserApplies({
          status: 'PENDING',
          type: 'NEW_GROUP',
        });
        return applies.filter(
          (e) => e.data.datasource === currentApplication.type,
        );
      } else {
        return [];
      }
    },
    {
      refreshDeps: [currentUser, currentApplication],
      loadingDelay: 300,
    },
  );

  const dashboardGroupLoading = useMemo(
    () => overviewListLoading || watchlistLoading || userApplyLoading,
    [overviewListLoading, watchlistLoading, userApplyLoading],
  );

  const dashboardGroupError = useMemo(
    () => overviewListError || watchlistError || userApplyError,
    [overviewListError, watchlistError, userApplyError],
  );

  const { runAsync: runAddToWatchlist } = useRequest(
    async (groupId: string) => {
      try {
        await mutationAddGroupSubscription({
          datasource: currentApplication!.type,
          targetId: groupId,
        });
        globalMessage.success('Subscribe successfully!');
      } catch (e) {
        console.log(e);
        globalMessage.success('Subscribe failed!');
      } finally {
        await refreshWatchlist();
      }
    },
    {
      manual: true,
    },
  );

  const { runAsync: runCancelSubscription } = useRequest(
    async (groupId: string) => {
      try {
        await mutationRemoveGroupSubscription({
          datasource: currentApplication!.type,
          targetId: groupId,
        });
        globalMessage.success('Unsubscribe successfully!');
      } catch (e) {
        console.log(e);
        globalMessage.success('Unsubscribe failed!');
      } finally {
        await refreshWatchlist();
      }
    },
    {
      manual: true,
    },
  );

  const { runAsync: runRequestGroup } = useRequest(
    async (displayName: string, groupId: string) => {
      await mutationApplyNewGroup({
        datasource: currentApplication!.type,
        displayName,
        groupId,
      });
      await refreshUserApply();
    },
    {
      manual: true,
    },
  );

  return {
    timeSpan,
    setTimeSpan,
    currentApplication,
    setCurrentApplication,
    overviewList: overviewList || [],
    overviewListLoading,
    watchlist: watchlist || [],
    refreshWatchlist,
    watchlistLoading,
    userApply: userApply || [],
    userApplyLoading,
    dashboardGroupLoading,
    dashboardGroupError,
    runAddToWatchlist,
    runRequestGroup,
    runCancelSubscription,
    date,
    setDate,
  };
};

export default useApplication;
