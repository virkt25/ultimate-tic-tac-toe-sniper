import { GameHeader } from './components/GameHeader';

export function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center">
      <GameHeader />
      <main className="flex-1 flex items-center justify-center">
        <p className="text-slate-400">Game board coming soon...</p>
      </main>
    </div>
  );
}
