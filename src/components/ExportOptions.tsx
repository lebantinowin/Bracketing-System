import React from 'react';
import type { Bracket } from '../types';
import { exportToJSON, exportToCSV, exportToPDF, exportToHTML } from '../utils/exportUtils';
import { Download, FileJson, FileText, FileSpreadsheet, File, ChevronRight, Info } from 'lucide-react';

interface ExportOptionsProps {
  bracket: Bracket;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ bracket }) => {
  const slug = bracket.name.replace(/\s+/g, '_');

  const exportOptions = [
    {
      id: 'json',
      name: 'JSON',
      description: 'Raw data for external processing.',
      icon: FileJson,
      action: () => exportToJSON(bracket, `${slug}.json`),
    },
    {
      id: 'csv',
      name: 'CSV Spreadsheet',
      description: 'Tabular format for spreadsheet apps.',
      icon: FileSpreadsheet,
      action: () => exportToCSV(bracket, `${slug}.csv`),
    },
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Print-ready professional document.',
      icon: FileText,
      action: () => exportToPDF(bracket, `${slug}.pdf`),
    },
    {
      id: 'html',
      name: 'HTML Page',
      description: 'Interactive browser-ready format.',
      icon: File,
      action: () => exportToHTML(bracket, `${slug}.html`),
    },
  ];

  return (
    <div className="card">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-metallic-300">
        <div className="w-9 h-9 bg-bg border border-metallic-300 rounded-xl flex items-center justify-center text-metallic-700">
          <Download size={18} />
        </div>
        <div>
          <h2 className="heading text-xl">Export Options</h2>
          <p className="text-sm text-metallic-500 mt-0.5">Download bracket data and reports</p>
        </div>
      </div>

      {/* Export cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {exportOptions.map(({ id, name, description, icon: Icon, action }) => (
          <button
            key={id}
            onClick={action}
            className="group p-5 rounded-xl border border-metallic-300 bg-surface hover:border-metallic-600 hover:shadow-sm transition-all text-left flex flex-col gap-3 active:scale-[.98]"
          >
            <span className="text-metallic-500 group-hover:text-metallic-900 transition-colors">
              <Icon size={22} />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-sm text-metallic-900">{name}</p>
              <p className="text-xs text-metallic-500 mt-0.5 leading-snug">{description}</p>
            </div>
            <div className="flex items-center gap-1 label-xs text-metallic-500 group-hover:text-metallic-900 transition-colors">
              Export <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Info note */}
      <div className="mt-6 flex items-start gap-3 px-4 py-3.5 bg-bg rounded-xl border border-metallic-300">
        <Info size={15} className="text-metallic-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-metallic-800">Best Practice</p>
          <p className="text-xs text-metallic-500 mt-1 leading-relaxed">
            Export your bracket periodically. Use JSON for data backups and PDF for sharing with participants.
          </p>
        </div>
      </div>
    </div>
  );
};
