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

  // Apply dark/light class, color-scheme, and theme-color on initial load
  useEffect(() => {
    const dark = useTreeStore.getState().darkMode;
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111827' : '#ffffff');
  }, []);

  return <AppLayout />;
}

export default App;
