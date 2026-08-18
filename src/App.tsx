import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ToolsPage from './pages/ToolsPage'
import ToolDetailPage from './pages/ToolDetailPage'
import GraphPage from './pages/GraphPage'
import WorkshopPage from './pages/WorkshopPage'
import LearnPage from './pages/LearnPage'
import RecommendPage from './pages/RecommendPage'
import FishboneTool from './pages/workshop/FishboneTool'
import CheckSheetTool from './pages/workshop/CheckSheetTool'
import ControlChartTool from './pages/workshop/ControlChartTool'
import HistogramTool from './pages/workshop/HistogramTool'
import ParetoTool from './pages/workshop/ParetoTool'
import ScatterTool from './pages/workshop/ScatterTool'
import FlowchartTool from './pages/workshop/FlowchartTool'
import FiveWhysTool from './pages/workshop/FiveWhysTool'
import FmeaTool from './pages/workshop/FmeaTool'
import SipocTool from './pages/workshop/SipocTool'

function App() {
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/:id" element={<ToolDetailPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/workshop" element={<WorkshopPage />} />
          <Route path="/workshop/fishbone" element={<FishboneTool />} />
          <Route path="/workshop/checksheet" element={<CheckSheetTool />} />
          <Route path="/workshop/controlchart" element={<ControlChartTool />} />
          <Route path="/workshop/histogram" element={<HistogramTool />} />
          <Route path="/workshop/pareto" element={<ParetoTool />} />
          <Route path="/workshop/scatter" element={<ScatterTool />} />
          <Route path="/workshop/flowchart" element={<FlowchartTool />} />
          <Route path="/workshop/five-whys" element={<FiveWhysTool />} />
          <Route path="/workshop/fmea" element={<FmeaTool />} />
          <Route path="/workshop/sipoc" element={<SipocTool />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/recommend" element={<RecommendPage />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App
