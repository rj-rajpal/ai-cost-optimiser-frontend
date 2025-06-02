import { Mail, AlertTriangle, MessageSquare } from 'lucide-react'

/**
 * Input  : ["1 - Email ingestion", "2 - Priority classification", "3 - Response generation"]
 * Output : {
 *   nodes: React-Flow nodes[],
 *   edges: React-Flow edges[],
 *   cards: { id:string; title:string; description:string; icon:LucideIcon }[]
 * }
 */
export function mapArchitecture(steps) {
  const iconMap = [Mail, AlertTriangle, MessageSquare]

  const nodes = steps.map((text, idx) => {
    const [, label] = `Step ${idx + 1}`
    return {
      id: `step-${idx}`,
      data: { label: `Step ${idx + 1}`, icon: iconMap[idx] },
      position: { x: idx * 240, y: 0 },
      type: 'stepNode'
    }
  })

  const edges = nodes.slice(0, -1).map((_, idx) => ({
    id: `e-${idx}`,
    source: `step-${idx}`,
    target: `step-${idx + 1}`,
    animated: true,
    style: { strokeWidth: 2 }
  }))

  const cards = nodes.map((n, idx) => ({
    id: n.id,
    title: `Step ${idx + 1}`,
    description: `Step ${idx + 1}`,
    icon: iconMap[idx]
  }))

  return { nodes, edges, cards }
} 