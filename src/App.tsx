import { MapView } from './components/MapView'
import { mockPoints } from './data/mockDataset'
import './App.css'

function App() {
  return (
    <div className='h-[100dvh]'>
      <MapView points={mockPoints} />
    </div>
  )
}

export default App

