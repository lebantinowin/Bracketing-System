import type { Bracket } from '../types';
import jsPDF from 'jspdf';

/**
 * Export bracket to JSON
 */
export const exportToJSON = (bracket: Bracket, filename: string = 'bracket.json') => {
  const dataStr = JSON.stringify(bracket, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export bracket to CSV
 */
export const exportToCSV = (bracket: Bracket, filename: string = 'bracket.csv') => {
  let csv = 'Tournament Bracket Export\n\n';
  csv += `Tournament,${bracket.name}\n`;
  csv += `Format,${bracket.format}\n`;
  csv += `Status,${bracket.status}\n`;
  csv += `Created,${new Date(bracket.createdAt).toLocaleString()}\n`;
  csv += `Updated,${new Date(bracket.updatedAt).toLocaleString()}\n\n`;

  // Teams
  csv += 'TEAMS\n';
  csv += 'Name,Seed\n';
  bracket.teams.forEach((team) => {
    csv += `"${team.name}",${team.seed || 'N/A'}\n`;
  });
  csv += '\n';

  // Matches
  csv += 'MATCHES\n';
  csv += 'Round,Match,Team 1,Score 1,Team 2,Score 2,Winner\n';
  bracket.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      const team1 = match.team1?.name || 'TBD';
      const team2 = match.team2?.name || 'BYE';
      const winner = match.winner?.name || '';
      csv += `${round.number},${match.matchNumber + 1},"${team1}",${match.score1 || ''},\"${team2}\",${ match.score2 || ''},"${winner}"\n`;
    });
  });

  const dataBlob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export bracket to PDF
 */
export const exportToPDF = (bracket: Bracket, filename: string = 'bracket.pdf') => {
  const pdf = new jsPDF();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 10;

  // Header
  pdf.setFontSize(20);
  pdf.text(bracket.name, 10, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.text(`Format: ${bracket.format} | Status: ${bracket.status}`, 10, yPosition);
  yPosition += 5;
  pdf.text(
    `Created: ${new Date(bracket.createdAt).toLocaleString()} | Updated: ${new Date(bracket.updatedAt).toLocaleString()}`,
    10,
    yPosition
  );
  yPosition += 10;

  // Teams section
  pdf.setFontSize(12);
  pdf.text('Teams', 10, yPosition);
  yPosition += 5;

  pdf.setFontSize(9);
  bracket.teams.forEach((team, idx) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 10;
    }
    pdf.text(`${idx + 1}. ${team.name}${team.seed ? ` (Seed: ${team.seed})` : ''}`, 15, yPosition);
    yPosition += 5;
  });

  yPosition += 5;

  // Matches section
  pdf.setFontSize(12);
  pdf.text('Match Results', 10, yPosition);
  yPosition += 5;

  pdf.setFontSize(9);
  bracket.rounds.forEach((round) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 10;
    }

    pdf.setFont(undefined as any, 'bold');
    pdf.text(`Round ${round.number}`, 10, yPosition);
    yPosition += 4;

    pdf.setFont(undefined as any, 'normal');
    round.matches.forEach((match) => {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = 10;
      }

      const team1 = match.team1?.name || 'TBD';
      const team2 = match.team2?.name || 'BYE';
      const score1 = match.score1 !== undefined ? match.score1 : '';
      const score2 = match.score2 !== undefined ? match.score2 : '';

      pdf.text(
        `  Match ${match.matchNumber + 1}: ${team1} ${score1} vs ${score2} ${team2}${match.winner ? ` [Winner: ${match.winner.name}]` : ''}`,
        15,
        yPosition
      );
      yPosition += 4;
    });

    yPosition += 2;
  });

  pdf.save(filename);
};

/**
 * Export bracket to HTML for printing
 */
export const exportToHTML = (bracket: Bracket, filename: string = 'bracket.html') => {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${bracket.name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    h2 { color: #666; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #4CAF50; color: white; }
    tr:nth-child(even) { background-color: #f2f2f2; }
    .winner { font-weight: bold; background-color: #90EE90; }
    .meta { color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>${bracket.name}</h1>
  <p class="meta">
    Format: ${bracket.format} | Status: ${bracket.status}<br>
    Created: ${new Date(bracket.createdAt).toLocaleString()}<br>
    Updated: ${new Date(bracket.updatedAt).toLocaleString()}
  </p>

  <h2>Teams</h2>
  <table>
    <tr>
      <th>Name</th>
      <th>Seed</th>
    </tr>
    ${bracket.teams.map((team) => `
      <tr>
        <td>${team.name}</td>
        <td>${team.seed || 'N/A'}</td>
      </tr>
    `).join('')}
  </table>

  <h2>Matches</h2>
  ${bracket.rounds.map((round) => `
    <h3>Round ${round.number}</h3>
    <table>
      <tr>
        <th>Match</th>
        <th>Team 1</th>
        <th>Score</th>
        <th>Team 2</th>
        <th>Score</th>
        <th>Winner</th>
      </tr>
      ${round.matches.map((match) => {
        const team1Name = match.team1?.name || 'TBD';
        const team2Name = match.team2?.name || 'BYE';
        const winnerName = match.winner?.name || '';
        return `
          <tr ${match.winner ? 'class="winner"' : ''}>
            <td>Match ${match.matchNumber + 1}</td>
            <td>${team1Name}</td>
            <td>${match.score1 !== undefined ? match.score1 : ''}</td>
            <td>${team2Name}</td>
            <td>${match.score2 !== undefined ? match.score2 : ''}</td>
            <td>${winnerName}</td>
          </tr>
        `;
      }).join('')}
    </table>
  `).join('')}
</body>
</html>`;

  const dataBlob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
