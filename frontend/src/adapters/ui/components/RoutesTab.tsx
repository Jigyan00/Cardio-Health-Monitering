import React, { useState } from 'react';
import { Route, RouteFilters } from '../../../core/domain/Route';
import { useRoutes } from '../hooks/useRoutes';

const VESSEL_TYPES = ['Container', 'BulkCarrier', 'Tanker', 'RoRo'];
const FUEL_TYPES = ['HFO', 'LNG', 'MGO'];
const YEARS = [2024, 2025];

export const RoutesTab: React.FC = () => {
  const { routes, loading, error, fetchRoutes, setBaseline } = useRoutes();
  const [filters, setFilters] = useState<RouteFilters>({});
  const [settingBaseline, setSettingBaseline] = useState<string | null>(null);

  const handleFilterChange = (key: keyof RouteFilters, value: string) => {
    const newFilters = { ...filters };
    if (value === '') {
      delete newFilters[key];
    } else if (key === 'year') {
      newFilters[key] = parseInt(value, 10);
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    fetchRoutes(Object.keys(newFilters).length > 0 ? newFilters : undefined);
  };

  const handleSetBaseline = async (routeId: string) => {
    setSettingBaseline(routeId);
    try {
      await setBaseline(routeId);
    } finally {
      setSettingBaseline(null);
    }
  };

  if (loading && routes.length === 0) {
    return <div className="p-4 text-center">Loading routes...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Routes</h2>
      
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={filters.vesselType || ''}
          onChange={(e) => handleFilterChange('vesselType', e.target.value)}
          aria-label="Filter by vessel type"
        >
          <option value="">All Vessel Types</option>
          {VESSEL_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={filters.fuelType || ''}
          onChange={(e) => handleFilterChange('fuelType', e.target.value)}
          aria-label="Filter by fuel type"
        >
          <option value="">All Fuel Types</option>
          {FUEL_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={filters.year?.toString() || ''}
          onChange={(e) => handleFilterChange('year', e.target.value)}
          aria-label="Filter by year"
        >
          <option value="">All Years</option>
          {YEARS.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Route ID</th>
              <th className="px-4 py-2 text-left">Vessel Type</th>
              <th className="px-4 py-2 text-left">Fuel Type</th>
              <th className="px-4 py-2 text-left">Year</th>
              <th className="px-4 py-2 text-right">GHG Intensity (gCO₂e/MJ)</th>
              <th className="px-4 py-2 text-right">Fuel Consumption (t)</th>
              <th className="px-4 py-2 text-right">Distance (km)</th>
              <th className="px-4 py-2 text-right">Total Emissions (t)</th>
              <th className="px-4 py-2 text-center">Baseline</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route: Route) => (
              <tr key={route.id} className={`border-t ${route.isBaseline ? 'bg-blue-50' : ''}`}>
                <td className="px-4 py-2">{route.routeId}</td>
                <td className="px-4 py-2">{route.vesselType}</td>
                <td className="px-4 py-2">{route.fuelType}</td>
                <td className="px-4 py-2">{route.year}</td>
                <td className="px-4 py-2 text-right">{route.ghgIntensity.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{route.fuelConsumption.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{route.distance.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{route.totalEmissions.toLocaleString()}</td>
                <td className="px-4 py-2 text-center">
                  {route.isBaseline ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Baseline
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleSetBaseline(route.routeId)}
                    disabled={route.isBaseline || settingBaseline !== null}
                    className={`px-3 py-1 rounded text-sm ${
                      route.isBaseline
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {settingBaseline === route.routeId ? 'Setting...' : 'Set Baseline'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
