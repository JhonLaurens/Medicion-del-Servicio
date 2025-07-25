import React, { useState } from 'react';
import { FileText, Table, Image, Loader2 } from 'lucide-react';

interface ExportData {
  title: string;
  data: any[];
  charts?: HTMLElement[];
}

interface ExportOptionsProps {
  data: ExportData;
  className?: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ data, className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<string | null>(null);

  const exportToPDF = async () => {
    setIsExporting(true);
    setExportType('PDF');
    
    try {
      // Simular exportación a PDF
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de exportación a PDF
      // Por ejemplo, usando jsPDF o html2pdf
      console.log('Exportando a PDF:', data);
      
      // Crear un enlace de descarga simulado
      const blob = new Blob(['Datos del Dashboard de Satisfacción'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-satisfaccion-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error al exportar PDF:', error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    setExportType('Excel');
    
    try {
      // Simular exportación a Excel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Convertir datos a formato CSV como alternativa simple
      const csvContent = convertToCSV(data.data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-satisfaccion-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error al exportar Excel:', error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const exportToImage = async () => {
    setIsExporting(true);
    setExportType('Imagen');
    
    try {
      // Simular exportación a imagen
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aquí iría la lógica para capturar el dashboard como imagen
      // Por ejemplo, usando html2canvas
      console.log('Exportando a imagen:', data);
      
    } catch (error) {
      console.error('Error al exportar imagen:', error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const convertToCSV = (data: any[]): string => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escapar comillas y envolver en comillas si contiene comas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700 mr-2">Exportar:</span>
      
      <button
        onClick={exportToPDF}
        disabled={isExporting}
        className="export-button"
        title="Exportar a PDF"
      >
        {isExporting && exportType === 'PDF' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        PDF
      </button>
      
      <button
        onClick={exportToExcel}
        disabled={isExporting}
        className="export-button"
        title="Exportar a Excel/CSV"
      >
        {isExporting && exportType === 'Excel' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Table className="w-4 h-4" />
        )}
        Excel
      </button>
      
      <button
        onClick={exportToImage}
        disabled={isExporting}
        className="export-button"
        title="Exportar como imagen"
      >
        {isExporting && exportType === 'Imagen' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Image className="w-4 h-4" />
        )}
        Imagen
      </button>
      
      {isExporting && (
        <span className="text-sm text-blue-600 ml-2">
          Exportando {exportType}...
        </span>
      )}
    </div>
  );
};

export default ExportOptions;