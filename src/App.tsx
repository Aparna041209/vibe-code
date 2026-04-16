import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Cpu, Activity, AlertTriangle } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan font-sans selection:bg-magenta selection:text-white overflow-hidden relative noise-bg">
      <div className="scanline" />
      
      {/* Glitch Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-10 mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-[noise_0.2s_infinite]" />

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center gap-8">
        {/* Header */}
        <header className="text-center space-y-4 border-b-4 border-cyan pb-8 w-full max-w-4xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center gap-2"
          >
            <div className="flex items-center gap-4">
              <Terminal className="w-8 h-8 text-magenta animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-heading tracking-tighter uppercase glitch-text leading-none">
                SYSTEM_FAILURE
              </h1>
            </div>
            <div className="bg-cyan text-black px-4 py-1 font-heading text-xs mt-4">
              PROTOCOL: NEON_RHYTHM_V2.0.4
            </div>
          </motion.div>
          <div className="flex justify-center gap-8 text-[10px] font-heading uppercase tracking-widest text-magenta/60">
            <span>[ STATUS: UNSTABLE ]</span>
            <span>[ MEMORY: CORRUPTED ]</span>
            <span>[ UPLINK: ACTIVE ]</span>
          </div>
        </header>

        {/* Content Grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* Game Section */}
          <motion.section 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col items-center gap-4 border-2 border-cyan p-4 bg-black/50 relative"
          >
            <div className="absolute -top-3 -left-3 bg-cyan text-black px-2 py-1 text-[10px] font-heading">
              MODULE_01: KINETIC_SIM
            </div>
            <SnakeGame />
            <div className="mt-4 w-full border-t border-cyan/30 pt-4 font-sans text-sm text-cyan/80">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-magenta" />
                <span className="font-heading text-[10px] text-magenta">INPUT_REQUIRED:</span>
              </div>
              <p className="font-mono leading-relaxed">
                {">"} USE_DIRECTIONAL_ARROWS_FOR_NAVIGATION<br />
                {">"} SPACE_BAR_INTERRUPTS_EXECUTION_FLOW<br />
                {">"} CONSUME_DATA_PACKETS_TO_EXPAND_BUFFER
              </p>
            </div>
          </motion.section>

          {/* Sidebar Section */}
          <motion.section 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4 border-2 border-magenta p-4 bg-black/50 relative">
              <div className="absolute -top-3 -right-3 bg-magenta text-white px-2 py-1 text-[10px] font-heading">
                MODULE_02: AUDIO_STREAM
              </div>
              <MusicPlayer />
            </div>

            {/* Stats/Info Card */}
            <div className="border-2 border-cyan/50 p-6 space-y-6 bg-black/80">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan" />
                <h4 className="text-[10px] font-heading uppercase tracking-widest text-cyan">CORE_METRICS</h4>
              </div>
              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-cyan/60">NEURAL_LOAD</span>
                    <span className="text-magenta">98.4%</span>
                  </div>
                  <div className="w-full bg-cyan/10 h-2 border border-cyan/30">
                    <motion.div 
                      animate={{ width: ['20%', '98%', '85%', '98%'] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="h-full bg-magenta"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-cyan/20 pb-2">
                  <span className="text-cyan/60">ENTROPY_LEVEL</span>
                  <span className="text-cyan animate-pulse">CRITICAL</span>
                </div>
                <div className="flex justify-between items-center border-b border-cyan/20 pb-2">
                  <span className="text-cyan/60">LATENCY</span>
                  <span className="text-magenta">0.000042ms</span>
                </div>
                <div className="flex items-center gap-2 text-magenta/80 italic">
                  <Activity className="w-3 h-3" />
                  <span>HEARTBEAT_DETECTED...</span>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-8 text-center border-t-4 border-magenta w-full max-w-4xl">
          <p className="text-[8px] font-heading text-cyan/40 uppercase tracking-[0.5em]">
            TERMINAL_ID: {Math.random().toString(36).substring(7).toUpperCase()} // END_OF_LINE
          </p>
        </footer>
      </main>
    </div>
  );
}
