import { LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styles from './ListItem.less';

export default function ListItem<T>({
  onClick,
  data,
  title,
  icon,
  rightContent,
}: {
  onClick: (item: T) => void;
  data: T;
  title: string;
  icon?: React.ReactNode;
  rightContent?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <div
      className={styles.listItem}
      onClick={async () => {
        if (loading) return;
        setLoading(true);
        await onClick(data);
        setLoading(false);
      }}
    >
      <div className={styles.alignCenter} style={{ minWidth: 0 }}>
        {icon}
        <div className={styles.title} style={{ marginLeft: icon ? 6 : 0 }}>
          {title}
        </div>
      </div>
      {loading ? <LoadingOutlined /> : rightContent}
    </div>
  );
}
