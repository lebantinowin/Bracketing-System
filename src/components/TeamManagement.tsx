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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Teams ({teams.length})</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} /> Add Team
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter team name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seed (Optional)</label>
              <input
                type="number"
                value={formData.seed}
                onChange={(e) => setFormData({ ...formData, seed: e.target.value })}
                placeholder="1, 2, 3..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div key={team.id} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{team.name}</h3>
                {team.seed && <p className="text-sm text-gray-600">Seed: #{team.seed}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(team)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onRemoveTeam(team.id)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No teams added yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add First Team
          </button>
        </div>
      )}
    </div>
  );
};
