'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, CheckCircle2, Clock, Zap } from 'lucide-react'
import { Project, Layer } from './workspace-client'

export function WorkspaceSidebar({
  project,
  layers,
  currentLayerIndex,
  onLayerSelect,
}: {
  project: Project
  layers: Layer[]
  currentLayerIndex: number
  onLayerSelect: (index: number) => void
}) {
  return (
    <div className="w-64 border-r border-border bg-background p-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm truncate">{project.title}</h2>
          <p className="text-xs text-muted-foreground">
            Layer {project.current_layer}/8
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground mb-3">
          COACHING LAYERS
        </p>
        {layers.map((layer, index) => (
          <button
            key={layer.id}
            onClick={() => onLayerSelect(index)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
              currentLayerIndex === index
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted',
            )}
          >
            <LayerStatusIcon status={layer.status} />
            <span className="flex-1 truncate">{layer.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function LayerStatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'approved':
      return <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
    case 'generated':
      return <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0" />
    case 'pending':
    default:
      return <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
  }
}
