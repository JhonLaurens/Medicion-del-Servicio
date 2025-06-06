import React, { useEffect, useState, useMemo } from 'react';
import { satisfactionDataService } from '../services/dataService';
import { SatisfactionRecord } from '../types';

const DataExplorer: React.FC = () => {
  const [data, setData] = useState<SatisfactionRecord[]>([]);
  const [filteredData, setFilteredData] = useState<SatisfactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortField, setSortField] = useState<keyof SatisfactionRecord>('ID');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('Todos');
  const [selectedAgency, setSelectedAgency] = useState<string>('Todas');

  useEffect(() => {
    const loadData = async () => {
      try {
        await satisfactionDataService.loadData();
        const records = satisfactionDataService.getData();
        setData(records);
        setFilteredData(records);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Extract unique values for filters
  const segments = useMemo(() => {
    const unique = [...new Set(data.map(record => record.SEGMENTO).filter(Boolean))];
    return ['Todos', ...unique];
  }, [data]);

  const agencies = useMemo(() => {
    const unique = [...new Set(data.map(record => record.AGENCIA).filter(Boolean))];
    return ['Todas', ...unique];
  }, [data]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        Object.values(record).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply segment filter
    if (selectedSegment !== 'Todos') {
      filtered = filtered.filter(record => record.SEGMENTO === selectedSegment);
    }

    // Apply agency filter
    if (selectedAgency !== 'Todas') {
      filtered = filtered.filter(record => record.AGENCIA === selectedAgency);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = aValue.toString();
      const bStr = bValue.toString();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [data, searchTerm, selectedSegment, selectedAgency, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleSort = (field: keyof SatisfactionRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof SatisfactionRecord) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↗️' : '↘️';
  };

  const getRatingColor = (rating: number | null) => {
    if (rating === null || rating === undefined) return 'text-gray-400';
    if (rating === 5) return 'text-blue-600 font-bold';
    if (rating === 4) return 'text-yellow-600 font-bold';
    return 'text-gray-600';
  };

  const formatCellValue = (value: any, field: keyof SatisfactionRecord) => {
    if (value === null || value === undefined) return '-';
    
    // Special formatting for rating fields
    if (['claridad_informacion', 'recomendacion', 'satisfaccion_general', 'lealtad'].includes(field)) {
      return (
        <span className={getRatingColor(value as number)}>
          {value}
        </span>
      );
    }
    
    // Truncate long text fields
    if (typeof value === 'string' && value.length > 30) {
      return (
        <span title={value}>
          {value.substring(0, 30)}...
        </span>
      );
    }
    
    return value.toString();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del explorador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Explorador de Datos</h1>
        <p className="text-gray-600">Explore los datos completos de la encuesta con filtros y búsqueda avanzada</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Registros</h3>
          <p className="text-3xl font-bold text-blue-600">{data.length.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Registros Filtrados</h3>
          <p className="text-3xl font-bold text-green-600">{filteredData.length.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Segmentos</h3>
          <p className="text-3xl font-bold text-purple-600">{segments.length - 1}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Agencias</h3>
          <p className="text-3xl font-bold text-amber-600">{agencies.length - 1}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtros y Búsqueda</h2>
        
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Búsqueda</label>
            <input
              type="text"
              placeholder="Buscar en todos los campos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Segment Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Segmento</label>            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              aria-label="Filtrar por segmento"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {segments.map(segment => (
                <option key={segment} value={segment}>{segment}</option>
              ))}
            </select>
          </div>

          {/* Agency Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agencia</label>            <select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              aria-label="Filtrar por agencia"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {agencies.map(agency => (
                <option key={agency} value={agency}>{agency}</option>
              ))}
            </select>
          </div>

          {/* Items per page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Elementos por página</label>            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              aria-label="Elementos por página"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSegment('Todos');
              setSelectedAgency('Todas');
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Limpiar Filtros
          </button>
          
          <div className="text-sm text-gray-600 flex items-center">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredData.length)} de {filteredData.length} registros
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{[ 
                <th key="id" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('ID')}>
                  <div className="flex items-center space-x-1"><span>ID</span><span>{getSortIcon('ID')}</span></div>
                </th>,
                <th key="segmento" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('SEGMENTO')}>
                  <div className="flex items-center space-x-1"><span>Segmento</span><span>{getSortIcon('SEGMENTO')}</span></div>
                </th>,
                <th key="agencia" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('AGENCIA')}>
                  <div className="flex items-center space-x-1"><span>Agencia</span><span>{getSortIcon('AGENCIA')}</span></div>
                </th>,
                <th key="claridad" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('claridad_informacion')}>
                  <div className="flex items-center space-x-1"><span>Claridad Info.</span><span>{getSortIcon('claridad_informacion')}</span></div>
                </th>,
                <th key="satisfaccion" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('satisfaccion_general')}>
                  <div className="flex items-center space-x-1"><span>Satisfacción</span><span>{getSortIcon('satisfaccion_general')}</span></div>
                </th>,
                <th key="recomendacion" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('recomendacion')}>
                  <div className="flex items-center space-x-1"><span>Recomendación</span><span>{getSortIcon('recomendacion')}</span></div>
                </th>,
                <th key="lealtad" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('lealtad')}>
                  <div className="flex items-center space-x-1"><span>Lealtad</span><span>{getSortIcon('lealtad')}</span></div>
                </th>,
                <th key="fecha" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('DATE_MODIFIED')}>
                  <div className="flex items-center space-x-1"><span>Fecha</span><span>{getSortIcon('DATE_MODIFIED')}</span></div>
                </th>
              ]}</tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((record, index) => (
                <tr key={record.ID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatCellValue(record.ID, 'ID')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.SEGMENTO === 'PERSONAS' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {formatCellValue(record.SEGMENTO, 'SEGMENTO')}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatCellValue(record.AGENCIA, 'AGENCIA')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    {formatCellValue(record.claridad_informacion, 'claridad_informacion')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    {formatCellValue(record.satisfaccion_general, 'satisfaccion_general')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    {formatCellValue(record.recomendacion, 'recomendacion')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    {formatCellValue(record.lealtad, 'lealtad')}
                  </td>                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {record.DATE_MODIFIED ? new Date(record.DATE_MODIFIED).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <div className="hidden md:flex">
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Rating Legend */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Interpretación de Calificaciones</h3>
        <div className="grid md:grid-cols-5 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <div>
              <p className="font-medium text-gray-800">Calificación 5</p>
              <p className="text-sm text-gray-600">Muy satisfecho/Muy probable</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <div>
              <p className="font-medium text-gray-800">Calificación 4</p>
              <p className="text-sm text-gray-600">Satisfecho/Probable</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <div>
              <p className="font-medium text-gray-800">Calificación 1-3</p>
              <p className="text-sm text-gray-600">Neutral/Insatisfecho</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExplorer;
