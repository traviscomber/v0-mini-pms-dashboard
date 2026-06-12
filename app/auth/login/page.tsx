import Link from "next/link";
import { redirect } from "next/navigation";

import { getViewerContext } from "@/lib/auth/session";
import { hasSupabaseAuthConfig } from "@/lib/supabase/config";

import { signInAction, signUpAction } from "@/app/auth/login/actions";

interface LoginPageProps {
  searchParams: Promise<{
    message?: string;
    next?: string;
  }>;
}

function sanitizeNextPath(path?: string) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = sanitizeNextPath(params.next);
  const viewer = await getViewerContext();

  if (viewer.authEnabled && viewer.user) {
    redirect(viewer.needsSetup || !viewer.schemaReady ? "/setup" : next);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                N3uralia
              </span>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-sm text-slate-400 hover:text-white transition">Features</a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition">Docs</a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition">Support</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Section - Hero */}
          <div className="hidden md:flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="inline-flex items-center px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-sm font-medium text-amber-300">
                  ✨ Enterprise Ready
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-white">
                Property Management
                <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                Modern AI-powered operations platform for boutique hotels, hostels, and vacation rentals. Manage properties, maximize revenue, and delight guests—all from one unified dashboard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-sm text-slate-400">Dynamic Pricing</p>
                <p className="text-lg font-semibold text-white">AI-Optimized Rates</p>
                <p className="text-xs text-slate-400">+25% Revenue</p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-sm text-slate-400">Guest Experience</p>
                <p className="text-lg font-semibold text-white">24/7 Automation</p>
                <p className="text-xs text-slate-400">100% Uptime</p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-sm text-slate-400">Real-time Analytics</p>
                <p className="text-lg font-semibold text-white">Live Insights</p>
                <p className="text-xs text-slate-400">Instant Alerts</p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-sm text-slate-400">Multi-Property</p>
                <p className="text-lg font-semibold text-white">Scale Instantly</p>
                <p className="text-xs text-slate-400">Unlimited Growth</p>
              </div>
            </div>
          </div>

          {/* Right Section - Auth Forms */}
          <div className="space-y-6">
            {params.message && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                {params.message}
              </div>
            )}

            {!hasSupabaseAuthConfig() && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                ⚠️ Supabase not configured. Add environment variables to enable authentication.
              </div>
            )}

            {/* Sign In Form */}
            <form id="signin-form" action={signInAction} className="space-y-6 rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-800 to-slate-900 p-8 shadow-2xl">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                <p className="text-sm text-slate-400">Sign in to your property management workspace</p>
              </div>

              <input type="hidden" name="next" value={next} />

              <div className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-300">Email Address</span>
                  <input
                    type="email"
                    name="email"
                    required
                    suppressHydrationWarning
                    className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500 focus:border-amber-500 focus:bg-slate-700 focus:outline-none transition"
                    placeholder="manager@property.com"
                    autoComplete="email"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-300">Password</span>
                  <input
                    type="password"
                    name="password"
                    required
                    suppressHydrationWarning
                    className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500 focus:border-amber-500 focus:bg-slate-700 focus:outline-none transition"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </label>
              </div>

              <button
                type="submit"
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign In
              </button>

              <p className="text-xs text-slate-400 text-center">
                Don&apos;t have an account?{" "}
                <Link href="#signup-form" className="text-amber-400 hover:text-amber-300 font-medium">
                  Create one
                </Link>
              </p>
            </form>

            {/* Sign Up Form */}
            <form id="signup-form" action={signUpAction} className="space-y-6 rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-800/70 to-slate-900/70 p-8 shadow-lg backdrop-blur-sm">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white">Get Started</h2>
                <p className="text-sm text-slate-400">Create your operator account and first workspace</p>
              </div>

              <div className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-300">Full Name</span>
                  <input
                    type="text"
                    name="fullName"
                    required
                    suppressHydrationWarning
                    className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500 focus:border-amber-500 focus:bg-slate-700 focus:outline-none transition"
                    placeholder="Your name"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-300">Email Address</span>
                  <input
                    type="email"
                    name="email"
                    required
                    suppressHydrationWarning
                    className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500 focus:border-amber-500 focus:bg-slate-700 focus:outline-none transition"
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-300">Password</span>
                  <input
                    type="password"
                    name="password"
                    minLength={8}
                    required
                    suppressHydrationWarning
                    className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500 focus:border-amber-500 focus:bg-slate-700 focus:outline-none transition"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
                </label>
              </div>

              <button
                type="submit"
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Create Account
              </button>

              <p className="text-xs text-slate-400 text-center">
                Already have an account?{" "}
                <Link href="#signin-form" className="text-amber-400 hover:text-amber-300 font-medium">
                  Sign in
                </Link>
              </p>
            </form>

            <p className="text-xs text-slate-500 text-center px-4">
              By signing in, you agree to our{" "}
              <a href="#" className="text-slate-400 hover:text-slate-300 underline">Terms of Service</a> and{" "}
              <a href="#" className="text-slate-400 hover:text-slate-300 underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-slate-400">
          <p>© 2025 N3uralia. Enterprise property management platform.</p>
        </div>
      </footer>
    </main>
  );
}
