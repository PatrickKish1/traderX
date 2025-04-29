'use client';
import { GameState } from '@/lib/types/crypto';
import { useState, useEffect, useRef } from 'react';
const CryptoGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    coins: 0,
    gameOver: false,
    highScore: 0
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Game variables
  const gameLoopRef = useRef<number | null>(null);
  const playerRef = useRef({
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    speed: 5
  });
  const coinsRef = useRef<Array<{x: number, y: number, value: number}>>([]);
  const obstaclesRef = useRef<Array<{x: number, y: number, width: number, height: number}>>([]);
  const keysRef = useRef<{[key: string]: boolean}>({});
  const touchPositionRef = useRef<{x: number, y: number} | null>(null);
  const lastCoinTimeRef = useRef<number>(0);
  const lastObstacleTimeRef = useRef<number>(0);
  const gameTimeRef = useRef<number>(0);
  const bitcoinImageRef = useRef<HTMLImageElement | null>(null);
  const playerImageRef = useRef<HTMLImageElement | null>(null);
  const obstacleImageRef = useRef<HTMLImageElement | null>(null);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Initialize game assets
  useEffect(() => {
    // Load bitcoin image
    const bitcoinImg = new Image();
    bitcoinImg.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmFiMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTEuNzY3IDEyLjQ1MmMtMS4wNTktLjcwNi0xLjc2Ny0xLjkwNy0xLjc2Ny0zLjI3MiAwLTIuMTY5IDEuNzg2LTMuOTMgMy45ODUtMy45MyAxLjM2NSAwIDIuNTY2LjcwOCAzLjI3MiAxLjc2NyIvPjxwYXRoIGQ9Ik0xMS43NjcgMTEuNTQ4YzEuMDU5LjcwNiAxLjc2NyAxLjkwNyAxLjc2NyAzLjI3MiAwIDIuMTY5LTEuNzg2IDMuOTMtMy45ODUgMy45My0xLjM2NSAwLTIuNTY2LS43MDgtMy4yNzItMS43NjciLz48cGF0aCBkPSJNMTMuOTg1IDEyaDEuOTkzYy41NTIgMCAxIC40NDggMSAxcy0uNDQ4IDEtMSAxaC0xLjk5MyIvPjxwYXRoIGQ9Ik0xMy45ODUgMTBoMS45OTNjLjU1MiAwIDEgLjQ0OCAxIDFzLS40NDggMS0xIDFoLTEuOTkzIi8+PHBhdGggZD0iTTkuOTkgMTRoLTEuOTkzYy0uNTUyIDAtMS0uNDQ4LTEtMXMuNDQ4LTEgMS0xaDEuOTkzIi8+PHBhdGggZD0iTTkuOTkgMTJoLTEuOTkzYy0uNTUyIDAtMS0uNDQ4LTEtMXMuNDQ4LTEgMS0xaDEuOTkzIi8+PC9zdmc+";
    bitcoinImageRef.current = bitcoinImg;
    
    // Load player image (wallet icon)
    const playerImg = new Image();
    playerImg.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDc0RDkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIyIiB5PSI0IiB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHJ4PSIyIi8+PHJlY3QgeD0iMTYiIHk9IjEwIiB3aWR0aD0iNCIgaGVpZ2h0PSI0Ii8+PHBhdGggZD0iTTIgMTJoMTQiLz48L3N2Zz4=";
    playerImageRef.current = playerImg;
    
    // Load obstacle image (warning icon)
    const obstacleImg = new Image();
    obstacleImg.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjQxMzYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTAgMTRsMi41LTIuNSAyLjUgMi41Ii8+PHBhdGggZD0iTTE1IDEwbC0yLjUgMi41TDEwIDEwIi8+PHBhdGggZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01eiIvPjxwYXRoIGQ9Ik0yIDEybDEwIDUgMTAtNSIvPjxwYXRoIGQ9Ik0yIDE3bDEwIDUgMTAtNSIvPjwvc3ZnPg==";
    obstacleImageRef.current = obstacleImg;
  }, []);
  
  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      // Set canvas dimensions to match parent container
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      
      // Reset player position when canvas is resized
      if (!isPlaying) {
        playerRef.current.x = canvas.width / 2 - playerRef.current.width / 2;
        playerRef.current.y = canvas.height - playerRef.current.height - 20;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize player position
    playerRef.current.x = canvas.width / 2 - playerRef.current.width / 2;
    playerRef.current.y = canvas.height - playerRef.current.height - 20;
    
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('cryptoGameHighScore');
    if (savedHighScore) {
      setGameState(prev => ({...prev, highScore: parseInt(savedHighScore)}));
    }
    
    // Set up keyboard event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resizeCanvas);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying]);
  
  // Game loop
  const startGame = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    // Reset game state
    setGameState({
      score: 0,
      level: 1,
      coins: 0,
      gameOver: false,
      highScore: gameState.highScore
    });
    
    coinsRef.current = [];
    obstaclesRef.current = [];
    lastCoinTimeRef.current = 0;
    lastObstacleTimeRef.current = 0;
    gameTimeRef.current = 0;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    playerRef.current.x = canvas.width / 2 - playerRef.current.width / 2;
    playerRef.current.y = canvas.height - playerRef.current.height - 20;
    
    setIsPlaying(true);
    gameLoop(0);
  };
  
  const gameLoop = (timestamp: number) => {
    if (!isPlaying) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Calculate delta time
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deltaTime = timestamp - gameTimeRef.current;
    gameTimeRef.current = timestamp;
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update player position based on keyboard input
    if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
      playerRef.current.x -= playerRef.current.speed;
    }
    if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
      playerRef.current.x += playerRef.current.speed;
    }
    
    // Update player position based on touch input
    if (touchPositionRef.current !== null) {
      const targetX = touchPositionRef.current.x - playerRef.current.width / 2;
      const dx = targetX - playerRef.current.x;
      
      // Move player towards touch position with smooth movement
      if (Math.abs(dx) > playerRef.current.speed) {
        playerRef.current.x += Math.sign(dx) * playerRef.current.speed;
      } else {
        playerRef.current.x = targetX;
      }
    }
    
    // Keep player within canvas bounds
    if (playerRef.current.x < 0) {
      playerRef.current.x = 0;
    }
    if (playerRef.current.x > canvas.width - playerRef.current.width) {
      playerRef.current.x = canvas.width - playerRef.current.width;
    }
    
    // Spawn coins
    if (timestamp - lastCoinTimeRef.current > 1000) {
      lastCoinTimeRef.current = timestamp;
      
      const coinValue = Math.random() < 0.2 ? 5 : 1; // 20% chance for a 5-value coin
      
      coinsRef.current.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        value: coinValue
      });
    }
    
    // Spawn obstacles
    if (timestamp - lastObstacleTimeRef.current > 2000) {
      lastObstacleTimeRef.current = timestamp;
      
      const obstacleWidth = 30 + Math.random() * 50;
      
      obstaclesRef.current.push({
        x: Math.random() * (canvas.width - obstacleWidth),
        y: -50,
        width: obstacleWidth,
        height: 20
      });
    }
    
    // Update and draw coins
    for (let i = coinsRef.current.length - 1; i >= 0; i--) {
      const coin = coinsRef.current[i];
      
      // Move coin down
      coin.y += 3 + gameState.level * 0.5;
      
      // Check if coin is collected
      if (
        playerRef.current.x < coin.x + 30 &&
        playerRef.current.x + playerRef.current.width > coin.x &&
        playerRef.current.y < coin.y + 30 &&
        playerRef.current.y + playerRef.current.height > coin.y
      ) {
        // Collect coin
        setGameState(prev => ({
          ...prev,
          score: prev.score + coin.value * 10,
          coins: prev.coins + coin.value
        }));
        
        coinsRef.current.splice(i, 1);
        continue;
      }
      
      // Remove coin if it goes off screen
      if (coin.y > canvas.height) {
        coinsRef.current.splice(i, 1);
        continue;
      }
      
      // Draw coin
      if (bitcoinImageRef.current) {
        // Add a gold circle behind high-value coins
        if (coin.value === 5) {
          context.beginPath();
          context.arc(coin.x + 15, coin.y + 15, 18, 0, Math.PI * 2);
          context.fillStyle = 'rgba(255, 215, 0, 0.3)';
          context.fill();
          context.closePath();
        }
        
        context.drawImage(
          bitcoinImageRef.current,
          coin.x,
          coin.y,
          30,
          30
        );
      } else {
        // Fallback if image isn't loaded
        context.beginPath();
        context.arc(coin.x + 15, coin.y + 15, 15, 0, Math.PI * 2);
        context.fillStyle = coin.value === 5 ? '#FFD700' : '#FFA500';
        context.fill();
        context.closePath();
        
        // Draw coin symbol
        context.font = '16px Arial';
        context.fillStyle = '#000';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('₿', coin.x + 15, coin.y + 15);
      }
    }
    
    // Update and draw obstacles
    for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
      const obstacle = obstaclesRef.current[i];
      
      // Move obstacle down
      obstacle.y += 4 + gameState.level * 0.5;
      
      // Check for collision with player
      if (
        playerRef.current.x < obstacle.x + obstacle.width &&
        playerRef.current.x + playerRef.current.width > obstacle.x &&
        playerRef.current.y < obstacle.y + obstacle.height &&
        playerRef.current.y + playerRef.current.height > obstacle.y
      ) {
        // Game over
        setIsPlaying(false);
        setGameState(prev => {
          const newHighScore = prev.score > prev.highScore ? prev.score : prev.highScore;
          
          // Save high score to localStorage
          localStorage.setItem('cryptoGameHighScore', newHighScore.toString());
          
          return {
            ...prev,
            gameOver: true,
            highScore: newHighScore
          };
        });
        return;
      }
      
      // Remove obstacle if it goes off screen
      if (obstacle.y > canvas.height) {
        obstaclesRef.current.splice(i, 1);
        continue;
      }
      
      // Draw obstacle
      // Draw red background
      context.fillStyle = 'rgba(255, 65, 54, 0.3)';
      context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      
      if (obstacleImageRef.current) {
        // Draw obstacle image in the center of the rectangle
        const imgSize = Math.min(obstacle.width, obstacle.height);
        const imgX = obstacle.x + (obstacle.width - imgSize) / 2;
        const imgY = obstacle.y + (obstacle.height - imgSize) / 2;
        
        context.drawImage(
          obstacleImageRef.current,
          imgX,
          imgY,
          imgSize,
          imgSize
        );
      } else {
        // Fallback if image isn't loaded
        context.fillStyle = '#FF4136';
        context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
    }
    
    // Draw player
    if (playerImageRef.current) {
      context.drawImage(
        playerImageRef.current,
        playerRef.current.x,
        playerRef.current.y,
        playerRef.current.width,
        playerRef.current.height
      );
    } else {
      // Fallback if image isn't loaded
      context.fillStyle = '#0074D9';
      context.fillRect(
        playerRef.current.x,
        playerRef.current.y,
        playerRef.current.width,
        playerRef.current.height
      );
    }
    
    // Level up based on score
    const newLevel = Math.floor(gameState.score / 500) + 1;
    if (newLevel > gameState.level) {
      setGameState(prev => ({...prev, level: newLevel}));
    }
    
    // Continue game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };
  
  // Mobile controls
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPlaying) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    
    // Update touch position
    touchPositionRef.current = { x: touchX, y: 0 };
    
    // Prevent default to avoid scrolling
    e.preventDefault();
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isPlaying) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    
    // Set initial touch position
    touchPositionRef.current = { x: touchX, y: 0 };
    
    // Prevent default to avoid scrolling
    e.preventDefault();
  };
  
  const handleTouchEnd = () => {
    // Clear touch position
    touchPositionRef.current = null;
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Crypto Catcher</h2>
      
      <div className="mb-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Score: <span className="text-white">{gameState.score}</span></p>
          <p className="text-sm text-gray-400">Level: <span className="text-white">{gameState.level}</span></p>
          <p className="text-sm text-gray-400">Coins: <span className="text-white">{gameState.coins}</span></p>
        </div>
        <div>
          <p className="text-sm text-gray-400">High Score: <span className="text-white">{gameState.highScore}</span></p>
        </div>
      </div>
      
      <div className="relative border border-gray-700 rounded-lg overflow-hidden" style={{ height: '300px' }}>
        <canvas 
          ref={canvasRef} 
          className="w-full h-full bg-gray-900"
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        ></canvas>
        
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            {gameState.gameOver ? (
              <>
                <h3 className="text-2xl font-bold text-red-500 mb-2">Game Over!</h3>
                <p className="text-white mb-4">Final Score: {gameState.score}</p>
              </>
            ) : (
              <h3 className="text-2xl font-bold text-white mb-4">Crypto Catcher</h3>
            )}
            <button
              onClick={startGame}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {gameState.gameOver ? 'Play Again' : 'Start Game'}
            </button>
            
            <div className="mt-4 text-sm text-gray-400">
              {isMobile ? (
                <p>Tap and drag to move your wallet</p>
              ) : (
                <p>Use arrow keys or A/D to move your wallet</p>
              )}
              <p className="mt-1">Collect Bitcoin, avoid red obstacles!</p>
            </div>
          </div>
        )}
        
        {/* Mobile controls overlay */}
        {isPlaying && isMobile && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="flex space-x-8">
              <button
                className="w-16 h-16 rounded-full bg-gray-700 bg-opacity-50 flex items-center justify-center text-white text-2xl"
                onTouchStart={() => keysRef.current['ArrowLeft'] = true}
                onTouchEnd={() => keysRef.current['ArrowLeft'] = false}
              >
                ←
              </button>
              <button
                className="w-16 h-16 rounded-full bg-gray-700 bg-opacity-50 flex items-center justify-center text-white text-2xl"
                onTouchStart={() => keysRef.current['ArrowRight'] = true}
                onTouchEnd={() => keysRef.current['ArrowRight'] = false}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>Collect Bitcoin tokens to increase your score. Regular coins are worth 10 points, golden coins are worth 50 points!</p>
        <p className="mt-1">{`Avoid the red obstacles or it's game over. The game gets faster as your level increases.`}.</p>
      </div>
    </div>
  );
};
export default CryptoGame;