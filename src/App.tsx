// src/App.tsx
import React, { useState } from "react";
import { Navigation } from "./components/Navigation";
import { ChatScreen } from "./pages/ChatScreen";
import { KnowledgeScreen } from "./pages/KnowledgeScreen";
import type { TabType } from "./types";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("chat");

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" ? <ChatScreen /> : <KnowledgeScreen />}
      </div>
    </div>
  );
};

export default App;
