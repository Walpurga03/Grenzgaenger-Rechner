import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'
import { Calculator } from './components/Calculator'

function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MainContent>
        <Calculator />
      </MainContent>
    </div>
  )
}

export default App
