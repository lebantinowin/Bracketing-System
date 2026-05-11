import React from 'react';
import type { Bracket } from '../types';
import { exportToJSON, exportToCSV, exportToPDF, exportToHTML } from '../utils/exportUtils';
import { Download, FileJson, FileText, FileSpreadsheet, File, ShieldCheck } from 'lucide-react';

interface ExportOptionsProps {
  bracket: Bracket;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ bracket }) => {
  const exportOptions = [
    {
      id: 'json',
      name: 'Data (JSON)',
      description: 'Machine-readable format for raw data transfer',
      icon: FileJson,
      action: () => exportToJSON(bracket, `${bracket.name.replace(/\s+/g, '_')}.json`),
    },
    {
      id: 'csv',
      name: 'Sheet (CSV)',
      description: 'Spreadsheet compatible tabular format',
      icon: FileSpreadsheet,
      action: () => exportToCSV(bracket, `${bracket.name.replace(/\s+/g, '_')}.csv`),
    },
    {
      id: 'pdf',
      name: 'Report (PDF)',
      description: 'Professional document for printing & sharing',
      icon: FileText,
      action: () => exportToPDF(bracket, `${bracket.name.replace(/\s+/g, '_')}.pdf`),
    },
    {
      id: 'html',
      name: 'Web (HTML)',
      description: 'Static web-ready format with styles',
      icon: File,
      action: () => exportToHTML(bracket, `${bracket.name.replace(/\s+/g, '_')}.html`),
    },
  ];

  return (
    <div className="card !p-0 overflow-hidden">
      <div className="px-6 py-5 border-b border-metallic-200 bg-metallic-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-metallic-950 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Download size={20} />
          </div>
          <div>
            <h2 className="heading text-xl leading-tight">Export Engine</h2>
            <p className="text-[10px] text-metallic-500 font-mono tracking-widest uppercase mt-0.5">Generate Tournament Documents</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {exportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={option.action}
                className="group relative flex flex-col p-6 bg-white border border-metallic-200 rounded-2xl text-left hover:border-metallic-950 hover:shadow-xl hover:shadow-metallic-950/5 transition-all active:scale-[0.98]"
              >
                <div className="w-12 h-12 mb-4 rounded-xl bg-metallic-50 border border-metallic-100 flex items-center justify-center text-metallic-400 group-hover:bg-metallic-950 group-hover:text-white transition-all">
                  <Icon size={24} />
                </div>
                <h3 className="font-black text-metallic-900 group-hover:text-metallic-950 transition-colors uppercase tracking-tight italic">{option.name}</h3>
                <p className="text-xs text-metallic-500 mt-2 font-medium leading-relaxed">{option.description}</p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-metallic-400 group-hover:text-metallic-950 transition-colors">
                  Generate <span className="text-[14px]">→</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-metallic-50 rounded-2xl border border-metallic-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-metallic-200 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-metallic-400" />
          </div>
          <p className="text-xs font-medium text-metallic-600 italic">
            Exports include all match results, team metadata, and generated bracket hierarchical structures.
          </p>
        </div>
      </div>
    </div>
  );
};
