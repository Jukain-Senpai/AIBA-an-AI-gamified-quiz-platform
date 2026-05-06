import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { MagicInput } from '../components/MagicInput';
import { MagicButton } from '../components/MagicButton';
import { Sparkles } from 'lucide-react';

export function LoginPage() {
  return (
    <div className="flex flex-col h-full">
      <NavBar />

      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/40 border border-purple-500/30 rounded-xl p-8 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
            <div className="text-center mb-6">
              <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-3" style={{ filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.6))' }} />
              <h2 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-1">
                Welcome Back
              </h2>
              <p className="text-purple-300/60 text-sm">Enter the realm of knowledge</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-purple-300 mb-2">Email</label>
                <MagicInput type="email" placeholder="wizard@mysticquest.com" />
              </div>

              <div>
                <label className="block text-sm text-purple-300 mb-2">Password</label>
                <MagicInput type="password" placeholder="••••••••" />
              </div>

              <MagicButton variant="primary" className="w-full">
                Login
              </MagicButton>

              <p className="text-center text-xs text-purple-400/60">
                New adventurer? <a href="#" className="text-cyan-400 hover:underline">Create account</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
