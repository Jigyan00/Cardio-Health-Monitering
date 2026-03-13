import React, { useState } from 'react';
import { usePooling } from '../hooks/usePooling';
import { PoolMemberInput } from '../../../core/domain/Pool';

const INITIAL_MEMBERS: PoolMemberInput[] = [
  { shipId: 'SHIP1', cb: 0 },
  { shipId: 'SHIP2', cb: 0 },
];

export const PoolingTab: React.FC = () => {
  const [year, setYear] = useState(2024);
  const [members, setMembers] = useState<PoolMemberInput[]>(INITIAL_MEMBERS);
  
  const { poolResult, loading, error, createPool, validatePool } = usePooling();

  const isValid = validatePool(members);
  const totalCB = members.reduce((sum, m) => sum + m.cb, 0);

  const handleMemberChange = (index: number, field: keyof PoolMemberInput, value: string | number) => {
    const newMembers = [...members];
    if (field === 'cb') {
      newMembers[index] = { ...newMembers[index], cb: Number(value) };
    } else {
      newMembers[index] = { ...newMembers[index], [field]: value };
    }
    setMembers(newMembers);
  };

  const handleAddMember = () => {
    setMembers([...members, { shipId: `SHIP${members.length + 1}`, cb: 0 }]);
  };

  const handleRemoveMember = (index: number) => {
    if (members.length > 2) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleCreatePool = async () => {
    if (!isValid) return;
    try {
      await createPool(year, members);
    } catch {
      // Error is handled in the hook
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pooling</h2>
      <p className="text-gray-600 mb-6">
        Implements FuelEU Article 21 – Pooling of compliance balances.
      </p>

      {/* Pool Sum Indicator */}
      <div className={`mb-6 p-4 rounded ${isValid ? 'bg-green-100' : 'bg-red-100'}`}>
        <h3 className="text-lg font-semibold mb-2">Pool Status</h3>
        <div className="flex items-center gap-4">
          <span className="text-2xl">{isValid ? '✅' : '❌'}</span>
          <div>
            <p className={`text-xl font-bold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              Total CB: {totalCB.toLocaleString()} gCO₂eq
            </p>
            <p className="text-sm text-gray-600">
              {isValid 
                ? 'Pool is valid (Sum ≥ 0)' 
                : 'Pool is invalid (Sum must be ≥ 0)'}
            </p>
          </div>
        </div>
      </div>

      {/* Year Selection */}
      <div className="mb-6">
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

      {/* Members Input */}
      <div className="mb-6 bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">Pool Members</h3>
        
        <div className="space-y-2">
          {members.map((member, index) => (
            <div key={index} className="flex gap-4 items-center">
              <div>
                <label className="block text-xs text-gray-500">Ship ID</label>
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-32"
                  value={member.shipId}
                  onChange={(e) => handleMemberChange(index, 'shipId', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">CB (gCO₂eq)</label>
                <input
                  type="number"
                  className={`border rounded px-3 py-2 w-40 ${member.cb < 0 ? 'border-red-300' : member.cb > 0 ? 'border-green-300' : ''}`}
                  value={member.cb}
                  onChange={(e) => handleMemberChange(index, 'cb', e.target.value)}
                />
              </div>
              <div className="pt-4">
                <span className={`text-sm ${member.cb < 0 ? 'text-red-600' : member.cb > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                  {member.cb < 0 ? 'Deficit' : member.cb > 0 ? 'Surplus' : 'Neutral'}
                </span>
              </div>
              {members.length > 2 && (
                <button
                  onClick={() => handleRemoveMember(index)}
                  className="pt-4 text-red-600 hover:text-red-800"
                  aria-label="Remove member"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleAddMember}
          className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
        >
          + Add Member
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Create Pool Button */}
      <button
        onClick={handleCreatePool}
        disabled={!isValid || loading}
        className={`px-6 py-3 rounded text-lg ${
          isValid && !loading
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {loading ? 'Creating Pool...' : 'Create Pool'}
      </button>

      {/* Pool Result */}
      {poolResult && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Pool Created Successfully</h3>
          <p className="text-sm text-gray-600 mb-2">Pool ID: {poolResult.pool.id}</p>
          
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Ship ID</th>
                <th className="px-4 py-2 text-right">CB Before</th>
                <th className="px-4 py-2 text-right">CB After</th>
                <th className="px-4 py-2 text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {poolResult.members.map((member) => (
                <tr key={member.shipId} className="border-t">
                  <td className="px-4 py-2">{member.shipId}</td>
                  <td className={`px-4 py-2 text-right ${member.cbBefore < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {member.cbBefore.toLocaleString()}
                  </td>
                  <td className={`px-4 py-2 text-right ${member.cbAfter < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {member.cbAfter.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {(member.cbAfter - member.cbBefore).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-4 py-2 font-bold">Total</td>
                <td className="px-4 py-2 text-right font-bold">
                  {poolResult.totalCbBefore.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right font-bold">
                  {poolResult.totalCbAfter.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right font-bold">-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
