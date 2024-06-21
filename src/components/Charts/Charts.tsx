import styles from '@/components/Charts/Charts.less';
import SectionTitle from '@/components/Layout/SectionTitle/SectionTitle';
import { TimeSpans } from '@/constants';
import { getValueColor } from '@/utils/color';
import { compactNumber, prefixNumber } from '@/utils/format';
import { getNDaysAgo } from '@/utils/time';
import { useCallback, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';

export interface ChartsStatusProps {
  loading?: boolean;
  statusType: 'default' | 'amplitude' | 'percentage';
  total?: number;
  hour?: number;
  day?: number;
  week?: number;
  month?: number;
}

export interface ChartPanelProps {
  loading?: boolean;
  title: {
    icon: React.ReactNode;
    name: string;
  };
  status?: ChartsStatusProps;
  chart?: React.ReactNode;
}

export interface ChartModuleProps {
  loading?: boolean;
  statisticData?: {
    total?: number;
    hour?: number;
    day?: number;
    week?: number;
    month?: number;
  };
  chartData?: number[];
}

export const ChartStatus = ({
  loading,
  statusType,
  total,
  hour,
  day,
  week,
  month,
}: ChartsStatusProps) => {
  const data: Record<TimeSpan, number | undefined> = { hour, day, week, month };

  const renderValue = useCallback(
    (value: number) => {
      switch (statusType) {
        case 'default':
          return compactNumber(value);
        case 'amplitude':
          return `${prefixNumber(Math.round(value * 100))}%`;
        case 'percentage':
          return `${prefixNumber(value)}%`;
      }
    },
    [statusType],
  );

  const skeletonItem = useMemo(
    () => (
      <div className={styles.detailItem}>
        <Skeleton width={32} height={14} style={{ marginBottom: 4 }} />
        <Skeleton width={44} height={16} style={{ height: 16 }} />
      </div>
    ),
    [],
  );

  return (
    <div className={styles.valueRow}>
      <div className={styles.details}>
        {loading ? (
          <>
            {skeletonItem}
            {skeletonItem}
            {skeletonItem}
          </>
        ) : (
          <>
            {TimeSpans.map((e) =>
              data[e.value] === undefined ? null : (
                <div key={e.value} className={styles.detailItem}>
                  <div className={styles.label}>{e.label}</div>
                  <div
                    className={styles.value}
                    style={
                      statusType !== 'default'
                        ? { color: getValueColor(data[e.value]!) }
                        : {}
                    }
                  >
                    {renderValue(data[e.value]!)}
                  </div>
                </div>
              ),
            )}
          </>
        )}
      </div>
      {total !== undefined && (
        <div className={styles.total}>{total.toLocaleString('en-US')}</div>
      )}
    </div>
  );
};

export const ChartPanel = ({
  loading = false,
  title,
  status,
  chart,
}: ChartPanelProps) => {
  return (
    <div className={styles.chartContainer}>
      {loading ? (
        <Skeleton width={97} height={16} style={{ marginBottom: 8 }} />
      ) : (
        <div className={styles.chartTitle}>
          <SectionTitle title={title.name} icon={title.icon} />
          {!status && (
            <div style={{ color: 'rgba(255, 255, 255,  0.95)' }}>
              Coming soon
            </div>
          )}
        </div>
      )}
      <ChartStatus loading={loading} {...status} />
      {loading ? <Skeleton width={248} height={120} /> : chart}
    </div>
  );
};

export function parseChartData(values: number[], base?: string) {
  const count = values.length;
  return values.map((e, index) => ({
    type: getNDaysAgo(count - index - 1, base),
    value: e,
  }));
}
