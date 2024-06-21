import { AssistantButton } from '@/components/Assistant/Assistant';
import Bubble from '@/components/Bubble/Bubble';
import Dashboard from '@/components/Layout/Dashboard/Dashboard';
import Header from '@/components/Layout/Header/Header';
import TopicDrawer from '@/components/Layout/TopicDrawer/TopicDrawer';
import { useDashboardOpen } from '@/hooks/useDashboardOpen';
import { Helmet } from '@@/exports';
import styles from './index.less';

const Telegram: React.FC = () => {
  const { dashboardOpen, openDashboard, closeDashboard } = useDashboardOpen();

  return (
    <>
      <Helmet title={'Telegram - AttentionFlow'} />
      <Dashboard open={dashboardOpen} onClose={closeDashboard} />
      <div className={styles.page}>
        <Header
          title={'Overview'}
          dashboardOpen={dashboardOpen}
          onOpenDashboard={openDashboard}
        />
        <Bubble />
      </div>
      <TopicDrawer />
      <AssistantButton />
    </>
  );
};

export default Telegram;
