import SectionTitle from '@/components/Layout/SectionTitle/SectionTitle';
import ListItem from '@/components/ListItem/ListItem';
import RequestGroupModal from '@/components/RequestGroupModal/RequestGroupModal';
import { querySearchSmaGroups } from '@/services/apis';
import { useModel } from '@@/exports';
import {
  AppstoreFilled,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Input, Modal, ModalProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import styles from './AddToWatchlistModal.less';

const Config: Record<
  API.Datasource,
  | {
      placeholder: string;
      title: string;
      listTitle: string;
      listIcon: React.ReactNode;
      emptyTip: string;
      requestTitle: string;
      groupNamePlaceholder: string;
      linkPlaceholder?: string;
    }
  | undefined
> = {
  Reddit: {
    placeholder: 'Search for subreddits',
    title: 'Add Subreddit to Watchlist',
    listTitle: 'Subreddits',
    listIcon: <AppstoreFilled />,
    emptyTip: 'Subreddit Not Found?',
    requestTitle: 'Request for a new subreddit',
    groupNamePlaceholder: 'Subreddit name or link',
  },
  Lens: {
    placeholder: 'Search for lens applications',
    title: 'Add Application to Watchlist',
    listTitle: 'Applications',
    listIcon: <AppstoreFilled />,
    emptyTip: 'Application Not Found?',
    requestTitle: 'Request for a new application',
    groupNamePlaceholder: 'Name of the lens application',
  },
  Telegram: {
    placeholder: 'Search for channels(groups)',
    title: 'Add Channels(Groups) to Watchlist',
    listTitle: 'Channels(Groups)',
    listIcon: <TeamOutlined />,
    emptyTip: 'Channel(Group) Not Found?',
    requestTitle: 'Request for a new Telegram channel(group)',
    groupNamePlaceholder: 'Name of the Channel(Group)',
    linkPlaceholder: 'Invite link of the Channel(Group)',
  },
  Discord: undefined,
  Twitter: undefined,
  Farcaster: {
    placeholder: 'Search for channels(users)',
    title: 'Add Channels(Users) to Watchlist',
    listTitle: 'Channels(Users)',
    listIcon: <AppstoreFilled />,
    emptyTip: 'Channel(User) Not Found?',
    requestTitle: 'Request for a new Farcaster channel(user)',
    groupNamePlaceholder: 'Name of the Channel(User)',
    linkPlaceholder: '[Option] Link of the Channel(User)',
  },
  Youtube: undefined,
};

export default function AddToWatchlistModal({ ...modalProps }: ModalProps) {
  const { currentApplication, watchlist, runAddToWatchlist } = useModel(
    'application',
    (state) => ({
      currentApplication: state.currentApplication,
      watchlist: state.watchlist,
      runAddToWatchlist: state.runAddToWatchlist,
    }),
  );

  const config = useMemo(
    () => Config[currentApplication?.type],
    [currentApplication],
  );

  const [keyword, setKeyword] = useState('');
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const {
    data: searchResult,
    runAsync: runSearch,
    mutate: mutateSearchResult,
  } = useRequest(
    async () => {
      return await querySearchSmaGroups({
        datasource: currentApplication.type,
        keyword,
      });
    },
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (!modalProps.open) {
      setKeyword('');
      mutateSearchResult(undefined);
    }
  }, [modalProps.open]);

  const listData = useMemo(
    () =>
      searchResult
        ? searchResult.slice(0, 10).map((r) => ({
            ...r,
            added: !!watchlist.find((e) => e.group_id === r.group_id),
          }))
        : [],
    [searchResult, watchlist],
  );

  return (
    <Modal
      title={config?.title}
      centered={true}
      maskClosable={true}
      footer={null}
      width={460}
      {...modalProps}
    >
      {config && (
        <>
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={runSearch}
            size={'large'}
            style={{ boxShadow: 'none', border: 'none', padding: 12 }}
            placeholder={config.placeholder}
            suffix={
              <SearchOutlined
                onClick={runSearch}
                style={{ cursor: 'pointer' }}
              />
            }
          />
          {listData?.length > 0 && (
            <div className={styles.results}>
              <SectionTitle
                title={config.listTitle}
                style={{ marginBottom: 8 }}
              />
              {listData.map((e) => (
                <ListItem<API.SmaGroup>
                  key={e.group_id}
                  onClick={async () => {
                    if (!e.added) {
                      await runAddToWatchlist(e.group_id);
                    }
                  }}
                  data={e}
                  title={e.name}
                  icon={config.listIcon}
                  rightContent={
                    !e.added ? (
                      <div className={styles.add}>
                        <PlusOutlined /> Add to watchlist
                      </div>
                    ) : (
                      <div className={styles.addDisabled}>
                        Already subscribed
                      </div>
                    )
                  }
                />
              ))}
            </div>
          )}

          <div className={styles.emptyTip}>
            {config.emptyTip}
            <Button type={'link'} onClick={() => setRequestModalOpen(true)}>
              Submit a Request
            </Button>
          </div>

          <RequestGroupModal
            groupNamePlaceholder={config.groupNamePlaceholder}
            linkPlaceholder={config.linkPlaceholder}
            open={requestModalOpen}
            onCancel={() => setRequestModalOpen(false)}
            title={config.requestTitle}
            onSubmit={(e) => {
              setRequestModalOpen(false);
              modalProps.onCancel?.(e);
            }}
          />
        </>
      )}
    </Modal>
  );
}
