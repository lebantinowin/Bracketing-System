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
    if (!formData.name.trim()) return;

    const team: Team = {
      id: editingId || `team-${Date.now()}`,
      name: formData.name,
      seed: formData.seed ? parseInt(formData.seed) : undefined,
      logo: formData.logo || undefined
    };

    if (editingId) {
      onUpdateTeam(team);
      setEditingId(null);
    } else {
      onAddTeam(team);
    }

    setFormData({ name: '', seed: '', logo: '' });
    setShowForm(false);
  };

  const handleEdit = (team: Team) => {
    setEditingId(team.id);
    setFormData({
      name: team.name,
      seed: team.seed ? String(team.seed) : '',
      logo: team.logo || ''
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', seed: '', logo: '' });
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-metallic-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-metallic-50 rounded-xl flex items-center justify-center border border-metallic-200 text-metallic-600">
            <Users size={20} />
          </div>
          <div>
            <h2 className="heading text-xl">Team Management</h2>
            <p className="text-xs text-metallic-500 font-medium">{teams.length} participants registered</p>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="metallic-accent flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[.98] transition-all shrink-0"
          >
            <Plus size={16} /> Add Team
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-10 p-6 bg-metallic-50/50 rounded-2xl border border-metallic-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Logo Upload */}
              <div className="md:col-span-1 flex flex-col items-center">
                <label className="label-xs text-center mb-2">Team Emblem</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-2xl border-2 border-dashed border-metallic-300 hover:border-metallic-400 bg-white flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group"
                >
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload size={20} className="text-metallic-300 group-hover:text-metallic-400 mb-1" />
                      <span className="text-[10px] text-metallic-400 font-bold uppercase">Upload</span>
                    </>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                {formData.logo && (
                  <button type="button" onClick={() => setFormData(p => ({...p, logo: ''}))} className="text-[10px] text-red-500 font-bold uppercase mt-2 hover:underline">Remove</button>
                )}
              </div>

              {/* Form Fields */}
              <div className="md:col-span-3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="label-xs">Team Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Phoenix Elite"
                      className="input-base text-base font-bold"
                      autoFocus
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="label-xs">Seed # <span className="font-normal normal-case italic text-metallic-400">(opt)</span></label>
                    <input
                      type="number"
                      value={formData.seed}
                      onChange={(e) => setFormData({ ...formData, seed: e.target.value })}
                      placeholder="Auto"
                      className="input-base"
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 metallic-accent py-2.5 rounded-xl font-bold text-sm">
                    {editingId ? 'Save Changes' : 'Register Team'}
                  </button>
                  <button type="button" onClick={handleCancel} className="flex-1 bg-white border border-metallic-200 text-metallic-600 py-2.5 rounded-xl font-bold text-sm hover:bg-metallic-50">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="group relative bg-white border border-metallic-200 rounded-2xl p-4 hover:shadow-xl hover:shadow-metallic-950/5 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-metallic-50 border border-metallic-200 flex items-center justify-center overflow-hidden shrink-0">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-black text-metallic-400">{getInitials(team.name)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-metallic-900 truncate">{team.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {team.seed && <span className="badge">Seed #{team.seed}</span>}
                    {!team.seed && <span className="text-[10px] text-metallic-400 font-medium uppercase tracking-wider">Unranked</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleEdit(team)} className="p-1.5 text-metallic-400 hover:text-metallic-950 hover:bg-metallic-50 rounded-lg"><Edit2 size={14} /></button>
                  <button onClick={() => onRemoveTeam(team.id)} className="p-1.5 text-metallic-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><X size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-metallic-100 rounded-3xl">
          <div className="w-16 h-16 bg-metallic-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-metallic-100 text-metallic-300">
            <Users size={32} />
          </div>
          <h3 className="font-bold text-metallic-900">No Participants Added</h3>
          <p className="text-sm text-metallic-500 mt-1 max-w-xs mx-auto">Start building your tournament by adding teams or players below.</p>
          <button onClick={() => setShowForm(true)} className="mt-6 px-6 py-2.5 bg-metallic-950 text-white rounded-xl font-bold text-sm hover:opacity-90">Register First Team</button>
        </div>
      )}
    </div>
  );
};
