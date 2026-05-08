import React from 'react';
import type { Bracket } from '../types';
import { exportToJSON, exportToCSV, exportToPDF, exportToHTML } from '../utils/exportUtils';
import { Download, FileJson, FileText, FileSpreadsheet, File, ChevronRight, Trophy, Shield } from 'lucide-react';

interface ExportOptionsProps {
  bracket: Bracket;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ bracket }) => {
  const exportOptions = [
    {
      id: 'json',
      name: 'JSON DATA',
      description: 'RAW SYSTEM ARRAY FOR EXTERNAL PROCESSING.',
      icon: FileJson,
      action: () => exportToJSON(bracket, `${bracket.name.replace(/\s+/g, '_')}.json`),
    },
    {
      id: 'csv',
      name: 'CSV SHEET',
      description: 'COMPATIBLE TABULAR MATRIX FORMAT.',
      icon: FileSpreadsheet,
      action: () => exportToCSV(bracket, `${bracket.name.replace(/\s+/g, '_')}.csv`),
    },
    {
      id: 'pdf',
      name: 'OFFICIAL PDF',
      description: 'PROFESSIONAL ARCHIVE ENCRYPTED DOCUMENT.',
      icon: FileText,
      action: () => exportToPDF(bracket, `${bracket.name.replace(/\s+/g, '_')}.pdf`),
    },
    {
      id: 'html',
      name: 'HTML WEB',
      description: 'HYPERTEXT BROADCAST READY MODULE.',
      icon: File,
      action: () => exportToHTML(bracket, `${bracket.name.replace(/\s+/g, '_')}.html`),
    },
  ];

  return (
    <div className="metallic-card rounded-3xl p-8 border border-white/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 opacity-20 blur-3xl"></div>
      
      <div className="relative flex items-center gap-5 mb-12">
        <div className="bg-white text-metallic-950 p-4 rounded-2xl shadow-xl border border-white/20 shine-effect">
          <Download size={28} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">Data Extraction</h2>
          <p className="text-metallic-500 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">External Output Protocols</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={option.action}
              className="relative p-8 rounded-3xl border border-white/5 bg-metallic-900/30 hover:border-white/40 hover:bg-white/5 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-2 transition-all duration-500 text-left group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center mb-6">
                <div className="p-3 bg-metallic-950 rounded-xl border border-white/5 text-metallic-500 group-hover:text-white transition-all duration-500">
                  <Icon size={24} />
                </div>
              </div>
              <h3 className="font-black text-metallic-100 text-lg group-hover:text-white transition-colors uppercase tracking-tighter italic">{option.name}</h3>
              <p className="text-[10px] text-metallic-600 font-black mt-3 leading-relaxed tracking-widest uppercase">{option.description}</p>
              
              <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-white uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                INITIATE <ChevronRight size={14} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-12 p-8 bg-metallic-950 rounded-3xl relative overflow-hidden group border border-white/5 shadow-inner">
        <div className="relative flex items-center gap-6">
          <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-metallic-400 group-hover:text-white transition-colors">
            <Shield size={28} />
          </div>
          <div>
            <span className="text-[9px] font-black text-metallic-500 uppercase tracking-[0.4em] block mb-1">Archive Integrity Policy</span>
            <p className="text-white font-black text-sm uppercase tracking-widest opacity-80 leading-relaxed">
              Export protocols ensure parity between local synchronization and external archives. Maintain regular backups for system stability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
