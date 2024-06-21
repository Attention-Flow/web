import '@umijs/max/typings';

declare global {
  type TimeSpan = 'hour' | 'day' | 'week' | 'month';

  type Application = {
    type: API.Datasource;
    icon: string;
    iconStyle?: React.CSSProperties;
    name: string;
    path: string;
    enabled: boolean;
    overviewGroups: string[];
  };

  namespace API {
    type ApplyStatus = 'FINISHED' | 'PENDING' | 'REJECTED';

    type Datasource =
      | 'Lens'
      | 'Telegram'
      | 'Discord'
      | 'Twitter'
      | 'Reddit'
      | 'Farcaster'
      | 'Youtube';

    type ApplyType = 'NEW_GROUP';

    type GroupActive = {
      datasource: Datasource;
      dau: number;
      dauHistory: number[];
      dayMsgsHistory: number[];
      group_id: string;
      level: number;
      mau: number;
      monthMsgs: number;
      todayMsgs: number;
      wau: number;
      weekMsgs: number;
    };

    type GlobalGroupIdInput = {
      datasource: Datasource;
      group_id: string;
    };

    type GroupSubscription = {
      active: GroupActive;
      datasource: Datasource;
      group_id: string;
      name: string;
      user_id: string;
    };

    type HistoricalMetric = {
      end_to: string;
      metric: number;
      start_from: string;
    };

    type Hotpoint = {
      growth: number | null;
      hot: number;
      name: string;
    };

    type Message = {
      date: string;
      from_id: string;
      group_id: string;
      message: string;
      msg_id: string;
    };

    type NewGroupApply = {
      datasource: Datasource;
      group_id: string;
      name: string;
    };

    type ApplyData = NewGroupApply;

    type SmaGroup = {
      active: GroupActive;
      datasource: Datasource;
      group_id: string;
      name: string;
    };

    type TimeRange = {
      end_to: string;
      start_from: string;
    };

    type User = {
      avatarUrl: string;
      id: string;
      username: string;
    };

    type UserApply = {
      data: ApplyData;
      id: string;
      status: ApplyStatus;
      type: ApplyType;
      userId: string;
    };

    type HotPointStatistics = {
      dayIncr: number;
      hourIncr: number;
      monthIncr: number;
      weekIncr: number;
    };

    type KeywordSummary = {
      datasource: Datasource;
      end_to: string;
      keyword: string;
      start_from: string;
      summary: string;
    };
  }
}
