import { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { usePersistence } from './hooks/usePersistence';
import { useTreeStore } from './store/useTreeStore';

function App() {
  usePersistence();
  const setMode = useTreeStore((s) => s.setMode);

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      setMode('guide');
    }
  }, [setMode]);

  // Apply dark class on initial load from persisted preference
  useEffect(() => {
    if (useTreeStore.getState().darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return <AppLayout />;
}

export default App;
