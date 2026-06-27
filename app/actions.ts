'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProjects() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title, status, current_layer, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return projects || []
}

export async function createProject(title: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      title,
      status: 'active',
      current_layer: 1,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // Create initial 8 layers for the project
  const layers = Array.from({ length: 8 }, (_, i) => ({
    project_id: project.id,
    layer_number: i + 1,
    layer_key: `layer_${i + 1}`,
    title: `Layer ${i + 1}`,
    status: 'pending',
    user_input: null,
    ai_output: null,
  }))

  const { error: layersError } = await supabase
    .from('project_layers')
    .insert(layers)

  if (layersError) {
    throw new Error(layersError.message)
  }

  revalidatePath('/dashboard')
  return project
}

export async function getProjectWithLayers(projectId: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, title, status, current_layer')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (projectError) {
    throw new Error(projectError.message)
  }

  const { data: layers, error: layersError } = await supabase
    .from('project_layers')
    .select('id, layer_number, layer_key, title, status, user_input, ai_output, approved_at')
    .eq('project_id', projectId)
    .order('layer_number', { ascending: true })

  if (layersError) {
    throw new Error(layersError.message)
  }

  return { project, layers: layers || [] }
}

export async function updateLayerStatus(
  layerId: string,
  status: 'pending' | 'generated' | 'approved',
  userInput?: unknown,
  aiOutput?: unknown,
) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const updateData: Record<string, unknown> = {
    status,
  }

  if (userInput !== undefined) {
    updateData.user_input = userInput
  }

  if (aiOutput !== undefined) {
    updateData.ai_output = aiOutput
  }

  if (status === 'approved') {
    updateData.approved_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('project_layers')
    .update(updateData)
    .eq('id', layerId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/workspace/${await getProjectIdFromLayer(layerId)}`)
}

async function getProjectIdFromLayer(layerId: string): Promise<string> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('project_layers')
    .select('project_id')
    .eq('id', layerId)
    .single()

  return data?.project_id || ''
}

export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
}
