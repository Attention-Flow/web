import { Applications } from '@/constants';
import { GlobalContext, GlobalContextType } from '@/layouts';
import { history, useModel } from '@@/exports';
import { LoginOutlined } from '@ant-design/icons';
import { Dropdown, Tooltip, message } from 'antd';
import classNames from 'classnames';
import { MacScrollbar } from 'mac-scrollbar';
import { useContext } from 'react';
import styles from './ApplicationMenu.less';

export default function ApplicationMenu() {
  const { checkSignedIn } = useContext<GlobalContextType>(GlobalContext);
  const { currentApplication } = useModel('application', (state) => ({
    currentApplication: state.currentApplication,
  }));
  const { currentUser, setToken } = useModel('user', (state) => ({
    setToken: state.setToken,
    currentUser: state.currentUser,
  }));

  const [_message, messageContextHolder] = message.useMessage();

  return (
    <div className={styles.menu}>
      <MacScrollbar className={styles.applications}>
        {Applications.map((e) => (
          <Tooltip key={e.type} placement={'right'} title={e.name}>
            <div
              className={classNames(styles.menuItem, {
                [styles.menuItemActive]: currentApplication?.type === e.type,
              })}
              onClick={() => {
                if (e.enabled) {
                  history.push(e.path);
                } else {
                  _message.info('Coming soon!');
                }
              }}
            >
              <img src={e.icon} style={e.iconStyle} />
            </div>
          </Tooltip>
        ))}
      </MacScrollbar>
      <div>
        <div className={styles.divider} />
        {currentUser ? (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'sign-out',
                  label: <a onClick={() => setToken('')}>Sign Out</a>,
                },
              ],
            }}
            placement="topRight"
            arrow
          >
            <img className={styles.avatar} src={currentUser.avatarUrl} />
          </Dropdown>
        ) : (
          <Tooltip title={'Sign In'}>
            <div
              className={styles.signInButton}
              onClick={() => {
                checkSignedIn();
              }}
            >
              <LoginOutlined />
            </div>
          </Tooltip>
        )}
      </div>

      {messageContextHolder}
    </div>
  );
}
