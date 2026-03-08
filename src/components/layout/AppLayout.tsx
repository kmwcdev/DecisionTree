import { AppHeader } from './AppHeader';
import { FlowCanvas } from '../canvas/FlowCanvas';
import { EditorSidebar } from '../editor/EditorSidebar';
import { GuideView } from '../guide/GuideView';
import { useTreeStore } from '../../store/useTreeStore';

export function AppLayout() {
  const { mode } = useTreeStore();

  return (
    <div className="flex flex-col h-full">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        {mode === 'guide' ? (
          <GuideView />
        ) : (
          <>
            <FlowCanvas />
            {mode === 'editor' && <EditorSidebar />}
          </>
        )}
      </div>
    </div>
  );
}
