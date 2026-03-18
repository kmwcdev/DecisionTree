import { useEffect, useState } from 'react';
import { AppHeader } from './AppHeader';
import { FlowCanvas } from '../canvas/FlowCanvas';
import { EditorSidebar } from '../editor/EditorSidebar';
import { GuideView } from '../guide/GuideView';
import { TreesPanel } from '../trees/TreesPanel';
import { useTreeStore } from '../../store/useTreeStore';

export function AppLayout() {
  const { mode } = useTreeStore();
  const savedAt = useTreeStore((s) => s.savedAt);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!savedAt) return;
    setToastVisible(true);
    const t = setTimeout(() => setToastVisible(false), 1000);
    return () => clearTimeout(t);
  }, [savedAt]);

  return (
    <div className="flex flex-col h-full">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        {mode === 'guide' ? (
          <GuideView />
        ) : mode === 'trees' ? (
          <TreesPanel />
        ) : (
          <>
            <FlowCanvas />
            {mode === 'editor' && <EditorSidebar />}
          </>
        )}
      </div>
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-800 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg transition-all duration-300 pointer-events-none ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Saved
      </div>
    </div>
  );
}
