import {
  ChartModuleProps,
  ChartPanel,
  parseChartData,
} from '@/components/Charts/Charts';
import { useModel } from '@@/exports';
import { Area } from '@ant-design/charts';
import { StockOutlined } from '@ant-design/icons';
import { useMemo } from 'react';

export default function TrendsChart({
  statisticData,
  chartData,
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
          alias: 'Interest',
        },
      },
      smooth: true,
      areaStyle: () => {
        return {
          fill: 'l(270) 0:#141414 0.5:#1554ad 1:#1890ff',
        };
      },
    }),
    [data],
  );

  return (
    <ChartPanel
      title={{ icon: <StockOutlined />, name: 'Trends' }}
      status={
        statisticData && {
          ...statisticData,
          statusType: 'amplitude',
        }
      }
      chart={
        <Area
          style={{ borderRadius: 8, overflow: 'hidden' }}
          height={120}
          padding={0}
          appendPadding={0}
          {...config}
        />
      }
    />
  );
}
