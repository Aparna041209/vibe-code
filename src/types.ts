export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export interface GameState {
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  direction: { x: number; y: number };
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}
