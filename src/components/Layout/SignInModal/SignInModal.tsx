import LOGO_GOOGLE from '@/assets/logo-google.svg';
import { useLocation, useModel } from '@@/exports';
import { Modal, ModalProps } from 'antd';
import { useEffect } from 'react';
import styles from './SignInModal.less';

export default function SignInModal({ ...modalProps }: ModalProps) {
  const { pathname, search } = useLocation();

  const { setPathnameBeforeSignIn } = useModel('user', (state) => ({
    setPathnameBeforeSignIn: state.setPathnameBeforeSignIn,
  }));

  useEffect(() => {
    setPathnameBeforeSignIn(modalProps.open ? `${pathname}${search}` : '');
  }, [modalProps.open]);

  return (
    <Modal
      width={340}
      centered={true}
      footer={null}
      title={'Sign In to AttentionFlow'}
      {...modalProps}
    >
      <div className={styles.content}>
        <a
          href={'https://web3fomo.ai/auth/google-redirect'}
          rel={'noreferrer noopener'}
        >
          <div className={styles.card}>
            <img src={LOGO_GOOGLE} className={styles.logo} />
            Sign in with Google
          </div>
        </a>
      </div>
    </Modal>
  );
}
