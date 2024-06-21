import { Assistant } from '@/components/Assistant/Assistant';
import TrendsChart from '@/components/Charts/TrendsChart/TrendsChart';
import SectionTitle from '@/components/Layout/SectionTitle/SectionTitle';
import { queryKeywordSummary } from '@/services/apis';
import { getUtcTimeRange } from '@/utils/time';
import { useModel } from '@@/exports';
import { BulbOutlined, RobotOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Drawer, Skeleton, Typography } from 'antd';
import { MacScrollbar } from 'mac-scrollbar';
import { SkeletonTheme } from 'react-loading-skeleton';
import styles from './TopicDrawer.less';

export default function TopicDrawer() {
  const { currentApplication, date } = useModel('application', (state) => ({
    currentApplication: state.currentApplication,
    date: state.date,
  }));
  const { currentGroup } = useModel('group', (state) => ({
    currentGroup: state.currentGroup,
  }));
  const {
    currentHotPoint,
    setCurrentHotPoint,
    relatedMessages,
    relatedMessagesLoading,
    hotpointStatistics,
    hotpointStatisticsLoading,
    hotPointTrends,
    hotPointTrendsLoading,
  } = useModel('hotpoints', (state) => ({
    currentHotPoint: state.currentHotPoint,
    setCurrentHotPoint: state.setCurrentHotPoint,
    relatedMessages: state.relatedMessages,
    relatedMessagesLoading: state.relatedMessagesLoading,
    hotpointStatistics: state.hotpointStatistics,
    hotpointStatisticsLoading: state.hotpointStatisticsLoading,
    hotPointTrends: state.hotPointTrends,
    hotPointTrendsLoading: state.hotPointTrendsLoading,
  }));

  const { data: aiSummary, loading: aiSummaryLoading } = useRequest(
    async () => {
      if (!date || !currentHotPoint) return;

      const { start, end } = getUtcTimeRange(date);
      return await queryKeywordSummary({
        datasource: currentApplication.type,
        start_from: start.toISOString(),
        end_to: end.toISOString(),
        keyword: currentHotPoint,
      });
    },
    {
      refreshDeps: [date, currentHotPoint],
      retryInterval: 1000,
      retryCount: -1,
    },
  );

  // const messageSkeleton = useMemo(
  //   () =>
  //     new Array(3)
  //       .fill(0)
  //       .map((e, index) => (
  //         <Skeleton
  //           key={`message_skeleton_${index}`}
  //           width={318}
  //           height={68}
  //           style={{ marginBottom: 8 }}
  //         />
  //       )),
  //   [],
  // );

  return (
    <SkeletonTheme
      baseColor="#3e3e3e"
      highlightColor="rgba(255, 255, 255, 0.18)"
    >
      <Drawer
        zIndex={2000}
        open={!!currentHotPoint}
        width={350}
        maskClosable={true}
        closable={false}
        onClose={() => setCurrentHotPoint('')}
        bodyStyle={{ padding: 0 }}
      >
        <div className={styles.title}>{currentHotPoint}</div>
        <MacScrollbar
          style={{
            padding: 16,
            paddingTop: 66,
            overflowY: 'auto',
            height: '100vh',
          }}
          skin={'dark'}
        >
          <div className={styles.section}>
            <SectionTitle
              title={'AI Summary'}
              icon={<BulbOutlined />}
              style={{ marginBottom: 8 }}
            />
            {aiSummaryLoading || !aiSummary ? (
              <Skeleton
                key={`message_skeleton_ai_summary`}
                width={318}
                height={68}
              />
            ) : (
              <Typography.Paragraph
                ellipsis={{
                  rows: 5,
                  expandable: true,
                }}
                className={styles.aiSummary}
              >
                {aiSummary}
              </Typography.Paragraph>
            )}
          </div>
          <div className={styles.section}>
            <TrendsChart
              loading={hotpointStatisticsLoading || hotPointTrendsLoading}
              statisticData={
                hotpointStatistics && {
                  hour: hotpointStatistics.hourIncr,
                  day: hotpointStatistics.dayIncr,
                  week: hotpointStatistics.weekIncr,
                  month: hotpointStatistics.monthIncr,
                }
              }
            />
          </div>
          <div className={styles.section}>
            <SectionTitle
              title={'AI Assistant'}
              icon={<RobotOutlined />}
              style={{ marginBottom: 8 }}
            />
            {currentApplication && currentHotPoint && (
              <Assistant
                key={`${currentApplication.type}.${
                  Array.isArray(currentGroup) ? 'overview' : currentGroup
                }.${date}.${currentHotPoint}`}
                date={date}
                hotPoint={currentHotPoint}
                application={currentApplication.type}
                group={currentGroup}
              />
            )}
          </div>
          {/*<div className={styles.section}>*/}
          {/*  <SectionTitle*/}
          {/*    title={'Relevant Contents'}*/}
          {/*    icon={<AlignLeftOutlined />}*/}
          {/*    style={{ marginBottom: 8 }}*/}
          {/*  />*/}
          {/*  <div className={styles.contentList}>*/}
          {/*    {relatedMessagesLoading*/}
          {/*      ? messageSkeleton*/}
          {/*      : relatedMessages.map((e) => (*/}
          {/*          <div key={`message_${e.msg_id}`} className={styles.content}>*/}
          {/*            <Typography.Paragraph*/}
          {/*              ellipsis={{ rows: 3, expandable: true }}*/}
          {/*              className={styles.desc}*/}
          {/*            >*/}
          {/*              {e.message}*/}
          {/*            </Typography.Paragraph>*/}
          {/*            <Tooltip*/}
          {/*              zIndex={3000}*/}
          {/*              title={`Posted at ${new Date(*/}
          {/*                e.date,*/}
          {/*              ).toLocaleDateString()} ${new Date(*/}
          {/*                e.date,*/}
          {/*              ).toLocaleTimeString()}`}*/}
          {/*            >*/}
          {/*              <div className={styles.time}>*/}
          {/*                <TimeAgo*/}
          {/*                  opts={{ minInterval: 5 }}*/}
          {/*                  datetime={e.date}*/}
          {/*                  locale={'en_US'}*/}
          {/*                />*/}
          {/*              </div>*/}
          {/*            </Tooltip>*/}
          {/*          </div>*/}
          {/*        ))}*/}
          {/*  </div>*/}
          {/*</div>*/}
        </MacScrollbar>
      </Drawer>
    </SkeletonTheme>
  );
}
