'use client'

import { updateLayerStatus } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Layer, Project } from './workspace-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { callGenerateWebhook, callApproveWebhook } from '@/lib/webhooks'
import { Loader2, Sparkles, CheckCircle2, RefreshCw, ChevronRight } from 'lucide-react'

export function LayerActions({
  project,
  layer,
  userInput,
  aiOutput,
  onAiOutputChange,
  layerIndex,
  totalLayers,
  onNextLayer,
  isAutoLayer = false,
}: {
  project: Project
  layer: Layer
  userInput: string
  aiOutput: unknown
  onAiOutputChange: (output: unknown) => void
  layerIndex: number
  totalLayers: number
  onNextLayer: () => void
  isAutoLayer?: boolean
}) {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasOutput = aiOutput !== null && aiOutput !== undefined
  const isLastLayer = layerIndex === totalLayers - 1
  const isLoading = isGenerating || isApproving || isRegenerating

  // ── Generate (manual layers 1–3 only) ─────────────────────────────────────
  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      await updateLayerStatus(layer.id, 'generated', userInput, null)
      const response = await callGenerateWebhook({
        projectId: project.id,
        layerKey: layer.layer_key,
        builderInput: userInput,
        mode: 'generate',
      })
      const aiGeneratedOutput = response.aiOutput ?? response
      onAiOutputChange(aiGeneratedOutput)
      await updateLayerStatus(layer.id, 'generated', userInput, aiGeneratedOutput)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate')
    } finally {
      setIsGenerating(false)
    }
  }

  // ── Approve ────────────────────────────────────────────────────────────────
  const handleApprove = async () => {
    setIsApproving(true)
    setError(null)
    try {
      await callApproveWebhook({
        projectId: project.id,
        layerKey: layer.layer_key,
        action: 'approve',
      })
      await updateLayerStatus(layer.id, 'approved', isAutoLayer ? null : userInput, aiOutput)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve')
    } finally {
      setIsApproving(false)
    }
  }

  // ── Regenerate (available on both manual and auto layers) ──────────────────
  const handleRegenerate = async () => {
    setIsRegenerating(true)
    setError(null)
    try {
      const response = await callGenerateWebhook({
        projectId: project.id,
        layerKey: layer.layer_key,
        builderInput: userInput || 'Auto-generate based on previous approved layers.',
        mode: 'regenerate',
      })
      const aiGeneratedOutput = response.aiOutput ?? response
      onAiOutputChange(aiGeneratedOutput)
      await updateLayerStatus(
        layer.id,
        'generated',
        isAutoLayer ? null : userInput,
        aiGeneratedOutput,
      )
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate')
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {/* Generate — only for manual layers 1–3 */}
        {!isAutoLayer && (
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !userInput.trim()}
            className="gap-2"
          >
            {isGenerating ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="h-3.5 w-3.5" /> Generate</>
            )}
          </Button>
        )}

        {/* Approve + Regenerate — shown when there is output */}
        {hasOutput && (
          <>
            <Button
              onClick={handleApprove}
              disabled={isLoading || layer.status === 'approved'}
              variant="outline"
              className="gap-2 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600 dark:text-emerald-400"
            >
              {isApproving ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Approving…</>
              ) : (
                <><CheckCircle2 className="h-3.5 w-3.5" /> Approve</>
              )}
            </Button>

            <Button
              onClick={handleRegenerate}
              disabled={isLoading}
              variant="ghost"
              className="gap-2 text-muted-foreground"
            >
              {isRegenerating ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Regenerating…</>
              ) : (
                <><RefreshCw className="h-3.5 w-3.5" /> Regenerate</>
              )}
            </Button>
          </>
        )}

        {/* Next layer */}
        {layer.status === 'approved' && !isLastLayer && (
          <Button
            onClick={onNextLayer}
            variant="secondary"
            className="gap-2 ml-auto"
          >
            Next Layer <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}

        {isLastLayer && layer.status === 'approved' && (
          <span className="ml-auto text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> All layers complete
          </span>
        )}
      </div>
    </div>
  )
}