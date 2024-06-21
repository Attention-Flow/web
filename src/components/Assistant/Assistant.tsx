import { sleep } from '@/utils/time';
import { useModel } from '@@/exports';
import { ClearOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons';
import {
  useCreation,
  useLocalStorageState,
  useMutationObserver,
  useRequest,
} from 'ahooks';
import {
  Avatar,
  Button,
  FloatButton,
  Input,
  Modal,
  Space,
  Tooltip,
  theme,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import Typewriter from 'typewriter-effect';
import styles from './Assistant.less';

interface AssistantProps {
  hotPoint?: string;
  application: API.Datasource;
  group: string | string[];
  date: string;
  size?: 'large' | 'default';
}

const ContainerStyle = {
  large: {
    height: 600,
    minHeight: 600,
    maxHeight: 600,
  },
  default: {
    height: 400,
    minHeight: 400,
    maxHeight: 400,
  },
};

const Assistant = ({
  hotPoint,
  application,
  group,
  date,
  size = 'default',
}: AssistantProps) => {
  const messageListRef = useRef<HTMLDivElement>();

  const assistantKey = useCreation(
    () =>
      `${application}.${Array.isArray(group) ? 'overview' : group}.${date}` +
      (hotPoint ? `.${hotPoint}` : ''),
    [hotPoint, application, group, date],
  );
  const { token: antdToken } = theme.useToken();

  const [typing, setTyping] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useLocalStorageState<string[]>(assistantKey, {
    defaultValue: [],
  });

  const exceedLimitation = useCreation(
    () => (messages ? Math.ceil(messages.length / 2) >= 10 : false),
    [messages],
  );

  const { run: runAssistant, loading: assistantLoading } = useRequest(
    async () => {
      if (!input.trim()) return;

      setMessages((state) => [...state, input]);
      setInput('');

      setTyping(true);
      // TODO api
      await sleep(2000);
      setMessages((state) => [
        ...state,
        'Test response Test response Test response Test response Test response Test response Test response Test response ',
      ]);
    },
    {
      manual: true,
    },
  );

  useEffect(() => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages]);

  useMutationObserver(
    () => {
      if (!messageListRef.current) return;
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    },
    messageListRef,
    {
      subtree: true,
      characterData: true,
      childList: true,
    },
  );

  return (
    <div className={styles.assistantContainer} style={ContainerStyle[size]}>
      <div ref={messageListRef} className={styles.messageList}>
        {messages?.map((e, index) =>
          index % 2 === 0 ? (
            <div
              key={`${assistantKey}.${index}`}
              className={styles.messageItemUser}
            >
              <div className={styles.content}>{e}</div>
              {/*<Avatar />*/}
            </div>
          ) : (
            <div
              key={`${assistantKey}.${index}`}
              className={styles.messageItemAssistant}
            >
              <Avatar
                icon={<RobotOutlined />}
                style={{ background: antdToken.colorPrimary }}
              />
              <div className={styles.content}>
                {typing && index === messages!.length - 1 ? (
                  <Typewriter
                    options={{
                      strings: e,
                      autoStart: true,
                      loop: false,
                      skipAddStyles: true,
                      delay: 15,
                      pauseFor: 0,
                      cursorClassName: styles.cursor,
                    }}
                    onInit={(typewriter) => {
                      typewriter.callFunction(() => {
                        setTyping(false);
                      });
                    }}
                  />
                ) : (
                  e
                )}
              </div>
            </div>
          ),
        )}
      </div>
      {exceedLimitation ? (
        <Button
          loading={assistantLoading || typing}
          block={true}
          type={'primary'}
          onClick={() => setMessages([])}
        >
          New Chat
        </Button>
      ) : (
        <div className={styles.inputRow}>
          <Tooltip title={'Clear'}>
            <Button
              disabled={assistantLoading || typing}
              icon={<ClearOutlined />}
              onClick={() => setMessages([])}
            />
          </Tooltip>
          <Space.Compact style={{ flex: 1 }}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={assistantLoading || typing}
              placeholder={
                !!hotPoint ? 'Ask about the hot topic' : 'Ask about the channel'
              }
              onPressEnter={runAssistant}
              suffix={`${messages ? Math.ceil(messages.length / 2) : 0}/10`}
            />
            <Button
              loading={assistantLoading || typing}
              type={'primary'}
              icon={<SendOutlined />}
              onClick={runAssistant}
            />
          </Space.Compact>
        </div>
      )}
    </div>
  );
};

const AssistantModal = ({
  open,
  onClose,
  ...assistantProps
}: AssistantProps & {
  open: boolean;
  onClose: VoidFunction;
}) => {
  return (
    <Modal
      width={450}
      title={
        <div>
          <RobotOutlined /> AI Assistant
        </div>
      }
      // closable={false}
      style={{ padding: 0 }}
      open={open}
      onCancel={onClose}
      footer={null}
      centered={true}
    >
      <Assistant
        key={`${assistantProps.application}.${
          Array.isArray(assistantProps.group)
            ? 'overview'
            : assistantProps.group
        }.${assistantProps.date}.${assistantProps.hotPoint}`}
        {...assistantProps}
        size={'large'}
      />
    </Modal>
  );
};

const AssistantButton = () => {
  const { currentApplication, date } = useModel('application', (state) => ({
    currentApplication: state.currentApplication,
    date: state.date,
  }));
  const { currentGroup } = useModel('group', (state) => ({
    currentGroup: state.currentGroup,
  }));

  const [open, setOpen] = useState(false);

  return (
    <>
      <FloatButton
        style={{ right: 24, bottom: 24 }}
        shape="circle"
        type="primary"
        icon={<RobotOutlined />}
        onClick={() => setOpen(true)}
      />
      {currentApplication && (
        <AssistantModal
          application={currentApplication.type}
          group={currentGroup}
          open={open}
          date={date}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export { Assistant, AssistantModal, AssistantButton };
