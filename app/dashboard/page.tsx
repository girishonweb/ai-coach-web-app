import { getProjects } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { CreateProjectDialog } from '@/components/dashboard/create-project-dialog'
import { formatDistanceToNow } from 'date-fns'

export default async function Page() {
  const projects = await getProjects()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your coaching projects
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <CreateProjectDialog>
              <Button>Create Your First Project</Button>
            </CreateProjectDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <Link key={project.id} href={`/workspace/${project.id}`}>
              <Card className="cursor-pointer transition-colors hover:border-foreground">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {project.current_layer}/8
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span className="text-xs">
                        {formatDistanceToNow(new Date(project.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
