import React from 'react';
import type { Bracket } from '../types';
import { exportToPDF, exportToImage } from '../utils/exportUtils';
import { Download, FileText, File, ChevronRight, Info } from 'lucide-react';

interface ExportOptionsProps {
  bracket: Bracket;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ bracket }) => {
  const slug = bracket.name.replace(/\s+/g, '_');

  const exportOptions = [
    {
      id: 'picture',
      name: 'Picture (PNG)',
      description: 'High-quality image for social media.',
      icon: File,
      action: () => exportToImage('bracket-capture', `${slug}.png`),
    },
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Print-ready professional document.',
      icon: FileText,
      action: () => exportToPDF(bracket, `${slug}.pdf`),
    },
  ];

  return (
    <div className="card">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
        <div className="w-9 h-9 bg-surface border border-border rounded-xl flex items-center justify-center text-secondary">
          <Download size={18} />
        </div>
        <div>
          <h2 className="heading text-xl">Export Options</h2>
          <p className="text-sm text-secondary mt-0.5">Download bracket data and reports</p>
        </div>
      </div>

      {/* Export cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {exportOptions.map(({ id, name, description, icon: Icon, action }) => (
          <button
            key={id}
            onClick={action}
            className="group p-5 rounded-xl border border-border bg-surface hover:border-secondary hover:shadow-sm transition-all text-left flex flex-col gap-3 active:scale-[.98]"
          >
            <span className="text-secondary group-hover:text-primary transition-colors">
              <Icon size={22} />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-sm text-primary">{name}</p>
              <p className="text-xs text-secondary mt-0.5 leading-snug">{description}</p>
            </div>
            <div className="flex items-center gap-1 label-xs text-secondary group-hover:text-primary transition-colors">
              Export <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Info note */}
      <div className="mt-6 flex items-start gap-3 px-4 py-3.5 bg-bg rounded-xl border border-border">
        <Info size={15} className="text-secondary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-primary">Best Practice</p>
          <p className="text-xs text-secondary mt-1 leading-relaxed">
            Export your bracket periodically. Use Picture for sharing on social media and PDF for professional printing.
          </p>
        </div>
      </div>
    </div>
  );
};
