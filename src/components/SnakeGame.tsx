import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION } from '../constants';
import { GameState } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Pause } from 'lucide-react';
import { Button } from './ui/button';

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    isGameOver: false,
    isPaused: true,
  });

  const [highScore, setHighScore] = useState(0);

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState((prev) => {
      const newHead = {
        x: (prev.snake[0].x + prev.direction.x + GRID_SIZE) % GRID_SIZE,
        y: (prev.snake[0].y + prev.direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prev.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;

      // Check collision with food
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newScore += 10;
        newFood = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
      };
    });
  }, [gameState.isGameOver, gameState.isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (gameState.direction.y === 0) setGameState(p => ({ ...p, direction: { x: 0, y: -1 } }));
          break;
        case 'ArrowDown':
          if (gameState.direction.y === 0) setGameState(p => ({ ...p, direction: { x: 0, y: 1 } }));
          break;
        case 'ArrowLeft':
          if (gameState.direction.x === 0) setGameState(p => ({ ...p, direction: { x: -1, y: 0 } }));
          break;
        case 'ArrowRight':
          if (gameState.direction.x === 0) setGameState(p => ({ ...p, direction: { x: 1, y: 0 } }));
          break;
        case ' ':
          setGameState(p => ({ ...p, isPaused: !p.isPaused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (subtle)
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * size + size / 2,
      gameState.food.y * size + size / 2,
      size / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ff00ff' : '#bc13fe';
      ctx.shadowBlur = index === 0 ? 20 : 10;
      ctx.shadowColor = index === 0 ? '#ff00ff' : '#bc13fe';
      
      const padding = 2;
      ctx.fillRect(
        segment.x * size + padding,
        segment.y * size + padding,
        size - padding * 2,
        size - padding * 2
      );
    });

    // Reset shadow for other drawings
    ctx.shadowBlur = 0;
  }, [gameState]);

  const resetGame = () => {
    if (gameState.score > highScore) setHighScore(gameState.score);
    setGameState({
      snake: INITIAL_SNAKE,
      food: { x: 5, y: 5 },
      direction: INITIAL_DIRECTION,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black border-4 border-cyan shadow-[8px_8px_0px_#ff00ff]">
      <div className="flex justify-between w-full px-4 font-heading text-[10px]">
        <div className="flex flex-col">
          <span className="text-cyan/60">SCORE</span>
          <span className="text-2xl text-cyan glitch-text">
            {gameState.score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-cyan/60">MAX_RECORD</span>
          <span className="text-2xl text-magenta glitch-text">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative border-4 border-magenta bg-black p-1">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block"
        />
        
        <AnimatePresence>
          {(gameState.isGameOver || gameState.isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
            >
              {gameState.isGameOver ? (
                <div className="text-center space-y-6">
                  <h2 className="text-3xl font-heading text-magenta glitch-text uppercase tracking-tighter">FATAL_ERROR</h2>
                  <Button 
                    onClick={resetGame}
                    className="bg-cyan hover:bg-magenta text-black font-heading text-xs px-8 py-6 rounded-none border-b-4 border-r-4 border-black active:border-0 transition-all"
                  >
                    REBOOT_SYSTEM
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <h2 className="text-3xl font-heading text-cyan glitch-text uppercase tracking-tighter">SUSPENDED</h2>
                  <Button 
                    onClick={() => setGameState(p => ({ ...p, isPaused: false }))}
                    className="bg-magenta hover:bg-cyan text-white font-heading text-xs px-8 py-6 rounded-none border-b-4 border-r-4 border-black active:border-0 transition-all"
                  >
                    RESUME_EXEC
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-6 text-[10px] font-heading text-cyan/60 uppercase">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cyan border border-black" /> HEAD
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-magenta border border-black" /> NODE
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-black animate-pulse" /> DATA
        </div>
      </div>
    </div>
  );
};
