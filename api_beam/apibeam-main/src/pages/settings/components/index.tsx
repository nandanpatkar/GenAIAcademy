import { useEffect, useState } from "react";
import { Server, Code, Settings, Info, ArrowRightLeft, Chrome } from "lucide-react";
import { ApiUrlSection } from "./apiUrl";
import { ConnectButton } from "./connect";
import { CustomSettingsModal } from "./CustomSettingsModal";
import { DEFAULT_API_BASE_URL } from "@src/pages/background";

const languages = [
  { id: "nodejs", name: "Node.js", emoji: "🟢" },
  { id: "python", name: "Python", emoji: "🐍" },
  { id: "go", name: "Go", emoji: "🔷" },
  { id: "ruby", name: "Ruby", emoji: "💎" },
  { id: "php", name: "PHP", emoji: "🐘" },
];

export const SettingPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [method, setMethod] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "get_settings" });
    chrome.runtime.sendMessage({ type: "get_api_base_url" });
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === "set_settings" && msg.content) {
        setSelectedLanguage(msg.content.language);
        setMethod(msg.content.method);
      } else if (msg.type === "set_api_base_url" && msg.content) {
        setApiBaseUrl(msg.content);
      }
    });
  }, []);

  const saveSettings = () => {
    chrome.runtime.sendMessage({
      type: "set_settings",
      content: { language: selectedLanguage, method: method },
    });
  };

  const saveApiBaseUrl = (url?: string) => {
    chrome.runtime.sendMessage({
      type: "set_api_base_url",
      content: url ?? apiBaseUrl,
    });
  };

  const resetApiBaseUrl = () => {
    chrome.runtime.sendMessage({
      type: "set_api_base_url",
      content: DEFAULT_API_BASE_URL,
    });
    setApiBaseUrl("");
  };

  const selectedLang = languages.find((lang) => lang.id === selectedLanguage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="../../../icon-32.png"
              alt="GenAI Academy Connector logo"
              className="w-16 h-16"
            />
            <h1 className="text-4xl font-bold text-gray-900">GenAI Academy Connector</h1>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Connect Atlas to your signed-in AI workspace
            </p>
            <div className="flex items-center gap-3">
              {/* Connector relay settings trigger */}
              <button
                onClick={() => setShowSettingsModal(true)}
                title="Connector Settings"
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
              >
                <Settings size={22} />
              </button>
            </div>
          </div>

          {showSettingsModal && (
            <CustomSettingsModal
              apiBaseUrl={apiBaseUrl}
              onSave={(url) => {
                setApiBaseUrl(url);
                saveApiBaseUrl(url);
              }}
              onReset={() => {
                resetApiBaseUrl();
                setApiBaseUrl(DEFAULT_API_BASE_URL);
              }}
              onClose={() => setShowSettingsModal(false)}
            />
          )}
        </div>

        <div className="mb-6">
          <ConnectButton />
        </div>
        {/* How It Works Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <Info className="text-lime-700 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                How GenAI Academy Connector Works
              </h2>
              <p className="text-gray-600 leading-relaxed">
                GenAI Academy Connector privately links Atlas to your
                signed-in AI account through your configured relay. Here's the flow:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <Code className="text-gray-700 mx-auto mb-2" size={28} />
              <p className="text-sm font-medium text-gray-900">
                Atlas
              </p>
              <p className="text-xs text-gray-500 mt-1">Your learning copilot</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRightLeft className="text-gray-400" size={20} />
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <Server className="text-gray-700 mx-auto mb-2" size={28} />
              <p className="text-sm font-medium text-gray-900">
                Academy Relay
              </p>
              <p className="text-xs text-gray-500 mt-1">Middleware</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRightLeft className="text-gray-400" size={20} />
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <Chrome className="text-lime-700 mx-auto mb-2" size={28} />
              <p className="text-sm font-medium text-gray-900">
                Chrome Extension
              </p>
              <p className="text-xs text-gray-500 mt-1">On your computer</p>
            </div>
          </div>

          <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-900">Step 1:</span> Pass
              Atlas sends your request to the relay →
              <span className="font-semibold text-gray-900 ml-2">Step 2:</span>{" "}
              Request reaches our server →
              <span className="font-semibold text-gray-900 ml-2">Step 3:</span>{" "}
              Server sends command to Chrome extension →
              <span className="font-semibold text-gray-900 ml-2">Step 4:</span>{" "}
              Extension forwards to your ChatGPT account →
              <span className="font-semibold text-gray-900 ml-2">Step 5:</span>{" "}
              Response travels back through the same chain
            </p>
          </div>
        </div>
        <ApiUrlSection />
        {/* Settings Panel */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <Settings className="text-gray-700" size={24} />
              <h2 className="text-2xl font-semibold text-gray-900">
                Configuration
              </h2>
            </div>
            <div className="pt-2">
              For more accurate responses use the following configuration
            </div>
          </div>
          {/* Language Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Select Your Programming Language
            </label>
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 appearance-none cursor-pointer hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Language</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <span className="text-2xl">{selectedLang?.emoji}</span>
              </div>
            </div>

            {/* Language Icons Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
              {languages.map((lang) => {
                return (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`bg-white border-2 rounded-lg p-4 transition-all ${
                      selectedLanguage === lang.id
                        ? "border-blue-500 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-3xl block mx-auto">{lang.emoji}</span>
                    <p className="text-xs text-gray-700 mt-2 text-center font-medium">
                      {lang.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Method Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
              <Code size={18} className="text-gray-600" />
              Library Method/Function Name
            </label>
            <input
              type="text"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              placeholder="e.g., client.responses.create"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={saveSettings}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Save Configuration
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6 text-gray-500 text-sm space-y-1">
          <p>
            🔒 Your ChatGPT messages stay secure on your computer. No data is
            sent to any third-party.
          </p>
        </div>
      </div>
    </div>
  );
};
