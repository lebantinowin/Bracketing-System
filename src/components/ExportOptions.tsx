import React from 'react';
import type { Bracket } from '../types';
import { exportToJSON, exportToCSV, exportToPDF, exportToHTML } from '../utils/exportUtils';
import { Download, FileJson, FileText, FileSpreadsheet, File, ChevronRight, Trophy } from 'lucide-react';

interface ExportOptionsProps {
  bracket: Bracket;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ bracket }) => {
  const exportOptions = [
    {
      id: 'json',
      name: 'JSON',
      description: 'Machine-readable format for data processing',
      icon: FileJson,
      action: () => exportToJSON(bracket, `${bracket.name.replace(/\s+/g, '_')}.json`),
    },
    {
      id: 'csv',
      name: 'CSV',
      description: 'Spreadsheet compatible format',
      icon: FileSpreadsheet,
      action: () => exportToCSV(bracket, `${bracket.name.replace(/\s+/g, '_')}.csv`),
    },
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Professional document format',
      icon: FileText,
      action: () => exportToPDF(bracket, `${bracket.name.replace(/\s+/g, '_')}.pdf`),
    },
    {
      id: 'html',
      name: 'HTML',
      description: 'Web-ready format, printable',
      icon: File,
      action: () => exportToHTML(bracket, `${bracket.name.replace(/\s+/g, '_')}.html`),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-30 blur-3xl"></div>
      
      <div className="relative flex items-center gap-4 mb-8">
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg">
          <Download size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Export Engine</h2>
          <p className="text-slate-500 font-medium mt-1">Generate professional reports and data files</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={option.action}
              className="relative p-6 rounded-2xl border-2 border-slate-100 bg-white hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-500 text-left group"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                  <Icon size={24} />
                </div>
              </div>
              <h3 className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{option.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">{option.description}</p>
              
              <div className="mt-4 flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                Generate <ChevronRight size={14} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-10 p-6 bg-slate-900 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
            <Trophy size={20} />
          </div>
          <p className="text-sm font-bold text-slate-400">
            <strong className="text-white">Pro Tip:</strong> Export your bracket after every major round to maintain a historical record of the tournament's progress.
          </p>
        </div>
      </div>
    </div>
  );
};
