import React, { useState, useRef, useEffect } from 'react';
import { TRACKS } from '../constants';
import { Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { motion, AnimatePresence } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-magenta p-6 shadow-[8px_8px_0px_#00ffff] relative overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex flex-col gap-6 relative z-10">
        {/* Track Info */}
        <div className="flex items-center gap-5 border-b-2 border-magenta/30 pb-4">
          <motion.div 
            key={currentTrack.id}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative w-20 h-20 border-2 border-cyan grayscale hover:grayscale-0 transition-all"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-cyan/20 flex items-center justify-center">
                <div className="flex gap-1 items-end h-8">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 20, 8, 24, 4] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-2 bg-magenta"
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <div className="flex-1 min-w-0 font-heading">
            <h3 className="text-sm text-cyan truncate glitch-text">{currentTrack.title}</h3>
            <p className="text-[10px] text-magenta mt-1">{currentTrack.artist}</p>
            <div className="mt-2">
              <span className="px-2 py-0.5 bg-cyan text-black text-[8px] uppercase tracking-tighter">
                ENCODED_BY_AI
              </span>
            </div>
          </div>
        </div>

        {/* Progress Slider */}
        <div className="space-y-2">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={handleProgressChange}
            className="cursor-crosshair"
          />
          <div className="flex justify-between text-[10px] font-heading text-cyan/60">
            <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '00:00'}</span>
            <span>{audioRef.current ? formatTime(audioRef.current.duration) : '00:00'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handlePrev} className="text-cyan hover:text-magenta hover:bg-cyan/10 rounded-none border border-cyan/30">
              <SkipBack className="h-4 w-4 fill-current" />
            </Button>
            
            <Button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-none bg-cyan text-black hover:bg-magenta hover:text-white border-b-4 border-r-4 border-black active:border-0 transition-all"
            >
              {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-1" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={handleNext} className="text-cyan hover:text-magenta hover:bg-cyan/10 rounded-none border border-cyan/30">
              <SkipForward className="h-4 w-4 fill-current" />
            </Button>
          </div>

          <div className="flex items-center gap-3 w-24">
            <Volume2 className="h-4 w-4 text-cyan" />
            <Slider
              value={[volume * 100]}
              max={100}
              onValueChange={(v) => setVolume(v[0] / 100)}
              className="cursor-crosshair"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
