import Settings from '@/components/Layout/Header/Settings/Settings';
import ListItem from '@/components/ListItem/ListItem';
import TimeTabs from '@/components/TimeTabs/TimeTabs';
import { TimeSpans } from '@/constants';
import { querySearchKeywords } from '@/services/apis';
import { getValueColor } from '@/utils/color';
import { prefixNumber } from '@/utils/format';
import { useModel } from '@@/exports';
import {
  CalendarOutlined,
  CloseOutlined,
  DoubleRightOutlined,
  NumberOutlined,
  StockOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  DatePicker,
  Empty,
  Popover,
  Select,
  Space,
  Tooltip,
} from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styles from './Header.less';

const Trends = ({
  open,
  defaultTimeDimension,
  onClose,
}: {
  open: boolean;
  defaultTimeDimension: TimeSpan;
  onClose: VoidFunction;
}) => {
  const { setCurrentHotPoint } = useModel('hotpoints', (state) => ({
    setCurrentHotPoint: state.setCurrentHotPoint,
  }));
  const { hotPointsSortByGrowth } = useModel('group', (state) => ({
    hotPointsSortByGrowth: state.hotPointsSortByGrowth,
  }));

  const [tab, setTab] = useState<TimeSpan>(
    TimeSpans.find((e) => e.enabled)?.value || 'day',
  );

  useEffect(() => {
    if (!open) {
      setTab(defaultTimeDimension);
    }
  }, [open, defaultTimeDimension]);

  return (
    <div className={styles.trendsCard}>
      <div className={classNames(styles.alignCenter, styles.spaceBetween)}>
        <TimeTabs value={tab} onChange={(tab) => setTab(tab)} />
        <Button
          type={'text'}
          size={'small'}
          icon={<CloseOutlined />}
          onClick={onClose}
        />
      </div>
      {hotPointsSortByGrowth[tab].length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        hotPointsSortByGrowth[tab].map((e) => (
          <ListItem<any>
            key={e.name}
            onClick={() => setCurrentHotPoint(e.name)}
            data={e}
            title={e.name}
            icon={<NumberOutlined />}
            rightContent={
              <div
                className={styles.trendsValue}
                style={{ color: getValueColor(e.growth || 0) }}
              >
                {!e.growth
                  ? '-'
                  : `${prefixNumber(Math.round(e.growth * 100))}%`}
              </div>
            }
          />
        ))
      )}
    </div>
  );
};

interface HeaderProps {
  title: string;
  dashboardOpen: boolean;
  onOpenDashboard: VoidFunction;
}

export default function Header({
  title,
  dashboardOpen,
  onOpenDashboard,
}: HeaderProps) {
  const { currentApplication, date, setDate, timeSpan, setTimeSpan } = useModel(
    'application',
    (state) => ({
      currentApplication: state.currentApplication,
      date: state.date,
      setDate: state.setDate,
      timeSpan: state.timeSpan,
      setTimeSpan: state.setTimeSpan,
    }),
  );
  const { currentGroup } = useModel('group', (state) => ({
    currentGroup: state.currentGroup,
  }));
  const { setCurrentHotPoint } = useModel('hotpoints', (state) => ({
    setCurrentHotPoint: state.setCurrentHotPoint,
  }));

  const [trendsOpen, setTrendsOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    setSearchKeyword(undefined);
  }, [currentApplication, currentGroup]);

  const { data: searchResult } = useRequest(
    async () => {
      if (!searchKeyword || !currentApplication || !currentGroup) return [];
      return (
        await querySearchKeywords({
          datasource: currentApplication.type,
          groupIds:
            typeof currentGroup === 'string' ? [currentGroup] : currentGroup,
          keyword: searchKeyword,
          limit: 8,
        })
      ).map((e) => ({
        value: e,
        label: e,
      }));
    },
    {
      refreshDeps: [searchKeyword],
      throttleWait: 1000,
    },
  );

  return (
    <div className={styles.header}>
      <Space>
        {!dashboardOpen && (
          <Tooltip title={'Expand'} placement={'right'}>
            <div className={styles.expandButton} onClick={onOpenDashboard}>
              <DoubleRightOutlined />
            </div>
          </Tooltip>
        )}
        {title}
      </Space>
      <div className={styles.alignCenter}>
        {/*<TimeTabs value={timeSpan} onChange={(tab) => setTimeSpan(tab)} />*/}
        <Space size={0} align={'center'}>
          <CalendarOutlined />
          <DatePicker
            allowClear={false}
            showToday={false}
            suffixIcon={null}
            bordered={false}
            disabledDate={(currentDate) =>
              currentDate.isAfter(dayjs().subtract(1, 'day').startOf('day'))
            }
            value={dayjs(date)}
            onChange={(e, s) => {
              setDate(s);
            }}
          />
        </Space>
        <Popover
          open={trendsOpen}
          onOpenChange={(open) => {
            if (open) {
              setTrendsOpen(open);
            }
          }}
          trigger={['click']}
          content={
            <Trends
              open={trendsOpen}
              defaultTimeDimension={timeSpan}
              onClose={() => setTrendsOpen(false)}
            />
          }
        >
          <div className={classNames(styles.alignCenter, styles.trendsButton)}>
            <StockOutlined style={{ marginRight: 4 }} />
            Trends
          </div>
        </Popover>

        <Select
          allowClear={true}
          showSearch={true}
          value={searchKeyword as any}
          style={{ width: 200, marginLeft: 24 }}
          placeholder={'Search for hot topics'}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={(e) => {
            setSearchKeyword(e);
          }}
          onSelect={(e) => {
            setCurrentHotPoint(e);
          }}
          onClear={() => {
            setSearchKeyword(undefined);
          }}
          notFoundContent={null}
          options={(searchResult as any) || []}
        />

        <Settings />
      </div>
    </div>
  );
}
