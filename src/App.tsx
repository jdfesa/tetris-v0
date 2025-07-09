import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import { Music, RotateCcw, Play, Pause } from 'lucide-react'

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: 'cyan-500' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'blue-500' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'orange-500' },
  O: { shape: [[1, 1], [1, 1]], color: 'yellow-500' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'green-500' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple-500' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'red-500' },
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const INITIAL_DROP_TIME = 800
const SPEED_INCREASE_FACTOR = 0.95

const createEmptyBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))

const randomTetromino = () => {
  const keys = Object.keys(TETROMINOS)
  const randKey = keys[Math.floor(Math.random() * keys.length)]
  return TETROMINOS[randKey]
}

export default function Tetris() {
  const [board, setBoard] = useState(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [dropTime, setDropTime] = useState(INITIAL_DROP_TIME)
  const [level, setLevel] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [completedRows, setCompletedRows] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const dropInterval = useRef(null)

  const checkCollision = (x, y, shape) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const newX = x + col
          const newY = y + row
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX] !== 0)) {
            return true
          }
        }
      }
    }
    return false
  }

  const isValidMove = (x, y, shape) => !checkCollision(x, y, shape)

  const moveLeft = useCallback(() => {
    if (currentPiece && isValidMove(currentPiece.x - 1, currentPiece.y, currentPiece.tetromino.shape)) {
      setCurrentPiece(prev => ({ ...prev, x: prev.x - 1 }))
    }
  }, [currentPiece, board])

  const moveRight = useCallback(() => {
    if (currentPiece && isValidMove(currentPiece.x + 1, currentPiece.y, currentPiece.tetromino.shape)) {
      setCurrentPiece(prev => ({ ...prev, x: prev.x + 1 }))
    }
  }, [currentPiece, board])

  const moveDown = useCallback(() => {
    if (!currentPiece || isPaused) return
    if (isValidMove(currentPiece.x, currentPiece.y + 1, currentPiece.tetromino.shape)) {
      setCurrentPiece(prev => ({ ...prev, y: prev.y + 1 }))
    } else {
      placePiece()
    }
  }, [currentPiece, board, isPaused])

  const rotate = useCallback(() => {
    if (!currentPiece || isPaused) return
    const rotated = currentPiece.tetromino.shape[0].map((_, i) =>
      currentPiece.tetromino.shape.map(row => row[i]).reverse()
    )
    let newX = currentPiece.x
    let newY = currentPiece.y

    // Try to rotate, if not possible, try to adjust position
    if (!isValidMove(newX, newY, rotated)) {
      // Try to move left
      if (isValidMove(newX - 1, newY, rotated)) {
        newX -= 1
      }
      // Try to move right
      else if (isValidMove(newX + 1, newY, rotated)) {
        newX += 1
      }
      // Try to move up
      else if (isValidMove(newX, newY - 1, rotated)) {
        newY -= 1
      }
      // If still not possible, don't rotate
      else {
        return
      }
    }

    setCurrentPiece(prev => ({
      ...prev,
      x: newX,
      y: newY,
      tetromino: { ...prev.tetromino, shape: rotated }
    }))
  }, [currentPiece, board, isPaused])

  const placePiece = useCallback(() => {
    if (!currentPiece) return
    const newBoard = board.map(row => [...row])
    currentPiece.tetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardY = y + currentPiece.y
          const boardX = x + currentPiece.x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentPiece.tetromino.color
          }
        }
      })
    })
    setBoard(newBoard)
    clearLines(newBoard)
    spawnNewPiece()
  }, [currentPiece, board])

  const clearLines = useCallback((newBoard) => {
    let linesCleared = []
    const updatedBoard = newBoard.filter((row, index) => {
      if (row.every(cell => cell !== 0)) {
        linesCleared.push(index)
        return false
      }
      return true
    })
    
    if (linesCleared.length > 0) {
      setCompletedRows(linesCleared)
      setTimeout(() => {
        while (updatedBoard.length < BOARD_HEIGHT) {
          updatedBoard.unshift(Array(BOARD_WIDTH).fill(0))
        }
        setBoard(updatedBoard)
        setCompletedRows([])
        
        const newScore = score + linesCleared.length * 100
        setScore(newScore)
        
        if (Math.floor(newScore / 500) > level - 1) {
          setLevel(prev => prev + 1)
          setDropTime(prev => prev * SPEED_INCREASE_FACTOR)
        }
      }, 500)
    }
  }, [score, level])

  const spawnNewPiece = useCallback(() => {
    const newPiece = {
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
      tetromino: randomTetromino()
    }
    if (checkCollision(newPiece.x, newPiece.y, newPiece.tetromino.shape)) {
      setGameOver(true)
      setGameStarted(false)
    } else {
      setCurrentPiece(newPiece)
    }
  }, [board])

  useEffect(() => {
    if (!currentPiece && !gameOver && gameStarted) {
      spawnNewPiece()
    }
  }, [currentPiece, gameOver, gameStarted, spawnNewPiece])

  useEffect(() => {
    if (!gameOver && gameStarted && !isPaused) {
      dropInterval.current = setInterval(moveDown, dropTime)
    }
    return () => clearInterval(dropInterval.current)
  }, [moveDown, gameOver, gameStarted, isPaused, dropTime])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver || !gameStarted) return
      
      if (e.key === ' ') {
        e.preventDefault()
        setIsPaused(prev => !prev)
        return
      }
      
      if (isPaused) return
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          moveLeft()
          break
        case 'ArrowRight':
          e.preventDefault()
          moveRight()
          break
        case 'ArrowDown':
          e.preventDefault()
          moveDown()
          break
        case 'ArrowUp':
          e.preventDefault()
          rotate()
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [moveLeft, moveRight, moveDown, rotate, gameOver, gameStarted, isPaused])

  const startGame = () => {
    setGameStarted(true)
    setIsPaused(false)
    if (!currentPiece) {
      spawnNewPiece()
    }
  }

  const resetGame = () => {
    setBoard(createEmptyBoard())
    setCurrentPiece(null)
    setScore(0)
    setGameOver(false)
    setDropTime(INITIAL_DROP_TIME)
    setLevel(1)
    setCompletedRows([])
    setGameStarted(false)
    setIsPaused(false)
    clearInterval(dropInterval.current)
  }

  const togglePause = () => {
    if (!gameStarted || gameOver) return
    setIsPaused(prev => !prev)
  }

  const renderCell = (x, y) => {
    if (
      currentPiece &&
      currentPiece.tetromino.shape[y - currentPiece.y] &&
      currentPiece.tetromino.shape[y - currentPiece.y][x - currentPiece.x]
    ) {
      return currentPiece.tetromino.color
    }
    return board[y][x]
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-6xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          TETRIS
        </h1>
        <p className="text-white/80 text-lg">Un clásico juego de puzzle</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Game Board */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700"
        >
          <div 
            className="grid bg-gray-800 border-4 border-gray-600 rounded-lg overflow-hidden" 
            style={{ 
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
              width: `${BOARD_WIDTH * 24}px`,
              height: `${BOARD_HEIGHT * 24}px`,
            }}
          >
            {board.map((row, y) => 
              row.map((_, x) => (
                <motion.div 
                  key={`${y}-${x}`}
                  initial={false}
                  animate={{
                    opacity: completedRows.includes(y) ? 0 : 1,
                    scale: completedRows.includes(y) ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-6 h-6 border border-gray-700/50 ${
                    renderCell(x, y) ? `bg-${renderCell(x, y)} shadow-lg` : 'bg-gray-800'
                  }`}
                />
              ))
            )}
          </div>
          
          {/* Game Over Overlay */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/75 flex items-center justify-center rounded-xl"
              >
                <div className="text-center text-white">
                  <h2 className="text-4xl font-bold mb-4 text-red-400">¡Game Over!</h2>
                  <p className="text-xl mb-4">Puntuación final: {score}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Paused Overlay */}
          <AnimatePresence>
            {isPaused && gameStarted && !gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/75 flex items-center justify-center rounded-xl"
              >
                <div className="text-center text-white">
                  <Pause className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                  <h2 className="text-3xl font-bold mb-2">Pausado</h2>
                  <p className="text-lg">Presiona ESPACIO para continuar</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Game Info Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 min-w-[250px]"
        >
          <div className="space-y-6">
            {/* Score */}
            <div className="text-center">
              <h3 className="text-white text-lg font-semibold mb-2">Puntuación</h3>
              <div className="text-3xl font-bold text-cyan-400">{score.toLocaleString()}</div>
            </div>

            {/* Level */}
            <div className="text-center">
              <h3 className="text-white text-lg font-semibold mb-2">Nivel</h3>
              <div className="text-2xl font-bold text-purple-400">{level}</div>
            </div>

            {/* Controls */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-white text-lg font-semibold mb-3">Controles</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div>← → : Mover</div>
                <div>↓ : Caída rápida</div>
                <div>↑ : Rotar</div>
                <div>ESPACIO : Pausar</div>
              </div>
            </div>

            {/* Game Controls */}
            <div className="space-y-3">
              {!gameStarted && !gameOver && (
                <Button 
                  onClick={startGame}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Juego
                </Button>
              )}
              
              {gameStarted && !gameOver && (
                <Button 
                  onClick={togglePause}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                  {isPaused ? 'Continuar' : 'Pausar'}
                </Button>
              )}
              
              <Button 
                onClick={resetGame}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {gameOver ? 'Jugar de Nuevo' : 'Reiniciar'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Instructions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-white/80 max-w-2xl"
      >
        <p className="text-lg mb-2">
          Completa líneas horizontales para ganar puntos y subir de nivel
        </p>
        <p className="text-sm">
          El juego se acelera con cada nivel. ¡Intenta conseguir la puntuación más alta!
        </p>
      </motion.div>
    </div>
  )
}