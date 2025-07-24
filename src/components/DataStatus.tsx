import React from 'react';
import { Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface DataStatusProps {
  lastUpdated?: Date;
  isLoading?: boolean;
  hasError?: boolean;
  className?: string;
}

const DataStatus: React.FC<DataStatusProps> = ({ 
  lastUpdated, 
  isLoading = false, 
  hasError = false,
  className = '' 
}) => {
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Hace menos de 1 minuto';
    } else if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    } else if (hasError) {
      return <AlertCircle className="w-4 h-4" />;
    } else {
      return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    if (isLoading) {
      return 'Actualizando datos...';
    } else if (hasError) {
      return 'Error al cargar datos';
    } else if (lastUpdated) {
      return `Última actualización: ${formatLastUpdated(lastUpdated)}`;
    } else {
      return 'Datos actualizados';
    }
  };

  const getStatusClass = () => {
    if (isLoading) {
      return 'status-loading';
    } else if (hasError) {
      return 'status-error';
    } else {
      return 'status-updated';
    }
  };

  return (
    <div className={`status-indicator ${getStatusClass()} ${className}`}>
      {getStatusIcon()}
      <span className="text-sm font-medium">
        {getStatusText()}
      </span>
      {lastUpdated && !isLoading && !hasError && (
        <div className="flex items-center gap-1 ml-2">
          <Clock className="w-3 h-3" />
          <span className="text-xs">
            {lastUpdated.toLocaleString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      )}
    </div>
  );
};

export default DataStatus;