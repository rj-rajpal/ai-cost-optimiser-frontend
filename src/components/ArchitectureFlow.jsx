import ReactFlow, { Background, Controls } from 'reactflow'
import 'reactflow/dist/style.css'
import { useDarkMode } from '../contexts/DarkModeContext'
import { StepNode } from './StepNode'

// Define nodeTypes outside component to prevent re-creation on each render
const nodeTypes = { stepNode: StepNode }

export default function ArchitectureFlow({ nodes, edges }) {
  const { isDarkMode } = useDarkMode()
  
  return (
    <div className={`h-64 rounded-xl border overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'border-gray-800 bg-gray-950' 
        : 'border-sky-gray bg-cloud-white'
    }`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: '#667EEA' },
          animated: true
        }}
      >
        <Background 
          gap={12} 
          size={1} 
          color={isDarkMode ? '#374151' : '#CBD2D9'} 
        />
        <Controls 
          position="bottom-right" 
          showInteractive={false}
          className={`border rounded-lg shadow-lg transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-black border-gray-800' 
              : 'bg-white border-sky-gray shadow-mist'
          }`}
        />
      </ReactFlow>
    </div>
  )
} 