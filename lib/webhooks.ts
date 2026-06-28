const WEBHOOK_BASE = 'https://girishgarry.app.n8n.cloud/webhook'

export interface GenerateRequest {
  layer_number: number
  user_input: string
  project_id: string
}

export interface GenerateResponse {
  ai_output: string
  [key: string]: unknown
}

export interface ApproveRequest {
  layer_number: number
  user_input: string
  ai_output: string
  action: 'approve' | 'edit' | 'regenerate'
  project_id: string
}

export interface ApproveResponse {
  success: boolean
  [key: string]: unknown
}

export async function callGenerateWebhook(
  data: GenerateRequest,
): Promise<GenerateResponse> {
  const response = await fetch(`${WEBHOOK_BASE}/coach-generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Generate webhook failed: ${response.statusText}`)
  }

  return response.json()
}

export async function callApproveWebhook(
  data: ApproveRequest,
): Promise<ApproveResponse> {
  const response = await fetch(`${WEBHOOK_BASE}/coach-approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Approve webhook failed: ${response.statusText}`)
  }

  return response.json()
}
