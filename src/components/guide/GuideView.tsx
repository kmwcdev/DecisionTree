import { useEffect } from 'react';
import { useTreeStore } from '../../store/useTreeStore';
import { HistorySidebar } from './HistorySidebar';
import { NodeCard } from './NodeCard';

export function GuideView() {
  const { startGuide, wizardCurrentId } = useTreeStore();

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
    <div className="flex flex-1 overflow-hidden bg-gray-50">
      <div className="hidden sm:block">
        <HistorySidebar />
      </div>
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <NodeCard nodeId={wizardCurrentId} />
      </div>
    </div>
  );
}
