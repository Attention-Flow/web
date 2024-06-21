import { TimeSpans } from '@/constants';
import { message } from 'antd';
import classNames from 'classnames';
import styles from './TimeTabs.less';

export default function TimeTabs({
  value,
  onChange,
}: {
  value: TimeSpan;
  onChange: (value: TimeSpan) => void;
  renderer?: (children: any) => React.ReactNode;
}) {
  const [_message, messageContextHolder] = message.useMessage();

  return (
    <div className={styles.tabs}>
      {TimeSpans.map((tab) => (
        <div
          key={tab.value as React.Key}
          className={classNames(styles.tab, {
            [styles.active]: value === tab.value,
          })}
          onClick={() => {
            if (tab.enabled) {
              onChange(tab.value);
            } else {
              _message.info('Coming soon!');
            }
          }}
        >
          {tab.label}
        </div>
      ))}
      {messageContextHolder}
    </div>
  );
}
