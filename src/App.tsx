import React, { useState } from 'react';
import { ActivitySquare, RefreshCw, HelpCircle } from 'lucide-react';
import { generateActivityDiagram } from './utils/diagramGenerator';

function App() {
  const [prompt, setPrompt] = useState<string>(
    'User logs in. If credentials are correct, they access the dashboard. Otherwise, they see an error message and try again. After using the dashboard, they log out.'
  );
  const [diagram, setDiagram] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError('');
      const svg = await generateActivityDiagram(prompt);
      setDiagram(svg);
    } catch (err) {
      setError('Failed to generate diagram. Please check your prompt and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <ActivitySquare className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Activity Diagram Generator</h1>
          </div>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <HelpCircle className="w-5 h-5" />
            Help
          </button>
        </div>

        {showHelp && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">How to Write Prompts</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• Use simple sentences ending with periods</li>
              <li>• Start conditions with "If" (e.g., "If condition is true, do something")</li>
              <li>• Use "Otherwise" for alternative flows</li>
              <li>• Use "while" or "simultaneously" for parallel activities</li>
              <li>• Describe actions clearly (e.g., "User submits form")</li>
            </ul>
            <h3 className="text-lg font-semibold mt-4 mb-2">Example Prompts:</h3>
            <div className="bg-gray-700 p-4 rounded-md">
              <p className="text-sm text-gray-300">
                User starts shopping. If cart is empty, they browse products. Otherwise, they proceed to checkout. While processing payment, system validates card and checks inventory simultaneously. If payment succeeds, order is confirmed. Otherwise, user tries again.
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
          <label className="block text-sm font-medium mb-2">
            Describe your activity flow
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your activity flow description..."
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Generating...
                </>
              ) : (
                'Generate Diagram'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {diagram && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-lg font-medium mb-4">Generated Diagram</h2>
            <div 
              className="w-full overflow-auto bg-gray-900 p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: diagram }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;