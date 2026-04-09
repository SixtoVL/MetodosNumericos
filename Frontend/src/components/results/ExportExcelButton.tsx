import React from 'react';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';
import type { Tabla } from '../../schemas/newton.schema';

interface ExportExcelButtonProps {
  data: Tabla;
  fileName?: string;
}

export const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({ 
  data, 
  fileName = 'iteraciones_newton.xlsx' 
}) => {
  const handleExport = () => {
    // 1. Crear un nuevo libro de trabajo (Workbook)
    const wb = XLSX.utils.book_new();

    // 2. Combinar cabecera y filas en una sola matriz para la hoja
    const sheetData = [data.cabecera, ...data.filas];

    // 3. Crear la hoja de trabajo (Worksheet) a partir de la matriz
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // 4. Ajustar el ancho de las columnas automáticamente (opcional)
    const columnWidths = data.cabecera.map(() => ({ wch: 15 }));
    ws['!cols'] = columnWidths;

    // 5. Añadir la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Iteraciones');

    // 6. Generar el archivo y disparar la descarga
    XLSX.writeFile(wb, fileName);
  };

  return (
    <button 
      onClick={handleExport}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1rem',
        background: '#10b981', // Color verde tipo Excel
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginTop: '1rem'
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = '#059669')}
      onMouseOut={(e) => (e.currentTarget.style.background = '#10b981')}
    >
      <Download size={18} />
      Exportar a Excel
    </button>
  );
};
