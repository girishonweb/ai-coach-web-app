import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <h1 className="text-2xl font-bold">AI Coach</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Structured Coaching for Growth
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Experience a comprehensive 8-layer coaching framework designed to guide you through personal and professional development with clarity and purpose.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">8-Layer Framework</h3>
              <p className="text-sm text-muted-foreground">
                Structured coaching layers to systematically guide your development
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">
                Get intelligent recommendations tailored to your journey
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your advancement through each coaching layer
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
