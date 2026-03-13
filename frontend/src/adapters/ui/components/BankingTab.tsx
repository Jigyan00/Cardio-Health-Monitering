import React, { useState, useEffect } from 'react';
import { useCompliance } from '../hooks/useCompliance';
import { useBanking } from '../hooks/useBanking';

export const BankingTab: React.FC = () => {
  const [shipId, setShipId] = useState('R001');
  const [year, setYear] = useState(2024);
  const [amount, setAmount] = useState<number>(0);
  
  const { cb, loading: cbLoading, error: cbError, calculateCB, getAdjustedCB, adjustedCB } = useCompliance();
  const { result, loading: bankingLoading, error: bankingError, bankSurplus, applyBanked } = useBanking();

  useEffect(() => {
    calculateCB(shipId, year);
    getAdjustedCB(shipId, year);
  }, [shipId, year, calculateCB, getAdjustedCB]);

  const handleBank = async () => {
    if (amount <= 0) return;
    try {
      await bankSurplus(shipId, year, amount);
      await calculateCB(shipId, year);
      await getAdjustedCB(shipId, year);
    } catch {
      // Error is handled in the hook
    }
  };

  const handleApply = async () => {
    if (amount <= 0) return;
    try {
      await applyBanked(shipId, year, amount);
      await calculateCB(shipId, year);
      await getAdjustedCB(shipId, year);
    } catch {
      // Error is handled in the hook
    }
  };

  const loading = cbLoading || bankingLoading;
  const error = cbError || bankingError;
  const isSurplus = cb && cb.complianceBalance > 0;
  const canBank = isSurplus && amount > 0 && amount <= (cb?.complianceBalance || 0);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Banking</h2>
      <p className="text-gray-600 mb-6">
        Implements FuelEU Article 20 – Banking of compliance surplus.
      </p>

      {/* Ship Selection */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ship ID</label>
          <select
            className="border rounded px-3 py-2"
            value={shipId}
            onChange={(e) => setShipId(e.target.value)}
          >
            <option value="R001">R001</option>
            <option value="R002">R002</option>
            <option value="R003">R003</option>
            <option value="R004">R004</option>
            <option value="R005">R005</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            className="border rounded px-3 py-2"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-medium text-gray-500">Current CB</h3>
          <p className={`text-2xl font-bold ${cb && cb.complianceBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {loading ? '...' : cb ? cb.complianceBalance.toLocaleString() : 'N/A'} gCO₂eq
          </p>
          <p className="text-xs text-gray-500">
            {cb && cb.complianceBalance >= 0 ? 'Surplus' : 'Deficit'}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-medium text-gray-500">Adjusted CB</h3>
          <p className={`text-2xl font-bold ${adjustedCB !== null && adjustedCB >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {loading ? '...' : adjustedCB !== null ? adjustedCB.toLocaleString() : 'N/A'} gCO₂eq
          </p>
          <p className="text-xs text-gray-500">After bank applications</p>
        </div>
        {result && (
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-sm font-medium text-gray-500">Last Transaction</h3>
            <div className="text-sm">
              <p>Before: {result.cbBefore.toLocaleString()}</p>
              <p>Applied: {result.applied.toLocaleString()}</p>
              <p className="font-bold">After: {result.cbAfter.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">Banking Actions</h3>
        
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (gCO₂eq)</label>
            <input
              type="number"
              className="border rounded px-3 py-2 w-48"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>
          
          <button
            onClick={handleBank}
            disabled={!canBank || loading}
            className={`px-4 py-2 rounded ${
              canBank && !loading
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Processing...' : 'Bank Surplus'}
          </button>
          
          <button
            onClick={handleApply}
            disabled={amount <= 0 || loading}
            className={`px-4 py-2 rounded ${
              amount > 0 && !loading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Processing...' : 'Apply Banked'}
          </button>
        </div>
        
        {!isSurplus && cb && (
          <p className="mt-2 text-sm text-orange-600">
            ⚠️ Cannot bank: Compliance Balance is not positive (deficit).
          </p>
        )}
      </div>
    </div>
  );
};
