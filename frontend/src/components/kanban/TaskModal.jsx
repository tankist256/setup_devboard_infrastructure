import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

export default function TaskModal({ isOpen, onClose, task, columnId, onSaved }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const isEditing = !!task;

  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title || '');
      setDescription(task?.description || '');
    }
  }, [isOpen, task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      if (isEditing) {
        await api.updateTask(task.id, { 
          title, 
          description, 
          column_id: task.column_id, 
          position: task.position 
        });
      } else {
        await api.createTask(columnId, { title, description });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setLoading(true);
    try {
      await api.deleteTask(task.id);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Task' : 'Create Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Task title" 
          required 
          autoFocus
        />
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand placeholder:text-slate-400 min-h-[100px] resize-y"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add a more detailed description..."
          />
        </div>

        <div className="flex justify-between pt-4 items-center">
          <div>
            {isEditing && (
              <Button type="button" variant="danger" onClick={handleDelete} disabled={loading}>
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Task'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
