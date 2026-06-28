'use client'

import { updateLayerStatus } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Layer, Project } from './workspace-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { callGenerateWebhook, callApproveWebhook } from '@/lib/webhooks'

export function LayerActions({
  project,
  layer,
  userInput,
  aiOutput,
  onAiOutputChange,
  layerIndex,
  totalLayers,
  onNextLayer,
}: {
  project: Project
  layer: Layer
  userInput: string
  aiOutput: string | null
  onAiOutputChange: (output: string | null) => void
  layerIndex: number
  totalLayers: number
  onNextLayer: () => void
}) {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      // Save user input first
      await updateLayerStatus(layer.id, 'generated', userInput, null)

      // Call the generate webhook
      const response = await callGenerateWebhook({
        layer_number: layer.layer_number || layerIndex + 1,
        user_input: userInput,
        project_id: project.id,
      })

      // Update UI with AI output
      const aiGeneratedOutput = response.ai_output || JSON.stringify(response)
      onAiOutputChange(aiGeneratedOutput)

      // Save AI output to database
      await updateLayerStatus(layer.id, 'generated', userInput, aiGeneratedOutput)
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate'
      setError(errorMessage)
      console.error('Failed to generate:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApprove = async () => {
    setIsApproving(true)
    setError(null)
    try {
      // Call the approve webhook
      await callApproveWebhook({
        layer_number: layer.layer_number || layerIndex + 1,
        user_input: userInput,
        ai_output: aiOutput || '',
        action: 'approve',
        project_id: project.id,
      })

      // Update layer status to approved
      await updateLayerStatus(layer.id, 'approved', userInput, aiOutput)
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve'
      setError(errorMessage)
      console.error('Failed to approve layer:', err)
    } finally {
      setIsApproving(false)
    }
  }

  const handleEdit = async () => {
    setIsRegenerating(true)
    setError(null)
    try {
      // Call the approve webhook with edit action
      await callApproveWebhook({
        layer_number: layer.layer_number || layerIndex + 1,
        user_input: userInput,
        ai_output: aiOutput || '',
        action: 'edit',
        project_id: project.id,
      })
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to edit'
      setError(errorMessage)
      console.error('Failed to edit layer:', err)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    setError(null)
    try {
      // Call the approve webhook with regenerate action
      const response = await callApproveWebhook({
        layer_number: layer.layer_number || layerIndex + 1,
        user_input: userInput,
        ai_output: aiOutput || '',
        action: 'regenerate',
        project_id: project.id,
      })

      // If the response contains new AI output, update it
      if ('ai_output' in response && typeof response.ai_output === 'string') {
        onAiOutputChange(response.ai_output)
        await updateLayerStatus(layer.id, 'generated', userInput, response.ai_output)
      }

      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate'
      setError(errorMessage)
      console.error('Failed to regenerate:', err)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleNext = async () => {
    if (layerIndex < totalLayers - 1) {
      onNextLayer()
    }
  }

  const isLastLayer = layerIndex === totalLayers - 1
  const isLoading = isGenerating || isApproving || isRegenerating

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={handleGenerate}
          disabled={isLoading || !userInput.trim()}
          className="flex-1 sm:flex-initial"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
        <Button
          onClick={handleApprove}
          disabled={isLoading || !aiOutput}
          variant="secondary"
          className="flex-1 sm:flex-initial"
        >
          {isApproving ? 'Approving...' : 'Approve'}
        </Button>
        <Button
          onClick={handleEdit}
          disabled={isLoading || !aiOutput}
          variant="secondary"
          className="flex-1 sm:flex-initial"
        >
          {isRegenerating && !isGenerating && !isApproving ? 'Editing...' : 'Edit'}
        </Button>
        <Button
          onClick={handleRegenerate}
          disabled={isLoading || !aiOutput}
          variant="secondary"
          className="flex-1 sm:flex-initial"
        >
          {isRegenerating && !isGenerating && !isApproving ? 'Regenerating...' : 'Regenerate'}
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
    </div>
  )
}
