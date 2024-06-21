import {
  ChartModuleProps,
  ChartPanel,
  parseChartData,
} from '@/components/Charts/Charts';
import { useModel } from '@@/exports';
import { Column } from '@ant-design/charts';
import { RiseOutlined } from '@ant-design/icons';
import { useMemo } from 'react';

export default function ActiveUserChart({
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
          alias: 'Active Users',
        },
      },
    }),
    [data],
  );

  return (
    <ChartPanel
      loading={loading}
      title={{ icon: <RiseOutlined />, name: 'Active Users' }}
      status={
        statisticData
          ? {
              ...statisticData,
              statusType: 'default',
            }
          : undefined
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
