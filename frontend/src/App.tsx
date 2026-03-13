import React, { useState } from 'react';
import { RoutesTab, CompareTab, BankingTab, PoolingTab } from './adapters/ui/components';

type TabType = 'routes' | 'compare' | 'banking' | 'pooling';

const TABS: { id: TabType; label: string }[] = [
  { id: 'routes', label: 'Routes' },
  { id: 'compare', label: 'Compare' },
  { id: 'banking', label: 'Banking' },
  { id: 'pooling', label: 'Pooling' },
];

function App(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabType>('routes');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">FuelEU Maritime Compliance Dashboard</h1>
          <p className="text-blue-200 mt-1">
            Compliance monitoring and management system
          </p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow min-h-[600px]">
          {activeTab === 'routes' && <RoutesTab />}
          {activeTab === 'compare' && <CompareTab />}
          {activeTab === 'banking' && <BankingTab />}
          {activeTab === 'pooling' && <PoolingTab />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>FuelEU Maritime Compliance Platform</p>
          <p className="mt-1">
            Based on Fuel EU Maritime Regulation (EU) 2023/1805
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
