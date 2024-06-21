import ApplicationMenu from '@/components/Layout/ApplicationMenu/ApplicationMenu';
import SignInModal from '@/components/Layout/SignInModal/SignInModal';
import { Applications, ApplicationsMap } from '@/constants';
import useContextMenu from '@/hooks/useContextMenu';
import { history, useLocation, useModel } from '@@/exports';
import { ConfigProvider, Modal, message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { ModalStaticFunctions } from 'antd/es/modal/confirm';
import { createContext, useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { Outlet } from 'umi';
import styles from './index.less';

export interface GlobalContextType {
  checkSignedIn: (redirectPath?: string) => boolean;
}

export const GlobalContext = createContext<GlobalContextType>({
  checkSignedIn: () => false,
});

export let globalMessage: MessageInstance;
export let globalModal: Omit<ModalStaticFunctions, 'warn'>;

export default function Layout() {
  const { setCurrentApplication } = useModel('application', (state) => ({
    setCurrentApplication: state.setCurrentApplication,
  }));
  const { currentUser } = useModel('user', (state) => ({
    currentUser: state.currentUser,
  }));
  useContextMenu(false);

  const [_message, messageContextHolder] = message.useMessage();
  useEffect(() => {
    globalMessage = _message;
  }, [_message]);
  const [modal, modalContextHolder] = Modal.useModal();
  useEffect(() => {
    globalModal = modal;
  }, [modal]);

  const { pathname } = useLocation();

  const [signInModalOpen, setSignInModalOpen] = useState(false);

  useEffect(() => {
    if (pathname) {
      const applicationType = pathname.replace('/', '').toLowerCase();
      const application = ApplicationsMap[applicationType];
      if (application?.enabled) {
        setCurrentApplication(application);
      } else {
        history.replace(
          `/${Applications.find((e) => e.enabled)?.type.toLowerCase()}`,
        );
      }
    }
  }, [pathname]);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#673ab7' } }}>
      <GlobalContext.Provider
        value={{
          checkSignedIn: () => {
            if (!currentUser) {
              setSignInModalOpen(true);
              return false;
            } else {
              return true;
            }
          },
        }}
      >
        <div className={styles.page}>
          <ApplicationMenu />
          <Outlet />
          <SignInModal
            open={signInModalOpen}
            onCancel={() => setSignInModalOpen(false)}
          />
        </div>
      </GlobalContext.Provider>
      {messageContextHolder}
      {modalContextHolder}
    </ConfigProvider>
  );
}
