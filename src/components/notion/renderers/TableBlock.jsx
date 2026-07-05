import React from 'react';
import RichTextRenderer from '../RichTextRenderer';

export default function TableBlock({ block }) {
  if (block.type === 'table_row') {
    // If it's a standalone table row, don't render it directly (it should be rendered by its parent table)
    return null;
  }

  const tableData = block.table;
  const rows = block.children;

  if (!tableData || !rows || rows.length === 0) return null;

  const hasColumnHeader = tableData.has_column_header;
  const hasRowHeader = tableData.has_row_header;

  return (
    <div style={{ overflowX: 'auto', marginBottom: '1.5em' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9em',
        border: '1px solid var(--border)'
      }}>
        <tbody>
          {rows.map((row, rowIndex) => {
            if (row.type !== 'table_row') return null;
            
            const isHeaderRow = hasColumnHeader && rowIndex === 0;
            const cells = row.table_row?.cells || [];
            
            return (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--border)', background: isHeaderRow ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                {cells.map((cell, cellIndex) => {
                  const isHeaderCol = hasRowHeader && cellIndex === 0;
                  const isHeader = isHeaderRow || isHeaderCol;
                  
                  return (
                    <td 
                      key={cellIndex} 
                      style={{ 
                        padding: '8px 12px', 
                        borderRight: cellIndex < cells.length - 1 ? '1px solid var(--border)' : 'none',
                        fontWeight: isHeader ? 600 : 400,
                        backgroundColor: isHeaderCol && !isHeaderRow ? 'rgba(255,255,255,0.02)' : 'transparent',
                        verticalAlign: 'top'
                      }}
                    >
                      <RichTextRenderer textArray={cell} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
