import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import styles from './LoadingMask.less';

export default function LoadingMask({ open }: { open: boolean }) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      setTimeout(() => {
        setVisible(false);
      }, 300);
    }
  }, [open]);

  return visible ? (
    <div className={styles.loadingMask} style={{ opacity: open ? 1 : 0 }}>
      <div className={styles.progress}>
        <div>{`Loading...`}</div>
        <LoadingOutlined style={{ marginTop: 12, fontSize: 30 }} />
      </div>
    </div>
  ) : null;
}
