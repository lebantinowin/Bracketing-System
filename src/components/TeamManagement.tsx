import React, { useState } from 'react';
import type { Team } from '../types';
import { X, Plus, Edit2, Shield, Users } from 'lucide-react';

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
    <div className="metallic-card rounded-3xl p-8 border border-white/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 opacity-20 blur-3xl"></div>
      
      <div className="relative flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase flex items-center gap-3">
            <div className="w-1.5 h-8 bg-metallic-400 rounded-full"></div>
            Combatants
          </h2>
          <p className="text-metallic-500 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Deployment Roster</p>
        </div>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-metallic-950 px-6 py-3 rounded-xl hover:bg-metallic-200 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-white/5"
          >
            <Plus size={18} /> Register Unit
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="relative mb-10 p-6 bg-metallic-900/50 rounded-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <label className="block text-[10px] font-black text-metallic-400 uppercase mb-2 ml-1 tracking-widest">Unit Designation</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ENTER UNIT NAME"
                className="w-full px-4 py-3 bg-metallic-950 border border-white/5 rounded-xl focus:outline-none focus:border-metallic-400 transition-all text-white font-bold placeholder-metallic-800"
                autoFocus
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-metallic-400 uppercase mb-2 ml-1 tracking-widest">Priority</label>
              <input
                type="number"
                value={formData.seed}
                onChange={(e) => setFormData({ ...formData, seed: e.target.value })}
                placeholder="--"
                className="w-full px-4 py-3 bg-metallic-950 border border-white/5 rounded-xl focus:outline-none focus:border-metallic-400 transition-all text-white font-bold placeholder-metallic-800"
                min="1"
              />
            </div>
            <div className="md:col-span-3 flex items-end gap-3">
              <button
                type="submit"
                className="flex-1 bg-metallic-700 text-white px-4 py-3 rounded-xl hover:bg-metallic-600 font-black text-[10px] uppercase tracking-widest shadow-lg transition-all"
              >
                {editingId ? 'Update' : 'Deploy'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-3 bg-metallic-800 text-metallic-500 rounded-xl hover:bg-metallic-700 hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div key={team.id} className="group relative p-5 bg-metallic-900/30 rounded-2xl border border-white/5 hover:border-white/20 transition-all hover:bg-metallic-800/30">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-metallic-900 rounded-xl flex items-center justify-center text-metallic-400 border border-white/5 group-hover:bg-metallic-100 group-hover:text-metallic-950 transition-all duration-500">
                  <span className="text-xl font-black">{team.seed || '?'}</span>
                </div>
                <div>
                  <h3 className="font-black text-metallic-100 text-lg group-hover:text-white transition-colors uppercase tracking-tight italic">{team.name}</h3>
                  <p className="text-[9px] font-bold text-metallic-600 uppercase tracking-[0.2em]">SIGNATURE: {team.id.split('-')[1]}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <button
                  onClick={() => handleEdit(team)}
                  className="p-2 text-metallic-500 hover:text-white transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onRemoveTeam(team.id)}
                  className="p-2 text-metallic-500 hover:text-red-400 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && !showForm && (
        <div className="relative text-center py-20 bg-metallic-900/20 rounded-3xl border-2 border-dashed border-white/5">
          <Users size={48} className="mx-auto mb-4 text-metallic-800" />
          <h3 className="text-xl font-black text-metallic-400 uppercase tracking-tighter italic">No Active Combatants</h3>
          <p className="text-metallic-600 text-xs font-bold uppercase tracking-widest mt-2">Initialize the roster to begin deployment.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-8 bg-white/10 text-white px-8 py-3 rounded-xl hover:bg-white/20 font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all"
          >
            Register First Unit
          </button>
        </div>
      )}
    </div>
  );
};
