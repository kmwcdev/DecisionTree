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

  // Apply dark class, color-scheme, and theme-color on initial load from persisted preference
  useEffect(() => {
    if (useTreeStore.getState().darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#111827');
    }
  }, []);

  return <AppLayout />;
}

export default App;
