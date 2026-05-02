import { MapView } from './components/MapView'
import { mockPoints } from './data/mockDataset'
import './App.css'

function App() {
  return (
    <MapView points={mockPoints} />
  )
}

export default App

