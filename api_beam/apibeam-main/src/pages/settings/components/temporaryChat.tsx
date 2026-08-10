import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

export const TemporaryChatToggle = () => {
  const [useTemporaryChat, setUseTemporaryChat] = useState(false);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "get_settings" });

    const listener = (msg: any) => {
      if (msg.type === "set_settings" && msg.content) {
        setUseTemporaryChat(msg.content.useTemporaryChat || false);
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  const handleToggle = () => {
    const newValue = !useTemporaryChat;
    setUseTemporaryChat(newValue);
    chrome.runtime.sendMessage({
      type: "set_settings",
      content: { useTemporaryChat: newValue },
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
            <Lock className="text-purple-600" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Temporary Chat Mode</h3>
            <p className="text-sm text-gray-600">
              Open ChatGPT/Claude in temporary/incognito mode for private conversations
            </p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          className={`relative w-14 h-8 rounded-full transition-colors ${
            useTemporaryChat ? "bg-purple-600" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
              useTemporaryChat ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
};
