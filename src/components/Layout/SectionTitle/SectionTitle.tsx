import styles from './SectionTitle.less';

export default function SectionTitle({
  title,
  icon,
  style = {},
}: {
  title: React.ReactNode;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className={styles.row} style={style}>
      {icon}
      <div>{title}</div>
    </div>
  );
}
