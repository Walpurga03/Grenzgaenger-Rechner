import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'
import { Calculator } from './components/Calculator'
import { TaxTips } from './components/TaxTips'

function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'tax-tips'>('calculator');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabChange = (tab: 'calculator' | 'tax-tips') => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <MainContent onMenuClick={() => setIsSidebarOpen(true)}>
        {activeTab === 'calculator' ? <Calculator /> : <TaxTips />}
      </MainContent>
    </div>
  )
}

export default App
