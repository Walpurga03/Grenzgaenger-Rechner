import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'
import { Calculator } from './components/Calculator'
import { TaxTips } from './components/TaxTips'

function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'tax-tips'>('calculator');

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <MainContent>
        {activeTab === 'calculator' ? <Calculator /> : <TaxTips />}
      </MainContent>
    </div>
  )
}

export default App
