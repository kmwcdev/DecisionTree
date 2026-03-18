import { useEffect } from 'react';
import { useTreeStore } from '../../store/useTreeStore';
import { HistorySidebar } from './HistorySidebar';
import { NodeCard } from './NodeCard';

export function GuideView() {
  const { startGuide, wizardCurrentId, guideHistoryOpen, setGuideHistoryOpen } = useTreeStore();

  useEffect(() => {
    startGuide();
  }, [startGuide]);

  if (!wizardCurrentId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
        No nodes in this tree yet.
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
      {/* Desktop history sidebar */}
      <div className="hidden sm:flex">
        <HistorySidebar />
      </div>

      {/* Mobile history drawer */}
      {guideHistoryOpen && (
        <>
          <div
            className="sm:hidden fixed inset-0 bg-black/30 z-20"
            onClick={() => setGuideHistoryOpen(false)}
          />
          <div className="sm:hidden fixed inset-y-0 left-0 z-30 flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Path so far</span>
              <button
                onClick={() => setGuideHistoryOpen(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
              <HistorySidebar hideHeader />
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto relative" style={{ touchAction: 'pan-y' }}>
        {/* Mobile hamburger — inside canvas, top-left */}
        <button
          className="sm:hidden absolute top-3 left-3 z-10 p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setGuideHistoryOpen(!guideHistoryOpen)}
          aria-label="Show path history"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-h-full flex items-center justify-center p-8">
          <NodeCard nodeId={wizardCurrentId} />
        </div>
      </div>
    </div>
  );
}
