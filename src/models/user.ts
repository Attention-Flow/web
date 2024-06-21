import { client, setResponseMiddleware } from '@/services';
import { queryCurrentUser } from '@/services/apis';
import { useCookieState, useLocalStorageState, useRequest } from 'ahooks';
import { useCallback, useEffect } from 'react';

const useUser = () => {
  const [token, setToken] = useCookieState('token-web3-fomo');
  const [pathnameBeforeSignIn, setPathnameBeforeSignIn] = useLocalStorageState(
    'pathname-before-sign-in',
  );

  const {
    data: currentUser,
    refresh: refreshCurrentUser,
    runAsync: runCurrentUser,
  } = useRequest(
    async () => {
      if (!token) return undefined;
      return await queryCurrentUser();
    },
    { manual: true },
  );

  const logout = useCallback(() => {
    setToken('');
  }, []);

  useEffect(() => {
    setResponseMiddleware((response: any) => {
      const err = response?.response?.errors?.[0];
      if (err && err.message === 'Unauthorized') {
        logout();
      }
    });
  }, []);

  useEffect(() => {
    if (!!token) {
      client.setHeaders({ authorization: `Bearer ${token}` });
    } else {
      client.setHeaders({ authorization: '' });
    }
    runCurrentUser(token);
  }, [token]);

  return {
    currentUser,
    refreshCurrentUser,
    token,
    setToken,
    logout,
    pathnameBeforeSignIn,
    setPathnameBeforeSignIn,
  };
};

export default useUser;
