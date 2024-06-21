import { useModel } from '@@/exports';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Popover, Select } from 'antd';
import styles from './Settings.less';

const LimitOptions = [15, 30, 50, 100, 150, 200];

const Settings = () => {
  const { hotpointLimit, setHotpointLimit } = useModel('group', (state) => ({
    hotpointLimit: state.hotpointLimit,
    setHotpointLimit: state.setHotpointLimit,
  }));

  return (
    <Popover
      content={
        <div className={styles.settingsCard}>
          <div className={styles.settingsRow}>
            <div className={styles.settingsTitle}>Limit</div>
            <Select
              value={hotpointLimit}
              onSelect={(e) => {
                setHotpointLimit(e);
              }}
              options={LimitOptions.map((e) => ({
                label: e + ' Bubbles',
                value: e,
              }))}
            />
          </div>
        </div>
      }
    >
      <Button
        style={{ marginLeft: 12 }}
        icon={<SettingOutlined />}
        type={'text'}
      />
    </Popover>
  );
};

export default Settings;
