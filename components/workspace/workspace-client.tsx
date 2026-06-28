'use client'

import { useState } from 'react'
import { WorkspaceSidebar } from './sidebar'
import { WorkspaceContent } from './content'

export interface Project {
  id: string
  title: string
  status: string
  current_layer: number
}

export interface Layer {
  id: string
  layer_number: number
  layer_key: string
  title: string
  status: 'pending' | 'generated' | 'approved'
  user_input: unknown
  ai_output: unknown
  approved_at: string | null
}

export function WorkspaceClient({
  project,
  layers,
}: {
  project: Project
  layers: Layer[]
}) {
  // current_layer is 1-indexed; clamp to valid range
  const initialIndex = Math.min(
    Math.max(0, (project.current_layer ?? 1) - 1),
    Math.max(0, layers.length - 1),
  )
  const [currentLayerIndex, setCurrentLayerIndex] = useState(initialIndex)

  const currentLayer = layers[currentLayerIndex]

  if (!currentLayer) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        No layers found for this project.
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <WorkspaceSidebar
        project={project}
        layers={layers}
        currentLayerIndex={currentLayerIndex}
        onLayerSelect={setCurrentLayerIndex}
      />
      <WorkspaceContent
        key={currentLayer.id}   /* remount content when layer changes to reset local state */
        project={project}
        layer={currentLayer}
        layerIndex={currentLayerIndex}
        totalLayers={layers.length}
        onNextLayer={() => setCurrentLayerIndex(currentLayerIndex + 1)}
      />
    </div>
  )
}