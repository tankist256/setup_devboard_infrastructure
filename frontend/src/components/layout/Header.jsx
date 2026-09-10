import { useAuth } from '../../lib/auth';
import { Button } from '../ui/Button';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <svg width="32" height="32" viewBox="0 0 100 100">
          <rect width="100" height="100" rx="20" fill="#6366f1"/>
          <text x="50" y="65" fontFamily="Arial,sans-serif" fontSize="50" fontWeight="bold" fill="white" textAnchor="middle">D</text>
        </svg>
        <span className="text-xl font-bold text-brand">DevBoard</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-700">{user?.username}</span>
        <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
      </div>
    </header>
  );
}
