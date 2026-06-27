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
  const [userInput, setUserInput] = useState(
    typeof layer.user_input === 'string' ? layer.user_input : '',
  )
  const aiOutput =
    typeof layer.ai_output === 'string' ? layer.ai_output : null

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
            {LayerDescriptions[layer.layer_key as keyof typeof LayerDescriptions] ||
              'Complete this layer of your coaching journey.'}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          {/* User Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Input</CardTitle>
              <CardDescription>
                Share your thoughts and insights for this layer
              </CardDescription>
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
                <p className="text-xs text-muted-foreground">
                  {userInput.length} characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Output</CardTitle>
              <CardDescription>
                AI-generated insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-40 p-4 rounded-md bg-muted border border-border">
                {aiOutput ? (
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {aiOutput}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Enter your input and click Generate to receive AI-powered recommendations
                  </p>
                )}
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
          layerIndex={layerIndex}
          totalLayers={totalLayers}
          onNextLayer={onNextLayer}
        />
      </div>
    </div>
  )
}
