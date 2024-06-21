import AddToWatchlistModal from '@/components/AddToWatchlistModal/AddToWatchlistModal';
import ActiveUserChart from '@/components/Charts/ActiveUserChart/ActiveUserChart';
import PostChart from '@/components/Charts/PostChart/PostChart';
import CustomModal from '@/components/CustomModal/CustomModal';
import { globalModal } from '@/layouts';
import { useModel } from '@@/exports';
import {
  CloseOutlined,
  DoubleLeftOutlined,
  DownOutlined,
  FireFilled,
  NumberOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Col, Dropdown, Row, Skeleton, Tooltip, message } from 'antd';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import styles from './Dashboard.less';

const HotValueColors = ['#FADB14', '#FAAD14', '#FA8C16', '#FA541C', '#F5222D'];

const Section = ({
  active,
  title,
  titleSelectable = false,
  onTitleClick = () => {},
  items,
  onItemClick,
  showAddButton = true,
  onAddButtonClick = () => {},
  onRemoveSubscription = async () => {},
  defaultCollapsed = false,
}: {
  active: boolean;
  title: string;
  titleSelectable?: boolean;
  onTitleClick?: VoidFunction;
  items: { group_id: string; name: string; level: number; isApply: boolean }[];
  onItemClick: (groupId: string) => void;
  showAddButton?: boolean;
  onAddButtonClick?: VoidFunction;
  onRemoveSubscription?: (groupId: string) => Promise<void>;
  defaultCollapsed?: boolean;
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    if (!active) {
      setActiveItem('');
    }
  }, [active]);

  return (
    <div className={classNames(styles.section)}>
      <div
        className={classNames(styles.sectionTitle, {
          [styles.sectionTitleSelectable]: titleSelectable,
          [styles.sectionTitleSelected]:
            titleSelectable && active && !activeItem,
        })}
        onClick={() => {
          onTitleClick();
          setActiveItem('');
        }}
      >
        <div className={styles.alignCenter}>
          <DownOutlined
            className={classNames(styles.collapseButton, {
              [styles.collapseButtonCollapsed]: collapsed,
            })}
            onClick={() => setCollapsed((e) => !e)}
          />
          {title}
        </div>
        {showAddButton && (
          <PlusOutlined
            className={styles.titleButton}
            onClick={onAddButtonClick}
          />
        )}
      </div>
      {!collapsed && (
        <div>
          {items.map((e) => (
            <Tooltip key={e.group_id} title={e.name} placement={'topLeft'}>
              <Dropdown
                menu={{
                  items: [
                    {
                      label: <a>Unsubscribe</a>,
                      key: 'unsubscribe ',
                      icon: <CloseOutlined />,
                    },
                  ],
                  onClick: (event) => {
                    switch (event.key) {
                      case 'unsubscribe ':
                        globalModal.confirm({
                          title: 'CONFIRM',
                          content: `Are you sure to cancel your subscription to ${e.name}?`,
                          centered: true,
                          onOk: async () => {
                            await onRemoveSubscription(e.group_id);
                          },
                        });
                        break;
                    }
                  },
                }}
                disabled={e.isApply}
                trigger={['contextMenu']}
              >
                <Row
                  className={classNames(styles.sectionItem, {
                    [styles.sectionItemActive]: activeItem === e.group_id,
                    [styles.sectionItemPending]: e.isApply,
                  })}
                  onClick={() => {
                    if (!e.isApply) {
                      onItemClick(e.group_id);
                      setActiveItem(e.group_id);
                    }
                  }}
                  wrap={false}
                >
                  <Col className={styles.alignCenter} flex={'auto'}>
                    <NumberOutlined style={{ marginRight: 6 }} />
                    <div className={styles.sectionItemName}>{e.name}</div>
                  </Col>
                  {e.isApply ? (
                    <div>Pending</div>
                  ) : e.level > 0 ? (
                    <Col
                      flex={'74px'}
                      style={{
                        color: HotValueColors[e.level - 1],
                        textAlign: 'right',
                      }}
                    >
                      {new Array(e.level).fill(0).map((_, index) => (
                        <FireFilled key={`${e.group_id}_hot_${index}`} />
                      ))}
                    </Col>
                  ) : undefined}
                </Row>
              </Dropdown>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Dashboard({
  open,
  onClose,
}: {
  open: boolean;
  onClose: VoidFunction;
}) {
  const {
    currentApplication,
    overviewList,
    watchlist,
    userApply,
    runCancelSubscription,
    dashboardGroupLoading,
    dashboardGroupError,
  } = useModel('application', (state) => ({
    currentApplication: state.currentApplication,
    overviewList: state.overviewList,
    watchlist: state.watchlist,
    userApply: state.userApply,
    runCancelSubscription: state.runCancelSubscription,
    dashboardGroupLoading: state.dashboardGroupLoading,
    dashboardGroupError: state.dashboardGroupError,
  }));
  const { currentGroup, setCurrentGroup, groupInfo, groupInfoLoading } =
    useModel('group', (state) => ({
      currentGroup: state.currentGroup,
      setCurrentGroup: state.setCurrentGroup,
      groupInfo: state.groupInfo,
      groupInfoLoading: state.groupInfoLoading,
    }));

  const [_message, messageContextHolder] = message.useMessage();

  const [activeSection, setActiveSection] = useState<
    'overview' | 'watchlist' | 'custom'
  >('overview');
  const [addToWatchlistModalOpen, setAddToWatchlistModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);

  const overviewItems = useMemo(
    () =>
      overviewList.map((e) => ({
        name: e.name,
        group_id: e.group_id,
        level: e.active.level,
        isApply: false,
      })),
    [overviewList],
  );

  const watchlistItems = useMemo(
    () => [
      ...watchlist.map((e) => ({
        name: e.name,
        group_id: e.group_id,
        level: e.active.level,
        isApply: false,
      })),
      ...userApply.map((e) => ({
        name: e.data.name,
        group_id: `apply_${e.id}`,
        level: 0,
        isApply: true,
      })),
    ],
    [watchlist, userApply],
  );

  return (
    <SkeletonTheme
      baseColor="#3e3e3e"
      highlightColor="rgba(255, 255, 255, 0.18)"
    >
      <div
        className={classNames(styles.dashboard, {
          [styles.dashboardCollapsed]: !open,
        })}
      >
        <div
          className={styles.applicationHeader}
          style={{ display: !open ? 'none' : 'flex' }}
        >
          <div className={styles.applicationName}>
            {currentApplication?.name}
          </div>
          <Tooltip title={'Fold up'} placement={'right'}>
            <Button
              size={'small'}
              type={'text'}
              icon={<DoubleLeftOutlined />}
              onClick={onClose}
            />
          </Tooltip>
        </div>
        <div
          className={styles.dashboardContent}
          style={{ display: !open ? 'none' : 'block' }}
        >
          <Skeleton
            loading={dashboardGroupLoading || dashboardGroupError}
            title={false}
            active={true}
            paragraph={{ width: 248, rows: 4 }}
          >
            <Section
              active={activeSection === 'overview'}
              title={'Overview'}
              titleSelectable={true}
              onTitleClick={() => {
                setActiveSection('overview');
                setCurrentGroup(currentApplication.overviewGroups);
              }}
              items={overviewItems}
              onItemClick={(groupId) => {
                setActiveSection('overview');
                setCurrentGroup(groupId);
              }}
              showAddButton={false}
              defaultCollapsed={false}
            />
            <Section
              active={activeSection === 'watchlist'}
              title={'Watchlist'}
              items={watchlistItems}
              onItemClick={(groupId) => {
                setActiveSection('watchlist');
                setCurrentGroup(groupId);
              }}
              onAddButtonClick={() => setAddToWatchlistModalOpen(true)}
              onRemoveSubscription={async (groupId) => {
                await runCancelSubscription(groupId);
              }}
            />
            <Section
              active={activeSection === 'custom'}
              title={'Custom'}
              items={[]}
              onItemClick={() => {
                setActiveSection('custom');
              }}
              onAddButtonClick={() => setCustomModalOpen(true)}
              defaultCollapsed={true}
            />
          </Skeleton>
        </div>
        {typeof currentGroup === 'string' && (
          <div
            className={styles.dashboardChartContainer}
            style={{ display: !open ? 'none' : 'block' }}
          >
            <PostChart
              loading={groupInfoLoading || !groupInfo}
              chartData={groupInfo?.active.dayMsgsHistory}
              statisticData={
                groupInfo && {
                  day: groupInfo.active.todayMsgs,
                  week: groupInfo.active.weekMsgs,
                  month: groupInfo.active.monthMsgs,
                }
              }
            />
            {/*<SubscriberChart loading={groupInfoLoading}>*/}
            <ActiveUserChart
              loading={groupInfoLoading || !groupInfo}
              chartData={groupInfo?.active.dauHistory}
              statisticData={
                groupInfo && {
                  day: groupInfo.active.dau,
                  week: groupInfo.active.wau,
                  month: groupInfo.active.mau,
                }
              }
            />
          </div>
        )}
        {currentApplication && (
          <>
            <AddToWatchlistModal
              open={addToWatchlistModalOpen}
              onCancel={() => setAddToWatchlistModalOpen(false)}
            />
            <CustomModal
              open={customModalOpen}
              onCancel={() => setCustomModalOpen(false)}
            />
          </>
        )}
        {messageContextHolder}
      </div>
    </SkeletonTheme>
  );
}
