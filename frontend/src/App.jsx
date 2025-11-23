import { useState, useEffect } from 'react';
import CodeGenerator from './components/CodeGenerator';
import HistoryList from './components/HistoryList';
import { FaCode, FaHistory } from 'react-icons/fa';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleGenerationSuccess = () => {
    // Refresh history when new code is generated
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <div 
      className="min-h-screen" 
      style={{ 
        background: 'linear-gradient(135deg, #f5f3ff 0%, #faf5ff 25%, #fdf4ff 50%, #fef5ff 75%, #fef6fb 100%)',
        backgroundImage: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-md border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-lg shadow-lg">
              <FaCode className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 bg-clip-text text-transparent">
              CodeGen.ai
            </span>
          </div>
          <button
            onClick={() => setActiveTab(activeTab === 'generate' ? 'history' : 'generate')}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-purple-700 hover:bg-purple-50 hover:text-purple-800 transition-all duration-200 border border-purple-200 hover:border-purple-300"
          >
            <FaHistory className="text-lg" />
            <span>History</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {activeTab === 'generate' && (
          <div>
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 bg-clip-text text-transparent">
                  AI Code Generator
                </span>
              </h1>
              <h2 className="text-4xl font-bold text-gray-700 mb-4">
                Generate, Test & Export
              </h2>
              <h2 className="text-4xl font-bold text-gray-700 mb-6">
                Code Instantly
              </h2>
            </div>

            <CodeGenerator onSuccess={handleGenerationSuccess} />
          </div>
        )}
        {activeTab === 'history' && (
          <HistoryList refreshTrigger={refreshHistory} />
        )}
      </main>
    </div>
  );
}

export default App;
