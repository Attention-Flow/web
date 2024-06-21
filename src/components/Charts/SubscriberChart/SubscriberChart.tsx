import { ChartModuleProps, ChartPanel } from '@/components/Charts/Charts';
import { Area } from '@ant-design/charts';
import { TeamOutlined } from '@ant-design/icons';

export default function SubscriberChart({
  statisticData,
  loading,
}: ChartModuleProps) {
  const data = [
    {
      type: '10 May',
      value: 38,
    },
    {
      type: '11 May',
      value: 52,
    },
    {
      type: '12 May',
      value: 61,
    },
    {
      type: '13 May',
      value: 74,
    },
    {
      type: '14 May',
      value: 79,
    },
    {
      type: '15 May',
      value: 70,
    },
    {
      type: '16 May',
      value: 88,
    },
    {
      type: '17 May',
      value: 99,
    },
  ];

  const config = {
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
        alias: 'Subscribers',
      },
    },
    smooth: true,
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#141414 0.5:#1554ad 1:#1890ff',
      };
    },
  };

  return (
    <ChartPanel
      loading={loading}
      title={{ icon: <TeamOutlined />, name: 'Subscribers' }}
      status={{ today: 0, week: 0, month: 0, statusType: 'amplitude' }}
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
