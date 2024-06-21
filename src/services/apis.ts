import { client } from '@/services/index';
import { gql } from 'graphql-request';

export async function mutationAddGroupSubscription(params: {
  datasource: API.Datasource;
  targetId: string;
}) {
  return (
    await client.request<{ addGroupSubscription: API.GroupSubscription }>(
      gql`
        mutation addGroupSubscription(
          $datasource: Datasource!
          $target_id: String!
        ) {
          addGroupSubscription(datasource: $datasource, target_id: $target_id) {
            datasource
            group_id
            name
            user_id
          }
        }
      `,
      {
        datasource: params.datasource,
        target_id: params.targetId,
      },
    )
  ).addGroupSubscription;
}

export async function mutationApplyNewGroup(params: {
  datasource: API.Datasource;
  displayName: string;
  groupId: string;
}) {
  return (
    await client.request<{ applyNewGroup: API.UserApply }>(
      gql`
        mutation applyNewGroup(
          $datasource: Datasource!
          $displayName: String!
          $groupId: String!
        ) {
          applyNewGroup(
            datasource: $datasource
            displayName: $displayName
            groupId: $groupId
          ) {
            id
          }
        }
      `,
      params,
    )
  ).applyNewGroup;
}

export async function mutationRemoveGroupSubscription(params: {
  datasource: API.Datasource;
  targetId: string;
}) {
  return (
    await client.request<{ removeGroupSubscription: string }>(
      gql`
        mutation removeGroupSubscription(
          $datasource: Datasource!
          $target_id: String!
        ) {
          removeGroupSubscription(
            datasource: $datasource
            target_id: $target_id
          )
        }
      `,
      {
        datasource: params.datasource,
        target_id: params.targetId,
      },
    )
  ).removeGroupSubscription;
}

export async function queryAnalysedTimeRange(params: {
  datasource: API.Datasource;
  targetId: string;
}) {
  return (
    await client.request<{ analysedTimeRange: API.TimeRange }>(
      gql`
        query analysedTimeRange($datasource: Datasource!, $target_id: String!) {
          analysedTimeRange(datasource: $datasource, target_id: $target_id) {
            end_to
            start_from
          }
        }
      `,
      {
        datasource: params.datasource,
        target_id: params.targetId,
      },
    )
  ).analysedTimeRange;
}

// analysisWindow

export async function queryCurrentUser() {
  return (
    await client.request<{ currentUser: API.User }>(gql`
      query currentUser {
        currentUser {
          avatarUrl
          id
          username
        }
      }
    `)
  ).currentUser;
}

export async function queryGroupSubscriptions(params: {
  datasource: API.Datasource;
}) {
  return (
    await client.request<{ groupSubscriptions: API.GroupSubscription[] }>(
      gql`
        query groupSubscriptions($datasource: Datasource) {
          groupSubscriptions(datasource: $datasource) {
            active {
              level
            }
            datasource
            group_id
            name
            user_id
          }
        }
      `,
      params,
    )
  ).groupSubscriptions;
}

export async function queryHotpointHistory(params: {
  datasource: API.Datasource;
  startFrom: string;
  endTo: string;
  keyword: string;
  groupIds: string[];
}) {
  return (
    await client.request<{ hotpointHistory: API.HistoricalMetric[] }>(
      gql`
        query hotpointHistory(
          $datasource: Datasource!
          $end_to: DateTime!
          $group_ids: [String!]!
          $keyword: String!
          $start_from: DateTime!
        ) {
          hotpointHistory(
            datasource: $datasource
            end_to: $end_to
            group_ids: $group_ids
            keyword: $keyword
            start_from: $start_from
          ) {
            end_to
            metric
            start_from
          }
        }
      `,
      {
        datasource: params.datasource,
        end_to: params.endTo,
        group_ids: params.groupIds,
        keyword: params.keyword,
        start_from: params.startFrom,
      },
    )
  ).hotpointHistory;
}

export async function queryHotpointStatistics(params: {
  datasource: API.Datasource;
  keyword: string;
  groupIds: string[];
  base: string;
}) {
  return (
    await client.request<{ hotpointStatistics: API.HotPointStatistics }>(
      gql`
        query hotpointStatistics(
          $base: DateTime!
          $datasource: Datasource!
          $group_ids: [String!]!
          $keyword: String!
        ) {
          hotpointStatistics(
            base: $base
            datasource: $datasource
            group_ids: $group_ids
            keyword: $keyword
          ) {
            dayIncr
            hourIncr
            monthIncr
            weekIncr
          }
        }
      `,
      {
        base: params.base,
        datasource: params.datasource,
        group_ids: params.groupIds,
        keyword: params.keyword,
      },
    )
  ).hotpointStatistics;
}

export async function queryHotPoints(params: {
  datasource: API.Datasource;
  startFrom: string;
  endTo: string;
  groupIds: string[];
}) {
  return (
    await client.request<{
      hotpoints: {
        hotpoints: API.Hotpoint[];
        totalWindows: number;
        unprocessedWindows: number;
      };
    }>(
      gql`
        query hotpoints(
          $datasource: Datasource!
          $end_to: DateTime!
          $group_ids: [String!]!
          $start_from: DateTime!
        ) {
          hotpoints(
            datasource: $datasource
            end_to: $end_to
            group_ids: $group_ids
            start_from: $start_from
          ) {
            hotpoints {
              growth
              hot
              name
            }
            totalWindows
            unprocessedWindows
          }
        }
      `,
      {
        datasource: params.datasource,
        end_to: params.endTo,
        group_ids: params.groupIds,
        start_from: params.startFrom,
      },
    )
  ).hotpoints;
}

export async function queryRelatedMessages(params: {
  datasource: API.Datasource;
  startFrom: string;
  endTo: string;
  keyword: string;
  targetIds: string[];
}) {
  return (
    await client.request<{ relatedMessages: API.Message[] }>(
      gql`
        query relatedMessages(
          $datasource: Datasource!
          $end_to: DateTime!
          $keyword: String!
          $start_from: DateTime!
          $target_ids: [String!]!
        ) {
          relatedMessages(
            datasource: $datasource
            end_to: $end_to
            keyword: $keyword
            start_from: $start_from
            target_ids: $target_ids
          ) {
            date
            from_id
            group_id
            message
            msg_id
          }
        }
      `,
      {
        datasource: params.datasource,
        end_to: params.endTo,
        target_ids: params.targetIds,
        keyword: params.keyword,
        start_from: params.startFrom,
      },
    )
  ).relatedMessages;
}

export async function querySearchKeywords(params: {
  datasource: API.Datasource;
  keyword: string;
  groupIds: string[];
  limit?: number;
}) {
  return (
    await client.request<{ searchKeywords: string[] }>(
      gql`
        query searchKeywords(
          $datasource: Datasource!
          $group_ids: [String!]!
          $keyword: String!
          $limit: Int = 10
        ) {
          searchKeywords(
            datasource: $datasource
            group_ids: $group_ids
            keyword: $keyword
            limit: $limit
          )
        }
      `,
      {
        datasource: params.datasource,
        keyword: params.keyword,
        group_ids: params.groupIds,
        limit: params.limit,
      },
    )
  ).searchKeywords;
}

export async function querySearchSmaGroups(params: {
  datasource: API.Datasource;
  keyword: string;
}) {
  return (
    await client.request<{ searchSmaGroups: API.SmaGroup[] }>(
      gql`
        query searchSmaGroups($datasource: Datasource, $keyword: String!) {
          searchSmaGroups(datasource: $datasource, keyword: $keyword) {
            datasource
            group_id
            name
          }
        }
      `,
      params,
    )
  ).searchSmaGroups;
}

export async function queryUserApplies(params: {
  status: API.ApplyStatus;
  type: API.ApplyType;
}) {
  return (
    await client.request<{ userApplies: API.UserApply[] }>(
      gql`
        query userApplies($status: ApplyStatus, $type: ApplyType) {
          userApplies(status: $status, type: $type) {
            data {
              ... on NewGroupApply {
                datasource
                group_id
                name
              }
            }
            id
            status
            type
            userId
          }
        }
      `,
      params,
    )
  ).userApplies;
}

export async function queryOverviewGroups(params: {
  input: API.GlobalGroupIdInput[];
  base: string;
}) {
  return (
    await client.request<{ smaGroups: API.GroupActive[] }>(
      gql`
        query smaGroups($input: [GlobalGroupIdInput!]!, $base: DateTime!) {
          smaGroups(input: $input) {
            group_id
            name
            active(base: $base) {
              level
            }
          }
        }
      `,
      params,
    )
  ).smaGroups;
}

export async function queryGroupDetail(params: {
  input: API.GlobalGroupIdInput;
  days: number;
  base: string;
}) {
  return (
    await client.request<{ smaGroup: API.SmaGroup }>(
      gql`
        query smaGroup(
          $input: GlobalGroupIdInput!
          $days: Float!
          $base: DateTime!
        ) {
          smaGroup(input: $input) {
            active(base: $base) {
              dau
              wau
              mau
              todayMsgs
              weekMsgs
              monthMsgs
              dauHistory(days: $days)
              dayMsgsHistory(days: $days)
            }
            datasource
            group_id
            name
          }
        }
      `,
      params,
    )
  ).smaGroup;
}

export async function queryKeywordSummary(params: {
  datasource: API.Datasource;
  start_from: string;
  end_to: string;
  keyword: string;
}) {
  return (
    await client.request<{ keywordSummary?: API.KeywordSummary }>(
      gql`
        query keywordSummary(
          $datasource: Datasource!
          $end_to: DateTime!
          $keyword: String!
          $start_from: DateTime!
        ) {
          keywordSummary(
            datasource: $datasource
            end_to: $end_to
            keyword: $keyword
            start_from: $start_from
          ) {
            summary
          }
        }
      `,
      params,
    )
  ).keywordSummary.summary;
}
