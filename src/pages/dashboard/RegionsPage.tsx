import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_REGIONS, MOCK_TEAM } from '@/lib/mockData';
import type { Region, TeamMember } from '@/types';
import { MapPin, Users, CheckSquare, Plus, Trash2, Edit3, X, Map, BarChart } from 'lucide-react';
import { toast } from 'sonner';

export default function RegionsPage() {
  const [regions, setRegions] = useLocalStorage<Region[]>('force1_regions', MOCK_REGIONS);
  const [team] = useLocalStorage<TeamMember[]>('force1_team', MOCK_TEAM);

  // States
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [regionToEdit, setRegionToEdit] = useState<Region | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    agentCount: 0,
    managerCount: 0,
    activeTasksCount: 0,
    completionRate: 85,
  });

  const handleCreateRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name) {
      toast.error('Region name is required.');
      return;
    }

    const newRegion: Region = {
      id: 'reg-' + Math.random().toString(36).substr(2, 9),
      name: formState.name,
      agentCount: formState.agentCount,
      managerCount: formState.managerCount,
      activeTasksCount: formState.activeTasksCount,
      completionRate: formState.completionRate,
    };

    setRegions(prev => [...prev, newRegion]);
    setIsCreateOpen(false);
    toast.success(`Region "${formState.name}" created successfully!`);
    resetForm();
  };

  const handleEditRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regionToEdit) return;
    if (!formState.name) {
      toast.error('Region name is required.');
      return;
    }

    setRegions(prev => prev.map(r => r.id === regionToEdit.id ? { ...r, ...formState } : r));
    setIsEditOpen(false);
    setRegionToEdit(null);
    toast.success('Region metadata updated.');
  };

  const openEditModal = (region: Region) => {
    setRegionToEdit(region);
    setFormState({
      name: region.name,
      agentCount: region.agentCount,
      managerCount: region.managerCount,
      activeTasksCount: region.activeTasksCount,
      completionRate: region.completionRate,
    });
    setIsEditOpen(true);
  };

  const handleDeleteRegion = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the region: "${name}"?`)) {
      setRegions(prev => prev.filter(r => r.id !== id));
      toast.success('Region deleted.');
      if (selectedRegion?.id === id) setSelectedRegion(null);
    }
  };

  const resetForm = () => {
    setFormState({
      name: '',
      agentCount: 0,
      managerCount: 0,
      activeTasksCount: 0,
      completionRate: 80,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-[#244855] via-[#244855]/95 to-[#E64833]/80 p-6 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <MapPin className="w-6 h-6 text-[#FBE9D0]" />
            <h1 className="text-2xl md:text-3xl font-bold font-display">Region Zones</h1>
          </div>
          <p className="text-white/70 text-sm">Configure field operational zones, assign target rates, and verify staffing distributions.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsCreateOpen(true); }}
          className="flex items-center gap-2 px-5 py-3 bg-[#E64833] hover:bg-[#cc3d29] rounded-xl text-white font-bold text-sm shadow transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" /> Add Region Zone
        </button>
      </div>

      {/* Region Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map(region => {
          // Find managers and agents currently working in this region
          const staffCount = team.filter(t => t.region === region.name).length;
          
          return (
            <div 
              key={region.id} 
              className="card-base p-5 border border-[#90AEAD]/10 hover:border-[#244855]/30 hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#244855]/10 dark:bg-[#244855]/20 rounded-xl flex items-center justify-center text-[#244855] dark:text-[#E64833]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => openEditModal(region)} 
                      className="p-1.5 rounded-lg bg-[#f8fafb] dark:bg-[#1a2d38] border border-[#90AEAD]/20 hover:border-[#244855] text-[#90AEAD] hover:text-[#244855] dark:hover:text-white transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteRegion(region.id, region.name)} 
                      className="p-1.5 rounded-lg bg-[#f8fafb] dark:bg-[#1a2d38] border border-[#90AEAD]/20 hover:border-red-500 text-[#90AEAD] hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base text-[#244855] dark:text-white font-display mb-1">{region.name}</h3>
                <span className="text-[10px] bg-green-500/10 text-green-700 dark:text-green-400 font-bold px-2 py-0.5 rounded">Operational Active</span>

                <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-[#90AEAD]/10 my-4 text-xs text-[#90AEAD]">
                  <div>
                    <span>Agents</span>
                    <span className="block font-bold text-sm text-[#244855] dark:text-white mt-0.5">{region.agentCount}</span>
                  </div>
                  <div>
                    <span>Managers</span>
                    <span className="block font-bold text-sm text-[#244855] dark:text-white mt-0.5">{region.managerCount}</span>
                  </div>
                  <div>
                    <span>Active Tasks</span>
                    <span className="block font-bold text-sm text-[#244855] dark:text-white mt-0.5">{region.activeTasksCount}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#90AEAD]">Task Target Success</span>
                  <span className="font-bold text-[#E64833]">{region.completionRate}%</span>
                </div>
                <div className="w-full bg-[#90AEAD]/20 rounded-full h-2">
                  <div className="bg-[#E64833] h-2 rounded-full transition-all" style={{ width: `${region.completionRate}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE REGION MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2d38] rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-scale-in">
            <div className="p-5 border-b border-[#90AEAD]/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#244855] dark:text-white font-display">Add Regional Zone</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateRegion} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Zone Region Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Pune City Center"
                  value={formState.name}
                  onChange={e => setFormState(f => ({ ...f, name: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Assigned Agents</label>
                  <input
                    type="number"
                    value={formState.agentCount}
                    onChange={e => setFormState(f => ({ ...f, agentCount: parseInt(e.target.value) || 0 }))}
                    className="input-field text-xs"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Assigned Managers</label>
                  <input
                    type="number"
                    value={formState.managerCount}
                    onChange={e => setFormState(f => ({ ...f, managerCount: parseInt(e.target.value) || 0 }))}
                    className="input-field text-xs"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Active Tasks</label>
                  <input
                    type="number"
                    value={formState.activeTasksCount}
                    onChange={e => setFormState(f => ({ ...f, activeTasksCount: parseInt(e.target.value) || 0 }))}
                    className="input-field text-xs"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Success Target Rate (%)</label>
                  <input
                    type="number"
                    value={formState.completionRate}
                    onChange={e => setFormState(f => ({ ...f, completionRate: parseInt(e.target.value) || 0 }))}
                    className="input-field text-xs"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-[#E64833] hover:bg-[#cc3d29] text-white rounded-xl font-bold text-sm shadow transition-all mt-2">
                Register Region Zone
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT REGION MODAL */}
      {isEditOpen && regionToEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2d38] rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-scale-in">
            <div className="p-5 border-b border-[#90AEAD]/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#244855] dark:text-white font-display">Configure Region Zone</h3>
              <button onClick={() => { setIsEditOpen(false); setRegionToEdit(null); }} className="p-1 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleEditRegion} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Region Name *</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={e => setFormState(f => ({ ...f, name: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Assigned Agents</label>
                  <input
                    type="number"
                    value={formState.agentCount}
                    onChange={e => setFormState(f => ({ ...f, agentCount: parseInt(e.target.value) || 0 }))}
                    className="input-field text-xs"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Assigned Managers</label>
                  <input
                    type="number"
                    value={formState.managerCount}
                    onChange={e => setFormState(f => ({ ...f, managerCount: parseInt(e.target.value) || 0 }))}
                    className="input-field text-xs"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Active Tasks</label>
                  <input
                    type="number"
                    value={formState.activeTasksCount}
                    onChange={e => setFormState(f => ({ ...f, activeTasksCount: parseInt(e.target.value) || 0 }))}
                    className="input-field text-xs"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Success Target Rate (%)</label>
                  <input
                    type="number"
                    value={formState.completionRate}
                    onChange={e => setFormState(f => ({ ...f, completionRate: parseInt(e.target.value) || 0 }))}
                    className="input-field text-xs"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-[#244855] hover:bg-[#1a3340] text-white rounded-xl font-bold text-sm shadow transition-all mt-2">
                Save Region Details
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
