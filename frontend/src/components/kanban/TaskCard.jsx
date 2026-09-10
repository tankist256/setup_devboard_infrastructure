import { useState } from 'react';
import { api } from '../../lib/api';
import TaskModal from './TaskModal';

export default function TaskCard({ task, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Delete task?')) return;
    try {
      await api.deleteTask(task.id);
      onUpdate();
    } catch(err) { console.error(err); }
  };

  const handleMoveLeft = (e) => { 
    e.stopPropagation(); 
    window.dispatchEvent(new CustomEvent('move-task', { detail: { task, direction: 'left' }})); 
  };
  
  const handleMoveRight = (e) => { 
    e.stopPropagation(); 
    window.dispatchEvent(new CustomEvent('move-task', { detail: { task, direction: 'right' }})); 
  };

  return (
    <>
      <div
        onClick={() => setIsEditing(true)}
        className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer group relative"
      >
        <h4 className="font-medium text-slate-800 text-sm mb-1">{task.title}</h4>
        {task.description && (
          <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
        )}
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white/90 rounded px-1 shadow-sm border border-slate-100">
          <button onClick={handleMoveLeft} className="text-slate-400 hover:text-brand px-1 cursor-pointer" title="Move Left">&larr;</button>
          <button onClick={handleMoveRight} className="text-slate-400 hover:text-brand px-1 cursor-pointer" title="Move Right">&rarr;</button>
          <button onClick={handleDelete} className="text-slate-400 hover:text-red-500 px-1 ml-1 cursor-pointer" title="Delete">&times;</button>
        </div>
      </div>

      <TaskModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        task={task}
        onSaved={onUpdate}
      />
    </>
  );
}
