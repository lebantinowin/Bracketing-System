import React, { useState } from 'react';
import type { Team } from '../types';
import { X, Plus, Edit2 } from 'lucide-react';

interface TeamManagementProps {
  teams: Team[];
  onAddTeam: (team: Team) => void;
  onRemoveTeam: (teamId: string) => void;
  onUpdateTeam: (team: Team) => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({
  teams,
  onAddTeam,
  onRemoveTeam,
  onUpdateTeam,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', seed: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Team name is required');
      return;
    }

    const team: Team = {
      id: editingId || `team-${Date.now()}`,
      name: formData.name,
      seed: formData.seed ? parseInt(formData.seed) : undefined,
    };

    if (editingId) {
      onUpdateTeam(team);
      setEditingId(null);
    } else {
      onAddTeam(team);
    }

    setFormData({ name: '', seed: '' });
    setShowForm(false);
  };

  const handleEdit = (team: Team) => {
    setEditingId(team.id);
    setFormData({
      name: team.name,
      seed: team.seed ? String(team.seed) : '',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', seed: '' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-30 blur-3xl"></div>
      
      <div className="relative flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            Participating Teams
          </h2>
          <p className="text-slate-500 font-medium mt-1">Manage all contestants and their seeding</p>
        </div>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 font-bold text-sm uppercase tracking-widest"
          >
            <Plus size={18} /> Add Team
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="relative mb-8 p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-tighter">Team Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter team name"
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-bold"
                autoFocus
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-tighter">Seed</label>
              <input
                type="number"
                value={formData.seed}
                onChange={(e) => setFormData({ ...formData, seed: e.target.value })}
                placeholder="Auto"
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-bold"
                min="1"
              />
            </div>
            <div className="md:col-span-3 flex items-end gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 font-black text-xs uppercase tracking-widest shadow-lg transition-all"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-3 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 font-black text-xs uppercase tracking-widest transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div key={team.id} className="group relative p-5 bg-white rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <span className="text-xl font-black">{team.seed || '?'}</span>
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{team.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team ID: {team.id.split('-')[1]}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={() => handleEdit(team)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Edit Team"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onRemoveTeam(team.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Remove Team"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && !showForm && (
        <div className="relative text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No teams added yet</h3>
          <p className="text-slate-500 mb-6 max-w-xs mx-auto">Start building your tournament by adding the participating teams.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all"
          >
            Add First Team
          </button>
        </div>
      )}
    </div>
  );
};
