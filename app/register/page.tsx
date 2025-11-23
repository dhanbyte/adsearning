"use client"

import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              EarnX
            </h1>
          </Link>
          <p className="text-gray-300">Create your account and start earning today!</p>
        </div>
        
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 shadow-2xl",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "bg-slate-700/50 border-slate-600 hover:bg-slate-600/50 text-white",
                formButtonPrimary: "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700",
                footerActionLink: "text-cyan-400 hover:text-cyan-300",
                formFieldInput: "bg-slate-700/50 border-slate-600 text-white",
                formFieldLabel: "text-gray-300",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-cyan-400",
              }
            }}
            routing="path"
            path="/register"
            signInUrl="/login"
            redirectUrl="/dashboard"
          />
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
