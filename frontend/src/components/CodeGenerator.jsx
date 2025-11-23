import { useState, useEffect } from 'react';
import { generateCode, getLanguages } from '../services/api';
import CodeDisplay from './CodeDisplay';
import { FaSpinner, FaRocket } from 'react-icons/fa';

const CodeGenerator = ({ onSuccess }) => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('');
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(null);

  // Fetch available languages on mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await getLanguages();
        setLanguages(response.data || []);
        if (response.data && response.data.length > 0) {
          setLanguage(response.data[0].name);
        }
      } catch (err) {
        console.error('Failed to fetch languages:', err);
        // Fallback languages if API fails
        setLanguages([
          { id: 1, name: 'Python', extension: '.py' },
          { id: 2, name: 'JavaScript', extension: '.js' },
          { id: 3, name: 'TypeScript', extension: '.ts' },
          { id: 4, name: 'C++', extension: '.cpp' }
        ]);
        setLanguage('Python');
      }
    };

    fetchLanguages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    if (!language) {
      setError('Please select a language');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedCode(null);

    try {
      const response = await generateCode(prompt, language);
      setGeneratedCode(response.data);
      
      // Call success callback to refresh history
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Handle both error formats (string or array)
      if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors.join(', '));
      } else {
        setError(err.error || 'Failed to generate code. Please try again.');
      }
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setGeneratedCode(null);
    setError(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 gap-8">
        {/* Input Form */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent mb-6">Enter Your Prompt</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Language Selection Dropdown - Styled like screenshot */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 rounded-lg border border-purple-200">
                <FaRocket className="text-purple-600" />
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-700 font-medium cursor-pointer"
                  disabled={loading}
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.name}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prompt Input */}
            <div>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe the code you want to generate...\n\nExamples:\n• Write a Python function to reverse a string\n• Create a JavaScript function for fibonacci sequence\n• Implement quicksort in C++`}
                className="w-full h-40 px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400 bg-purple-50/30"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-xl animate-fade-in shadow-sm">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 hover:from-purple-700 hover:via-purple-600 hover:to-purple-700 shadow-lg hover:shadow-2xl active:scale-98'
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FaRocket />
                  <span>✨ Generate Code Now</span>
                </>
              )}
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
              Press Cmd/Ctrl + Enter to generate
            </p>
          </form>
        </div>

        {/* Generated Code Display */}
        {generatedCode && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-8 animate-fade-in">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent mb-6">Generated Code</h3>
            <CodeDisplay
              code={generatedCode.code}
              language={generatedCode.language}
              prompt={generatedCode.prompt}
              timestamp={generatedCode.createdAt}
            />
          </div>
        )}

        {/* Empty State */}
        {!generatedCode && !loading && (
          <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaRocket className="text-4xl text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No code generated yet</h3>
              <p className="text-gray-600">
                Enter a prompt and click Generate to see code here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeGenerator;
