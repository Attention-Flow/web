import { useEffect } from 'react';

const handleContextMenu = (e) => {
  e.preventDefault();
};

const useContextMenu = (enabled: boolean) => {
  useEffect(() => {
    if (enabled) {
      document.removeEventListener('contextmenu', handleContextMenu);
    } else {
      document.addEventListener('contextmenu', handleContextMenu);
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [enabled]);
};

export default useContextMenu;
