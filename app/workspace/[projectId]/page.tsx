import { getProjectWithLayers } from '@/app/actions'
import { WorkspaceClient } from '@/components/workspace/workspace-client'
import { redirect } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params

  try {
    const { project, layers } = await getProjectWithLayers(projectId)
    return <WorkspaceClient project={project} layers={layers} />
  } catch (error) {
    redirect('/dashboard')
  }
}
