import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBoards = async () => {
    try {
      const data = await api.getBoards();
      setBoards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.createBoard({ title: newTitle });
      setNewTitle('');
      setIsModalOpen(false);
      fetchBoards();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this board?')) return;
    try {
      await api.deleteBoard(id);
      fetchBoards();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading boards...</div>;

  return (
    <div className="h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Boards</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.map(board => (
          <div 
            key={board.id} 
            onClick={() => navigate(`/boards/${board.id}`)}
            className="group relative bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer h-40 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-800 line-clamp-2">{board.title}</h2>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span>{new Date(board.created_at).toLocaleDateString()}</span>
              <button 
                onClick={(e) => handleDelete(e, board.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        <div 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-50 rounded-xl p-6 border-2 border-dashed border-slate-300 hover:border-brand hover:bg-slate-100 transition-all cursor-pointer h-40 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-brand"
        >
          <span className="text-3xl">+</span>
          <span className="font-medium">Create New Board</span>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Board">
        <form onSubmit={handleCreateBoard} className="space-y-4">
          <Input 
            label="Board Title" 
            value={newTitle} 
            onChange={e => setNewTitle(e.target.value)} 
            placeholder="e.g. Q3 Roadmap" 
            autoFocus 
            required 
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Board</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
