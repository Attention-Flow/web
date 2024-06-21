import SectionTitle from '@/components/Layout/SectionTitle/SectionTitle';
import ListItem from '@/components/ListItem/ListItem';
import { querySearchSmaGroups } from '@/services/apis';
import { useModel } from '@@/exports';
import {
  AppstoreAddOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Badge,
  Button,
  Divider,
  Input,
  Modal,
  ModalProps,
  Space,
  Tag,
  Tooltip,
  message,
  theme,
} from 'antd';
import { useMemo, useState } from 'react';
import styles from './CustomModal.less';

const Config: Record<
  API.Datasource,
  | {
      title: string;
      description: string;
      searchPlaceholder: string;
      add: string;
    }
  | undefined
> = {
  Reddit: {
    title: 'Build Your Subreddit Collection',
    description:
      'Select multiple subreddits to create a collection and view aggregated analysis of them.',
    searchPlaceholder: 'Search for Subreddits',
    add: 'Add Subreddits to Collection',
  },
  Lens: {
    title: 'Build Your Application Collection',
    description:
      'Select multiple applications to create a collection and view aggregated analysis of them.',
    searchPlaceholder: 'Search for Applications',
    add: 'Add Applications to Collection',
  },
  Telegram: {
    title: 'Build Your Channel(Group) Collection',
    description:
      'Select multiple channels(groups) to create a collection and view aggregated analysis of them.',
    searchPlaceholder: 'Search for Channels(Groups)',
    add: 'Add Channels(Groups) to Collection',
  },
  Discord: undefined,
  Twitter: undefined,
  Farcaster: {
    title: 'Build Your Channel(User) Collection',
    description:
      'Select multiple channels(users) to create a collection and view aggregated analysis of them.',
    searchPlaceholder: 'Search for Channels(Users)',
    add: 'Add Channels(Users) to Collection',
  },
  Youtube: undefined,
};

export default function CustomModal({ ...modalProps }: ModalProps) {
  const { currentApplication } = useModel('application', (state) => ({
    currentApplication: state.currentApplication,
  }));

  const config = useMemo(
    () => Config[currentApplication?.type],
    [currentApplication],
  );

  const [_message, messageContextHolder] = message.useMessage();
  const { token: antdToken } = theme.useToken();

  const [collectionName, setCollectionName] = useState('');
  const [collectionItems, setCollectionItems] = useState<API.SmaGroup[]>([]);
  const [keyword, setKeyword] = useState('');

  const {
    data: _searchResult,
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

  const searchResult = useMemo(
    () =>
      _searchResult
        ? _searchResult.slice(0, 10).map((r) => ({
            ...r,
            added: !!collectionItems.find((e) => e.group_id === r.group_id),
          }))
        : [],
    [_searchResult, collectionItems],
  );

  return (
    <Modal
      centered={true}
      maskClosable={true}
      footer={null}
      width={600}
      title={
        <div>
          {config?.title}{' '}
          <Tooltip title={config.description}>
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      }
      {...modalProps}
    >
      <div className={styles.formItem}>
        <SectionTitle title={'Collection Name'} style={{ marginBottom: 2 }} />
        <Input
          style={{ boxShadow: 'none', border: 'none', padding: 8 }}
          placeholder={'Name of the collection'}
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
      </div>
      <div className={styles.formItem}>
        <SectionTitle
          title={
            <div>
              Collection Items{' '}
              <Badge
                count={collectionItems.length}
                size={'small'}
                showZero={true}
                color={antdToken.colorPrimary}
                style={{ color: 'rgba(255, 255, 255, 0.85)' }}
              />
            </div>
          }
          style={{ marginBottom: 2 }}
        />
        <div className={styles.collectionCard}>
          {collectionItems.length > 0 ? (
            <Space wrap={true} size={[8, 8]}>
              {collectionItems.map((e) => (
                <Tag
                  style={{ marginInlineEnd: 0 }}
                  closable={true}
                  key={e.group_id}
                  onClose={() =>
                    setCollectionItems((state) =>
                      state.filter((i) => i.group_id !== e.group_id),
                    )
                  }
                >
                  {e.name}
                </Tag>
              ))}
            </Space>
          ) : (
            <div className={styles.empty}>Empty Collection</div>
          )}
        </div>
      </div>
      <Divider>
        <AppstoreAddOutlined style={{ marginRight: 8 }} />
        {config.add}
      </Divider>
      <Input
        style={{ boxShadow: 'none', border: 'none', padding: 8 }}
        placeholder={config.searchPlaceholder}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onPressEnter={runSearch}
        suffix={
          <SearchOutlined onClick={runSearch} style={{ cursor: 'pointer' }} />
        }
      />
      {searchResult?.length > 0 && (
        <div className={styles.results}>
          {searchResult.map((e) => (
            <ListItem<API.SmaGroup>
              key={e.group_id}
              onClick={async () => {
                if (!e.added) {
                  setCollectionItems((state) => [...state, e]);
                }
              }}
              data={e}
              title={e.name}
              icon={config.listIcon}
              rightContent={
                !e.added ? (
                  <div className={styles.add}>
                    <PlusOutlined /> Add to collection
                  </div>
                ) : null
              }
            ></ListItem>
          ))}
        </div>
      )}
      <div className={styles.actionRow}>
        <Button
          shape={'round'}
          type="primary"
          onClick={() => _message.info('Coming soon!')}
        >
          Create Collection
        </Button>
      </div>
      {messageContextHolder}
    </Modal>
  );
}
