"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Zap, Users, DollarSign, TrendingUp, Gift, Smartphone, Target } from "lucide-react"
import Link from "next/link"
import AutoAd from "@/components/AutoAd"

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: "Watch Ads & Earn",
      description: "Watch display and video ads, earn money automatically per view",
    },
    {
      icon: DollarSign,
      title: "Video Ads (High Payout)",
      description: "10–30 second video ads with highest CPM payouts",
    },
    {
      icon: Target,
      title: "Offerwalls Integration",
      description: "Complete surveys, trials, and CPA/CPI offers",
    },
    {
      icon: Smartphone,
      title: "App Install Earnings",
      description: "Install an app and open it to earn money instantly",
    },
    {
      icon: Gift,
      title: "Daily Bonus & Streak",
      description: "Earn daily login bonus and weekly milestone rewards",
    },
    {
      icon: Users,
      title: "Referral Program",
      description: "Refer friends and earn 20% lifetime commission",
    },
    {
      icon: TrendingUp,
      title: "Instant Withdrawals",
      description: "UPI / Paytm / Bank transfer with 24-hour guarantee",
    },
    {
      icon: DollarSign,
      title: "Secure Wallet",
      description: "Real-time earnings dashboard with transaction history",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      earning: "₹15,000+",
      feedback: "Great platform! Earned ₹15,000 in just 2 months by watching ads and doing surveys.",
      rating: 5,
    },
    {
      name: "Priya Singh",
      earning: "₹22,500+",
      feedback: "The referral system is amazing. My friends and I are earning passive income together.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      earning: "₹8,900+",
      feedback: "Fast withdrawals and transparent system. Highly recommended for earning online.",
      rating: 4.5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/40 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            EarnX
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="rounded-lg bg-transparent text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 border-0 text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-6 leading-tight">
            Earn Money by
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {" "}
              Simple Tasks
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Watch ads, surveys, install apps. Earn daily.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/register">
              <Button
                size="sm"
                className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 border-0 text-white px-6 sm:px-8 text-sm sm:text-base"
              >
                Start Earning <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg border-white/20 bg-transparent text-sm sm:text-base px-6 sm:px-8"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ads Section */}
      <section className="px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          {/* TOP BANNER 728x90 */}
          <AutoAd codeId="home728" keyCode="b08fb6b8e9559715f42f6c7e66e97293" width={728} height={90} />
          
          {/* Middle Ad 300x250 */}
          <AutoAd codeId="home300" keyCode="e35abebc542f6f383ec0fec194d6f5a5" width={300} height={250} />
          
          {/* Button Ad */}
          <div className="mt-4 w-full flex flex-col items-center">
            <Link href="/register">
              <Button className="btn mb-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform">
                Start Earning Now
              </Button>
            </Link>
            <AutoAd codeId="btnAd" keyCode="76d089bf9465d6453c0a73e0808b0f37" width={320} height={50} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-16">How You Earn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card
                  key={idx}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 p-4 sm:p-6 rounded-xl sm:rounded-2xl group hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-semibold text-white mb-1 sm:mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-8 sm:mb-16">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: 1, title: "Sign Up", desc: "Create account in seconds" },
              { step: 2, title: "Start Earning", desc: "Watch ads & do tasks" },
              { step: 3, title: "Withdraw", desc: "Cash out to bank/UPI" },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-br from-cyan-500 to-purple-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-lg sm:text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-gray-400 text-xs sm:text-base">{item.desc}</p>
                {idx < 2 && (
                  <div className="hidden sm:block absolute top-8 -right-4 w-8 h-1 bg-gradient-to-r from-cyan-500 to-purple-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-16">What Users Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, idx) => (
              <Card
                key={idx}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div>
                    <h4 className="text-white font-semibold text-sm sm:text-base">{testimonial.name}</h4>
                    <p className="text-cyan-400 text-xs sm:text-sm font-semibold">{testimonial.earning}</p>
                  </div>
                  <div className="text-yellow-400 text-sm">{"★".repeat(Math.floor(testimonial.rating))}</div>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">{testimonial.feedback}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-6 sm:mb-8 text-xs sm:text-sm">
            <div>
              <h4 className="text-white font-semibold mb-3">EarnX Hub</h4>
              <p className="text-gray-400">Earn online easily.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-1.5 text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-1.5 text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-1.5 text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400">
                    Help
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>&copy; 2025 EarnX Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
