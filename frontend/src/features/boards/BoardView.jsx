import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import Column from '../../components/kanban/Column';
import { Button } from '../../components/ui/Button';

export default function BoardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('');
  const boardRef = useRef(null);

  const fetchBoard = useCallback(async () => {
    try {
      const data = await api.getBoard(id);
      setBoard(data);
      boardRef.current = data;
      setTitle(data.title);
    } catch (err) {
      console.error(err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  useEffect(() => {
    const handleTaskMove = async (e) => {
      const { task, direction } = e.detail;
      const currentBoard = boardRef.current;
      if (!currentBoard) return;
      const colIndex = currentBoard.columns.findIndex(c => c.id === task.column_id);
      if (colIndex === -1) return;

      const targetColIndex = direction === 'left' ? colIndex - 1 : colIndex + 1;
      if (targetColIndex < 0 || targetColIndex >= currentBoard.columns.length) return;

      const targetCol = currentBoard.columns[targetColIndex];
      try {
        await api.moveTask(task.id, { column_id: targetCol.id, position: targetCol.tasks?.length || 0 });
        fetchBoard();
      } catch (err) { console.error(err); }
    };
    window.addEventListener('move-task', handleTaskMove);
    return () => window.removeEventListener('move-task', handleTaskMove);
  }, [fetchBoard]);

  const handleUpdateTitle = async () => {
    setIsEditingTitle(false);
    if (title && title !== board.title) {
      try {
        await api.updateBoard(id, { title });
        fetchBoard();
      } catch (err) { setTitle(board.title); }
    } else {
      setTitle(board.title);
    }
  };

  const handleAddColumn = async () => {
    const colTitle = prompt('Enter column name:');
    if (!colTitle) return;
    try {
      await api.createColumn(id, { title: colTitle });
      fetchBoard();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading board...</div>;
  if (!board) return <div className="p-8 text-slate-500">Board not found</div>;

  return (
    <div className="h-full flex flex-col -m-6 p-6">
      <div className="flex items-center mb-6 shrink-0 gap-4">
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-brand transition-colors text-xl font-bold cursor-pointer">&larr;</button>
        {isEditingTitle ? (
          <input
            autoFocus
            className="text-2xl font-bold text-slate-900 border-b-2 border-brand outline-none bg-transparent"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={e => e.key === 'Enter' && handleUpdateTitle()}
          />
        ) : (
          <h1 className="text-2xl font-bold text-slate-900 cursor-pointer hover:text-brand transition-colors" onClick={() => setIsEditingTitle(true)}>
            {board.title}
          </h1>
        )}
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex flex-row gap-6 h-full items-start pb-4">
          {board.columns?.map(column => (
            <Column key={column.id} column={column} boardId={id} onUpdate={fetchBoard} />
          ))}

          <button
            onClick={handleAddColumn}
            className="shrink-0 w-80 h-[100px] flex items-center justify-center gap-2 bg-slate-200/50 hover:bg-slate-200 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 text-slate-600 font-medium transition-all cursor-pointer"
          >
            <span>+</span> Add Column
          </button>
        </div>
      </div>
    </div>
  );
}
