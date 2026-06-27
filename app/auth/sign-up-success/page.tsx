import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Sign Up Successful</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Check your email to confirm your account. Once confirmed, you can log in.
            </p>
          </div>
          <Link href="/auth/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
