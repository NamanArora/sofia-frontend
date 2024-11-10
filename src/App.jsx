import React, { useState } from 'react';
import Sidebar, { navigation } from './components/ui/sidebar';
import { CVPointConverter } from './components/tabs/convert';
import { STARFramework } from './components/tabs/star';
import { JobHunter } from './components/tabs/JobHunter';
import { FeedbackButton } from './components/tabs/feedback';

// Map of component configurations
const componentMap = {
  'CV Point Converter': CVPointConverter,
  'STAR Framework': STARFramework,
  'JD Compatibility': JobHunter,
};

export default function App() {
  const [activeTab, setActiveTab] = useState(navigation[0].name);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main content */}
        <div className="flex-1 overflow-auto py-8 px-4">
          <div className="container mx-auto max-w-3xl">
            {navigation.map((item) => {
              const Component = componentMap[item.name];
              return activeTab === item.name && (
                <Component
                  key={item.name}
                  className="animate-in fade-in-50 duration-500"
                />
              );
            })}
          </div>
          <FeedbackButton />
        </div>
      </div>
    </div>
  );
}