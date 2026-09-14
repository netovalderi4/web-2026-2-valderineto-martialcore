import { ShieldCheck, Flame, Trophy } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-2 bg-amber-500 text-black font-black rounded-lg text-xl">MC</span>
        <h1 className="text-3xl font-black tracking-wider text-amber-500">
          MARTIAL<span className="text-white">CORE</span>
        </h1>
      </div>
      
      <p className="text-zinc-400 max-w-md mb-8">
        Frontend React + TypeScript + Tailwind CSS v4 configurado com sucesso!
      </p>

      <div className="flex gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-400 text-sm font-semibold">
          <ShieldCheck className="w-4 h-4" /> BJJ
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-400 text-sm font-semibold">
          <Flame className="w-4 h-4" /> Muay Thai
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-400 text-sm font-semibold">
          <Trophy className="w-4 h-4" /> Karatê
        </div>
      </div>
    </div>
  )
}