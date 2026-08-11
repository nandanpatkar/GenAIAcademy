import React, { useEffect, useState } from 'react';
import { Copy, Check, ExternalLink, Info, ExternalLinkIcon } from 'lucide-react';

export const ApiUrlSection = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const testApiUrl = apiUrl + '/test-me?message=how to use apis';

  useEffect(() => {
    // Request initial URL
    chrome.runtime.sendMessage({ type: 'get_connect_url' });
    // Listen for URL updates — reflects immediately when custom URL is saved
    const listener = (msg: any) => {
      if (msg.type === 'set_connect_url' || msg.type === 'set_api_base_url') {
        setApiUrl(msg.content);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Your Connector URL</h2>
          <p className="text-gray-600 text-sm">Paste this private URL into Atlas → Credentials → GenAI Academy Connector.</p>
        </div>

        {/* API URL with Copy Button */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 font-mono text-gray-900">
            {apiUrl}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-lime-700 hover:bg-lime-800 text-white font-medium px-4 py-3 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check size={18} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

         {/* Header */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm">Test it now</p>
        </div>

        {/* API URL with Copy Button */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 font-mono text-gray-900">
            {testApiUrl}
          </div>
          <button
            onClick={() => {
              window.open(testApiUrl, "_blank");
            }}
            className="flex items-center gap-2 bg-lime-700 hover:bg-lime-800 text-white font-medium px-4 py-3 rounded-lg transition-colors"
          >
           <ExternalLinkIcon />
          </button>
        </div>



        {/* Instructions */}
        <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Info className="text-lime-700 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-gray-900 mb-2">How to Use</h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Copy the private URL above</li>
                <li>Open Atlas → Credentials → GenAI Academy Connector</li>
                <li>Paste the URL into the Connector URL field</li>
                <li>Keep this Chrome extension connected, then chat with Atlas</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-gray-900 mb-2 text-sm">Example Configuration</h3>
          <pre className="bg-white border border-gray-200 rounded p-3 overflow-x-auto">
            <code className="text-sm text-gray-800">
{`from openai import OpenAI

client = OpenAI(
    base_url="${apiUrl}",
    api_key="not-needed"
)`}
            </code>
          </pre>
        </div>

        {/* Documentation Link */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">Need help connecting Atlas?</p>
          <a
            href="https://github.com/openai/openai-python?tab=readme-ov-file#configuring-the-http-client"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lime-700 hover:text-lime-800 font-medium text-sm transition-colors"
          >
            View Documentation
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};
