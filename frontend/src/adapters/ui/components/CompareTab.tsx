import React from 'react';
import { useComparison } from '../hooks/useRoutes';
import { RouteComparison, TARGET_INTENSITY_2025 } from '../../../core/domain/Route';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export const CompareTab: React.FC = () => {
  const { comparisons, loading, error, fetchComparison } = useComparison();

  if (loading) {
    return <div className="p-4 text-center">Loading comparison data...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 mb-2">Error: {error}</p>
        <button 
          onClick={() => fetchComparison()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (comparisons.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        No comparison data available. Please set a baseline route first.
      </div>
    );
  }

  const chartData = comparisons.map((c: RouteComparison) => ({
    name: c.comparison.routeId,
    baseline: c.baseline.ghgIntensity,
    comparison: c.comparison.ghgIntensity,
    target: TARGET_INTENSITY_2025,
  }));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Compare Routes</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">
          Target GHG Intensity (2025): <strong>{TARGET_INTENSITY_2025} gCO₂e/MJ</strong> (2% below 91.16)
        </p>
      </div>

      {/* Chart */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">GHG Intensity Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[80, 100]} label={{ value: 'gCO₂e/MJ', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="baseline" fill="#3b82f6" name="Baseline" />
            <Bar dataKey="comparison" fill="#10b981" name="Comparison" />
            <ReferenceLine y={TARGET_INTENSITY_2025} stroke="red" strokeDasharray="5 5" label="Target" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Route ID</th>
              <th className="px-4 py-2 text-right">Baseline GHG Intensity</th>
              <th className="px-4 py-2 text-right">Comparison GHG Intensity</th>
              <th className="px-4 py-2 text-right">% Difference</th>
              <th className="px-4 py-2 text-center">Compliant</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((c: RouteComparison) => (
              <tr key={c.comparison.id} className="border-t">
                <td className="px-4 py-2">{c.comparison.routeId}</td>
                <td className="px-4 py-2 text-right">{c.baseline.ghgIntensity.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{c.comparison.ghgIntensity.toFixed(2)}</td>
                <td className={`px-4 py-2 text-right ${c.percentDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {c.percentDiff > 0 ? '+' : ''}{c.percentDiff.toFixed(2)}%
                </td>
                <td className="px-4 py-2 text-center">
                  {c.compliant ? (
                    <span className="text-green-600 text-xl">✅</span>
                  ) : (
                    <span className="text-red-600 text-xl">❌</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
