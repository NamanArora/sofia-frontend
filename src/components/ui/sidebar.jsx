import React from 'react';
import { FileText, Star, Briefcase } from 'lucide-react';

// Navigation configuration
export const navigation = [
  { name: 'CV Point Converter', icon: FileText },
  { name: 'STAR Framework', icon: Star },
  { name: 'JD Compatibility', icon: Briefcase },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-white border-r flex flex-col h-screen">
      {/* Logo and Title */}
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Sofia
        </h1>
        <p className="text-sm text-gray-500 mt-1">Your Career Companion</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4">
        <div className="space-y-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  activeTab === item.name
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50/50 hover:text-purple-600'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${
                  activeTab === item.name
                    ? 'text-purple-700'
                    : 'text-gray-500'
                }`} />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <p className="text-center">
          <span className="font-medium bg-gradient-to-r from-red-600 via-green-700 to-blue-600 bg-clip-text text-transparent">Team DISHA & CloseAI
          </span>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;