// src/components/Navigation.tsx
import React from "react";
import { MessageCircle, Database } from "lucide-react";
import type { TabType } from "../types";

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: "chat" as TabType,
      label: "Chat",
      icon: MessageCircle,
      color: "blue",
    },
    {
      id: "knowledge" as TabType,
      label: "Knowledge",
      icon: Database,
      color: "green",
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                isActive
                  ? `border-${tab.color}-500 text-${tab.color}-600 bg-${tab.color}-50/50`
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`h-5 w-5 mr-2 ${
                  isActive ? `text-${tab.color}-600` : "text-gray-400"
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
