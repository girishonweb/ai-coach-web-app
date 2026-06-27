import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Authentication Error</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Something went wrong during the authentication process.
            </p>
          </div>
          <Link href="/auth/login">
            <Button className="w-full">Try Again</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
