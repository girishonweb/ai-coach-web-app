'use client'

import { useState } from 'react'
import { Project, Layer } from './workspace-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { LayerDescriptions } from './layer-descriptions'
import { LayerActions } from './layer-actions'

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/** Safely extract the user_input string from whatever shape Supabase returns */
function extractUserInput(raw: unknown): string {
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    // The workflow stores { builderInput: "...", mode: "..." } in user_input
    if (typeof obj.builderInput === 'string') return obj.builderInput
    // Fallback: stringify so nothing is silently lost
    return JSON.stringify(obj, null, 2)
  }
  return ''
}

/** Render ai_output regardless of whether it's a string or a JSON object */
function AiOutputDisplay({ value }: { value: unknown }) {
  if (value === null || value === undefined) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Enter your input and click Generate to receive AI-powered recommendations
      </p>
    )
  }

  // Plain string (legacy / fallback)
  if (typeof value === 'string') {
    return (
      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{value}</p>
    )
  }

  // JSON object from the workflow – render each top-level key as a section
  if (typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>
    return (
      <div className="space-y-4">
        {Object.entries(obj).map(([key, val]) => (
          <div key={key}>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {key.replace(/_/g, ' ')}
            </h4>
            {Array.isArray(val) ? (
              <ul className="list-disc list-inside space-y-1">
                {val.map((item, i) => (
                  <li key={i} className="text-sm text-foreground">
                    {typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)}
                  </li>
                ))}
              </ul>
            ) : typeof val === 'object' && val !== null ? (
              <pre className="text-xs text-foreground bg-background rounded p-2 overflow-auto">
                {JSON.stringify(val, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-foreground">{String(val)}</p>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Array or other – JSON dump
  return (
    <pre className="text-xs text-foreground whitespace-pre-wrap">
      {JSON.stringify(value, null, 2)}
    </pre>
  )
}

export function WorkspaceContent({
  project,
  layer,
  layerIndex,
  totalLayers,
  onNextLayer,
}: {
  project: Project
  layer: Layer
  layerIndex: number
  totalLayers: number
  onNextLayer: () => void
}) {
  const [userInput, setUserInput] = useState(extractUserInput(layer.user_input))
  // Keep ai_output as-is (could be string or object) so AiOutputDisplay can render it
  const [aiOutput, setAiOutput] = useState<unknown>(layer.ai_output ?? null)

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl">
        {/* Layer Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Layer {layerIndex + 1} of {totalLayers}
              </span>
              <h1 className="text-3xl font-bold mt-1">{layer.title}</h1>
            </div>
            <span
              className={cn(
                'px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap',
                layer.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : layer.status === 'generated'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800',
              )}
            >
              {layer.status.charAt(0).toUpperCase() + layer.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Layer Description */}
        <div className="mb-8 p-4 bg-muted rounded-lg border border-border">
          <p className="text-sm text-foreground leading-relaxed">
            {LayerDescriptions[layer.layer_key] ??
              'Complete this layer of your coaching journey.'}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          {/* User Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Input</CardTitle>
              <CardDescription>Share your thoughts and insights for this layer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="input">Your Response</Label>
                  <Textarea
                    id="input"
                    placeholder="Enter your thoughts, insights, or responses..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-40 resize-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{userInput.length} characters</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Output</CardTitle>
              <CardDescription>AI-generated insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-40 p-4 rounded-md bg-muted border border-border overflow-auto max-h-[420px]">
                <AiOutputDisplay value={aiOutput} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <LayerActions
          project={project}
          layer={layer}
          userInput={userInput}
          aiOutput={aiOutput}
          onAiOutputChange={setAiOutput}
          layerIndex={layerIndex}
          totalLayers={totalLayers}
          onNextLayer={onNextLayer}
        />
      </div>
    </div>
  )
}