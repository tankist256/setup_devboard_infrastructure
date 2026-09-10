import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 pt-16 flex flex-col">
      <Header />
      <main className="flex-1 p-6 h-[calc(100vh-4rem)] overflow-hidden">
        {children}
      </main>
    </div>
  );
}
