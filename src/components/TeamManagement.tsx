import React, { useState, useRef } from 'react';
import type { Team } from '../types';
import { X, Plus, Edit2, Users, Upload, Image as ImageIcon } from 'lucide-react';

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
  const [formData, setFormData] = useState({ name: '', seed: '', logo: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { alert('Team name is required'); return; }

    const team: Team = {
      id: editingId || `team-${Date.now()}`,
      name: formData.name,
      seed: formData.seed ? parseInt(formData.seed) : undefined,
      logo: formData.logo || undefined
    };

    if (editingId) { onUpdateTeam(team); setEditingId(null); }
    else { onAddTeam(team); }

    setFormData({ name: '', seed: '', logo: '' });
    setShowForm(false);
  };

  const handleEdit = (team: Team) => {
    setEditingId(team.id);
    setFormData({ name: team.name, seed: team.seed ? String(team.seed) : '', logo: team.logo || '' });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', seed: '', logo: '' });
  };

  return (
    <div className="card">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="heading text-xl">Participating Teams</h2>
          <p className="text-sm text-metallic-500 mt-1">Manage participants and seeding</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="metallic-accent flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[.98] transition-all shrink-0"
          >
            <Plus size={15} /> Add Team
          </button>
        )}
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="mb-6 p-5 bg-bg rounded-xl border border-metallic-300 fade-up">
          <p className="label-xs mb-4">{editingId ? 'Edit Team' : 'New Team'}</p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-1">
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleLogoUpload} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full aspect-square rounded-lg border border-border bg-base flex flex-col items-center justify-center text-secondary hover:border-primary hover:text-primary transition-all overflow-hidden relative group">
                  {formData.logo ? (
                    <>
                      <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-base/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Upload size={14} /></div>
                    </>
                  ) : <ImageIcon size={18} />}
                </button>
              </div>
              <div className="md:col-span-6">
                <label className="label-xs mb-1.5 block">Team Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter team name"
                  className="input-base"
                  autoFocus
                />
              </div>
              <div className="md:col-span-2">
                <label className="label-xs mb-1.5 block">Seed (Opt)</label>
                <input
                  type="number"
                  value={formData.seed}
                  onChange={(e) => setFormData({ ...formData, seed: e.target.value })}
                  placeholder="#"
                  className="input-base"
                  min="1"
                />
              </div>
              <div className="md:col-span-3 flex items-end gap-2 pb-[1px]">
                <button
                  type="submit"
                  className="flex-1 metallic-accent text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 active:scale-[.98] transition-all"
                >
                  {editingId ? 'Update' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-2.5 bg-surface border border-metallic-300 text-metallic-500 hover:text-metallic-900 hover:bg-bg rounded-lg transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Team grid */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {teams.map((team, idx) => (
            <div
              key={team.id}
              className="group flex items-center justify-between gap-3 px-4 py-3 bg-bg rounded-xl border border-metallic-300 hover:border-metallic-500 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded bg-surface border border-border text-xs font-mono text-secondary">
                    {team.seed ?? idx + 1}
                  </span>
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-8 h-8 rounded-full object-cover border border-border bg-base shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-base border border-border flex items-center justify-center text-xs font-bold text-secondary shrink-0">
                      {getInitials(team.name)}
                    </div>
                  )}
                </div>
                <span className="font-bold text-primary text-sm truncate">{team.name}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                <button
                  onClick={() => handleEdit(team)}
                  className="p-1.5 text-metallic-400 hover:text-metallic-900 hover:bg-metallic-200 rounded-lg transition-all"
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => onRemoveTeam(team.id)}
                  className="p-1.5 text-metallic-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Remove"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-14 border border-dashed border-metallic-300 rounded-xl bg-bg">
            <Users size={28} className="mx-auto mb-3 text-metallic-400" />
            <h3 className="text-sm font-bold text-metallic-700">No teams yet</h3>
            <p className="text-xs text-metallic-500 mt-1 mb-4">Add participants to get started.</p>
            <button
              onClick={() => setShowForm(true)}
              className="metallic-accent text-white px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-90 active:scale-[.98] transition-all"
            >
              Add First Team
            </button>
          </div>
        )
      )}
    </div>
  );
};
