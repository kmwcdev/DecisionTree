import { useEffect } from 'react';
import { useTreeStore } from '../../store/useTreeStore';
import { HistorySidebar } from './HistorySidebar';
import { NodeCard } from './NodeCard';

export function GuideView() {
  const { startGuide, wizardCurrentId, guideHistoryOpen, setGuideHistoryOpen } = useTreeStore();

  // Start from root whenever guide mode is entered
  useEffect(() => {
    startGuide();
  }, [startGuide]);

  if (!wizardCurrentId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No nodes in this tree yet.
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden bg-gray-50 relative">
      {/* Desktop history sidebar */}
      <div className="hidden sm:block">
        <HistorySidebar />
      </div>

      {/* Mobile history drawer */}
      {guideHistoryOpen && (
        <>
          {/* Backdrop */}
          <div
            className="sm:hidden fixed inset-0 bg-black/30 z-20"
            onClick={() => setGuideHistoryOpen(false)}
          />
          {/* Drawer */}
          <div className="sm:hidden fixed inset-y-0 left-0 z-30 flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Path so far</span>
              <button
                onClick={() => setGuideHistoryOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-lg leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-white">
              <HistorySidebar hideHeader />
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-8">
          <NodeCard nodeId={wizardCurrentId} />
        </div>
      </div>
    </div>
  );
}
