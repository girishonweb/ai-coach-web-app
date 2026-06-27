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
  const [currentLayerIndex, setCurrentLayerIndex] = useState(
    Math.max(0, project.current_layer - 1),
  )

  const currentLayer = layers[currentLayerIndex]

  return (
    <div className="flex h-screen bg-background">
      <WorkspaceSidebar
        project={project}
        layers={layers}
        currentLayerIndex={currentLayerIndex}
        onLayerSelect={setCurrentLayerIndex}
      />
      {currentLayer && (
        <WorkspaceContent
          project={project}
          layer={currentLayer}
          layerIndex={currentLayerIndex}
          totalLayers={layers.length}
          onNextLayer={() => setCurrentLayerIndex(currentLayerIndex + 1)}
        />
      )}
    </div>
  )
}
