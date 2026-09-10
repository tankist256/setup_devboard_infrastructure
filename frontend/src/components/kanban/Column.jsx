import { useState } from 'react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { api } from '../../lib/api';

export default function Column({ column, boardId, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);

  const handleDelete = async () => {
    if (!confirm('Delete this column?')) return;
    try {
      await api.deleteColumn(column.id);
      onUpdate();
    } catch(err) { console.error(err); }
  };

  const handleUpdateTitle = async () => {
    setIsEditingTitle(false);
    if (title && title !== column.title) {
      try {
        await api.updateColumn(column.id, { title, position: column.position });
        onUpdate();
      } catch(err) { setTitle(column.title); }
    } else {
      setTitle(column.title);
    }
  };

  return (
    <div className="w-80 flex-shrink-0 bg-slate-100 rounded-xl flex flex-col max-h-full overflow-hidden shadow-sm border border-slate-200/50">
      <div className="p-4 flex items-center justify-between group border-b border-slate-200 bg-slate-100/50">
        {isEditingTitle ? (
          <input
            autoFocus
            className="font-semibold px-2 py-1 bg-white rounded border border-brand outline-none w-full mr-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={e => e.key === 'Enter' && handleUpdateTitle()}
          />
        ) : (
          <h3 className="font-semibold text-slate-800 cursor-pointer flex-1" onClick={() => setIsEditingTitle(true)}>
            {column.title} <span className="ml-2 text-xs text-slate-500 font-normal bg-slate-200 px-2 py-0.5 rounded-full">{column.tasks?.length || 0}</span>
          </h3>
        )}
        <button onClick={handleDelete} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-1 cursor-pointer">
          &times;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[100px]">
        {column.tasks?.map((task) => (
          <TaskCard key={task.id} task={task} onUpdate={onUpdate} />
        ))}
      </div>

      <div className="p-3 border-t border-slate-200">
        <button onClick={() => setIsAdding(true)} className="w-full py-2 text-sm font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer">
          <span>+</span> Add Task
        </button>
      </div>

      <TaskModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        columnId={column.id}
        onSaved={onUpdate}
      />
    </div>
  );
}
