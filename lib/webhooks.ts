const WEBHOOK_BASE = 'https://girishgarry.app.n8n.cloud/webhook'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GenerateRequest {
  projectId: string
  layerKey: string
  builderInput: string
  mode: 'generate' | 'regenerate'
}

export interface GenerateResponse {
  success: boolean
  layerId?: string
  projectId?: string
  layerKey?: string
  layerTitle?: string
  aiOutput?: Record<string, unknown>
  tokensUsed?: unknown
  [key: string]: unknown
}

export interface ApproveRequest {
  projectId: string
  layerKey: string
  action: 'approve' | 'edit' | 'regenerate'
  builderInput?: string
  editedOutput?: Record<string, unknown>
}

export interface ApproveResponse {
  success: boolean
  action?: string
  nextLayer?: number
  generateResult?: GenerateResponse
  [key: string]: unknown
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function post<T>(path: string, data: unknown): Promise<T> {
  const response = await fetch(`${WEBHOOK_BASE}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText)
    throw new Error(`Webhook ${path} failed (${response.status}): ${text}`)
  }

  return response.json() as Promise<T>
}

export async function callGenerateWebhook(
  data: GenerateRequest,
): Promise<GenerateResponse> {
  return post<GenerateResponse>('coach-generate', data)
}

export async function callApproveWebhook(
  data: ApproveRequest,
): Promise<ApproveResponse> {
  return post<ApproveResponse>('coach-approve', data)
}