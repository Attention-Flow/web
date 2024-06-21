import LOGO_GOOGLE from '@/assets/logo-google.svg';
import { Helmet, history, useLocation, useMatch, useModel } from '@@/exports';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import styles from './index.less';

const Logos: Record<string, string> = {
  google: LOGO_GOOGLE,
};

const Index: React.FC = () => {
  const { setToken, currentUser, pathnameBeforeSignIn } = useModel(
    'user',
    (state) => ({
      setToken: state.setToken,
      currentUser: state.currentUser,
      pathnameBeforeSignIn: state.pathnameBeforeSignIn,
    }),
  );

  const { search } = useLocation();
  const match = useMatch('/auth/:type');

  useEffect(() => {
    if (!search) {
      history.replace('/');
      return;
    }
    const searchParams = new URLSearchParams(search);
    const token = searchParams.get('token');
    const expireAt = searchParams.get('expireAt');
    if (token && expireAt) {
      setToken(token, {
        expires: Number(expireAt) * 1000,
      });
      history.push(pathnameBeforeSignIn);
    } else {
      history.replace('/');
    }
  }, [search]);

  useEffect(() => {
    // if (currentUser) {
    //   history.push(pathnameBeforeSignIn);
    // }
  }, [currentUser]);

  return (
    <div className={styles.container}>
      <Helmet title={'Signing in - AttentionFlow'} />
      {match?.params && (
        <img src={Logos[match.params.type]} className={styles.logo} />
      )}
      <LoadingOutlined className={styles.loading} />
    </div>
  );
};

export default Index;
