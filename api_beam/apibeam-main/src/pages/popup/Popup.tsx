import React from "react";
import { ConnectButton } from "../settings/components/connect";
import { Settings } from "lucide-react";

export default function Popup() {
  const handleEditSetting = () => {
    chrome.tabs.create({ url: "src/pages/settings/index.html" });
  };

  return (
    <div className="academy-popup pb-6">
      <div className="academy-popup__brand">
        <img src="/icon-32.png" alt="GenAI Academy" className="academy-popup__logo" />
        <div>
          <p className="academy-popup__eyebrow">GENAI ACADEMY</p>
          <h1>Connector</h1>
        </div>
      </div>
      <ConnectButton popup />
      <div className="w-full flex justify-center">
        <button
          onClick={handleEditSetting}
          className="academy-popup__settings flex-shrink-0 flex items-center gap-2 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
