import { Handle, Position } from 'reactflow'
import clsx from 'clsx'
import { useDarkMode } from '../contexts/DarkModeContext'

export const StepNode = ({ data }) => {
  const { isDarkMode } = useDarkMode()
  const Icon = data.icon
  
  return (
    <div
      className={clsx(
        'rounded-xl border px-4 py-5 text-center shadow-lg',
        'flex flex-col items-center gap-3 w-48',
        'hover:shadow-xl transition-all duration-200',
        isDarkMode 
          ? 'border-gray-800 bg-black hover:border-gray-600' 
          : 'border-sky-gray bg-white shadow-mist hover:border-muted-indigo/30'
      )}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
        isDarkMode ? 'bg-muted-indigo/20' : 'bg-muted-indigo/10'
      }`}>
        <Icon className="h-6 w-6 text-muted-indigo" />
      </div>
      <span className={`text-sm font-medium ${
        isDarkMode ? 'text-white' : 'text-soft-navy'
      }`}>{data.label}</span>
      <Handle 
        type="source" 
        position={Position.Right} 
        className={`w-3 h-3 border-2 border-muted-indigo ${
          isDarkMode ? 'bg-black' : 'bg-white'
        }`}
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className={`w-3 h-3 border-2 border-muted-indigo ${
          isDarkMode ? 'bg-black' : 'bg-white'
        }`}
      />
    </div>
  )
} 