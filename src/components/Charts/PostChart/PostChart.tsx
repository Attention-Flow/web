import {
  ChartModuleProps,
  ChartPanel,
  parseChartData,
} from '@/components/Charts/Charts';
import { useModel } from '@@/exports';
import { Column } from '@ant-design/charts';
import { TagsFilled } from '@ant-design/icons';
import { useMemo } from 'react';

export default function PostChart({
  chartData,
  statisticData,
  loading,
}: ChartModuleProps) {
  const { date } = useModel('application', (state) => ({
    date: state.date,
  }));

  const data = useMemo(() => {
    if (chartData) {
      return parseChartData(chartData, date);
    } else {
      return [];
    }
  }, [chartData, date]);

  const config = useMemo(
    () => ({
      theme: 'dark',
      data,
      xField: 'type',
      yField: 'value',
      xAxis: false,
      // yAxis: false,
      legend: false,
      meta: {
        type: {
          alias: 'Date',
        },
        value: {
          alias: 'New Posts',
        },
      },
    }),
    [data],
  );

  return (
    <ChartPanel
      loading={loading}
      title={{ icon: <TagsFilled />, name: 'Posts' }}
      status={
        statisticData && {
          ...statisticData,
          statusType: 'default',
        }
      }
      chart={
        <Column
          style={{ borderRadius: 8, overflow: 'hidden' }}
          height={120}
          padding={0}
          {...config}
        />
      }
    />
  );
}
