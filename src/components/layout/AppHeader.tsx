import { useTreeStore } from '../../store/useTreeStore';

function AppIcon() {
  return (
    <svg viewBox="0 0 40 34" width="36" height="31" fill="none" aria-label="Decision Tree">
      <line x1="20" y1="14" x2="9" y2="23" stroke="#475569" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="14" x2="31" y2="23" stroke="#475569" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 2L29 8L20 14L11 8Z" fill="#f59e0b"/>
      <path d="M20 2L29 8L20 14L11 8Z" stroke="#fcd34d" strokeWidth="0.75" fill="none"/>
      <rect x="2" y="23" width="14" height="9" rx="2" fill="#3b82f6"/>
      <rect x="2" y="23" width="14" height="9" rx="2" stroke="#93c5fd" strokeWidth="0.75" fill="none"/>
      <rect x="24" y="23" width="14" height="9" rx="2" fill="#3b82f6"/>
      <rect x="24" y="23" width="14" height="9" rx="2" stroke="#93c5fd" strokeWidth="0.75" fill="none"/>
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

type ModeButton = { mode: Parameters<ReturnType<typeof useTreeStore>['setMode']>[0]; label: string };

const desktopModes: ModeButton[] = [
  { mode: 'view', label: 'View' },
  { mode: 'editor', label: 'Edit' },
  { mode: 'guide', label: 'Guide' },
  { mode: 'trees', label: 'Trees' },
  { mode: 'options', label: 'Options' },
];

const mobileModes: ModeButton[] = [
  { mode: 'view', label: 'View' },
  { mode: 'guide', label: 'Guide' },
  { mode: 'trees', label: 'Trees' },
  { mode: 'options', label: 'Options' },
];

export function AppHeader() {
  const { mode, setMode, guideHistoryOpen, setGuideHistoryOpen } = useTreeStore();

  return (
    <header className="h-12 shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-4">
      {mode === 'guide' && (
        <button
          className="sm:hidden p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setGuideHistoryOpen(!guideHistoryOpen)}
          aria-label="Show path history"
        >
          <HamburgerIcon />
        </button>
      )}

      <div className="mr-auto flex items-center gap-2">
        <AppIcon />
        <h1 className="hidden sm:block text-base font-bold text-gray-900 dark:text-gray-100">Decision Tree</h1>
      </div>

      {/* Mobile mode toggle */}
      <div className="sm:hidden flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden text-xs font-medium">
        {mobileModes.map((m, i) => (
          <button
            key={m.mode}
            onClick={() => setMode(m.mode)}
            className={`px-3 py-1.5 transition-colors ${i > 0 ? 'border-l border-gray-300 dark:border-gray-600' : ''} ${
              mode === m.mode
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Desktop mode toggle */}
      <div className="hidden sm:flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden text-xs font-medium">
        {desktopModes.map((m, i) => (
          <button
            key={m.mode}
            onClick={() => setMode(m.mode)}
            className={`px-3 py-1.5 transition-colors ${i > 0 ? 'border-l border-gray-300 dark:border-gray-600' : ''} ${
              mode === m.mode
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </header>
  );
}
