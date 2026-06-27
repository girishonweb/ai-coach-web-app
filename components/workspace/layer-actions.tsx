'use client'

import { updateLayerStatus } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Layer, Project } from './workspace-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LayerActions({
  project,
  layer,
  userInput,
  aiOutput,
  layerIndex,
  totalLayers,
  onNextLayer,
}: {
  project: Project
  layer: Layer
  userInput: string
  aiOutput: string | null
  layerIndex: number
  totalLayers: number
  onNextLayer: () => void
}) {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      await updateLayerStatus(layer.id, 'approved', userInput, aiOutput)
      router.refresh()
    } catch (error) {
      console.error('Failed to approve layer:', error)
    } finally {
      setIsApproving(false)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      // Save user input first
      await updateLayerStatus(layer.id, 'generated', userInput, null)
      // TODO: Call AI API to generate output
      // For now, show placeholder message
      console.log('Generate AI output - ready for API integration')
      router.refresh()
    } catch (error) {
      console.error('Failed to generate:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleNext = async () => {
    if (layerIndex < totalLayers - 1) {
      onNextLayer()
    }
  }

  const isLastLayer = layerIndex === totalLayers - 1

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !userInput.trim()}
        className="flex-1 sm:flex-initial"
      >
        {isGenerating ? 'Generating...' : 'Generate'}
      </Button>
      <Button
        onClick={handleApprove}
        disabled={isApproving || !aiOutput}
        variant="secondary"
        className="flex-1 sm:flex-initial"
      >
        {isApproving ? 'Approving...' : 'Approve'}
      </Button>
      <Button
        variant="secondary"
        className="flex-1 sm:flex-initial"
      >
        Edit
      </Button>
      <Button
        onClick={handleNext}
        disabled={isLastLayer || layer.status !== 'approved'}
        variant="secondary"
        className="flex-1 sm:flex-initial"
      >
        {isLastLayer ? 'Completed' : 'Next'}
      </Button>
    </div>
  )
}
