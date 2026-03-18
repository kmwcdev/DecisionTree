import { useEffect, useState, useCallback } from 'react';
import { AppHeader } from './AppHeader';
import { FlowCanvas } from '../canvas/FlowCanvas';
import { EditorSidebar } from '../editor/EditorSidebar';
import { GuideView } from '../guide/GuideView';
import { TreesPanel } from '../trees/TreesPanel';
import { OptionsPanel } from '../options/OptionsPanel';
import { useTreeStore } from '../../store/useTreeStore';

export function AppLayout() {
  const { mode } = useTreeStore();
  const savedAt = useTreeStore((s) => s.savedAt);
  const [toastVisible, setToastVisible] = useState(false);
  const [editorPanelOpen, setEditorPanelOpen] = useState(false);
  const closeEditorPanel = useCallback(() => setEditorPanelOpen(false), []);

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
        ) : mode === 'options' ? (
          <OptionsPanel />
        ) : mode === 'editor' ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Mobile editor toolbar */}
            <div className="sm:hidden shrink-0 flex items-center justify-end px-3 py-1.5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <button
                className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setEditorPanelOpen(true)}
                aria-label="Open editor"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            {/* Canvas + desktop sidebar */}
            <div className="flex flex-1 overflow-hidden">
              <FlowCanvas />
              <div className="hidden sm:flex">
                <EditorSidebar />
              </div>
            </div>
            {/* Mobile editor drawer */}
            {editorPanelOpen && (
              <>
                <div
                  className="sm:hidden fixed inset-0 bg-black/30 z-20"
                  onClick={closeEditorPanel}
                />
                <div className="sm:hidden fixed inset-y-0 right-0 z-30 flex flex-col shadow-xl">
                  <EditorSidebar onClose={closeEditorPanel} />
                </div>
              </>
            )}
          </div>
        ) : (
          <FlowCanvas />
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
