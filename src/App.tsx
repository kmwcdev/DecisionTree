import { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { usePersistence } from './hooks/usePersistence';

function App() {
  usePersistence();
  // Force dark mode always
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#111827');
  }, []);

  // Track visual viewport position and size every frame so #root always
  // aligns exactly with the visible area during Chrome's address bar animation.
  // offsetTop accounts for the gap between the layout viewport top and the
  // visual viewport top, which shifts as the address bar shows/hides.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      document.documentElement.style.setProperty('--app-top', `${vv.offsetTop}px`);
      document.documentElement.style.setProperty('--app-height', `${vv.height}px`);
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  return <AppLayout />;
}

export default App;
