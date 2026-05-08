import React from 'react';
import type { Bracket } from '../types';
import { exportToJSON, exportToCSV, exportToPDF, exportToHTML } from '../utils/exportUtils';
import { Download, FileJson, FileText, FileSpreadsheet, File } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Download size={24} className="text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Export Bracket</h2>
      </div>

      <p className="text-gray-600 mb-6">Export your tournament bracket in various formats</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={option.action}
              className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex items-center mb-2">
                <Icon size={24} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-700">{option.name}</h3>
              <p className="text-xs text-gray-600 mt-1">{option.description}</p>
              <div className="mt-3 text-sm font-medium text-blue-600 group-hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                Export →
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Export your bracket regularly to create backups and share with participants.
        </p>
      </div>
    </div>
  );
};
