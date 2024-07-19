import React, { useEffect, useRef, useState } from 'react';


const App = () => {
  const containerRef = useRef(null);
  const blockRef = useRef(null);
  const ballRef = useRef(null);
  const [gameRunning, setGameRunning] = useState(true);
  const [ballState, setBallState] = useState({
    top: 0,
    left: 0,
    speed: 1,
    direction: 1,
    directionX: 1,
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const block = blockRef.current;
      const parentRect = containerRef.current.getBoundingClientRect();
      const blockWidth = block.offsetWidth;
      let newX = event.clientX - parentRect.left;
      if (newX < 0) {
        newX = 0;
      } else if (newX + blockWidth > parentRect.width) {
        newX = parentRect.width - blockWidth;
      }
      block.style.left = newX + 'px';
    };

    const handleKeyDown = (event) => {
      const block = blockRef.current;
      const parentRect = containerRef.current.getBoundingClientRect();
      const blockWidth = block.offsetWidth;
      const currentLeft = parseInt(window.getComputedStyle(block).left, 10);
      if (event.code === 'ArrowLeft') {
        let newLeft = currentLeft - 10;
        if (newLeft < 0) {
          newLeft = 0;
        }
        block.style.left = newLeft + 'px';
      } else if (event.code === 'ArrowRight') {
        let newLeft = currentLeft + 10;
        if (newLeft + blockWidth > parentRect.width) {
          newLeft = parentRect.width - blockWidth;
        }
        block.style.left = newLeft + 'px';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let animationFrameId;

    const moveBall = () => {
      if (!gameRunning) return;

      const ball = ballRef.current;
      const container = containerRef.current;
      const block = blockRef.current;
      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;
      const ballHeight = ball.offsetHeight;
      const ballWidth = ball.offsetWidth;
      const blockWidth = block.offsetWidth;

      let { top, left, speed, direction, directionX } = ballState;
      top += speed * direction;
      left += speed * directionX;

      if (top + ballHeight > containerHeight || top < 0) {
        direction *= -1;
      }

      if (left + ballWidth > containerWidth || left < 0) {
        directionX *= -1;
      }

      if (
        top + ballHeight >= containerHeight - block.offsetHeight &&
        left + ballWidth >= parseInt(block.style.left) &&
        left <= parseInt(block.style.left) + blockWidth
      ) {
        speed += 0.5;
        direction *= -1;
      }

      if (top + ballHeight >= containerHeight) {
        setGameRunning(false);
        alert('Game Over! You missed the block.');
        restartGame();
        return;
      }

      setBallState({ top, left, speed, direction, directionX });
      ball.style.top = top + 'px';
      ball.style.left = left + 'px';

      animationFrameId = requestAnimationFrame(moveBall);
    };

    if (gameRunning) {
      animationFrameId = requestAnimationFrame(moveBall);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameRunning, ballState]);

  const restartGame = () => {
    setBallState({
      top: 0,
      left: 0,
      speed: 1,
      direction: 1,
      directionX: 1,
    });
    setGameRunning(true);
  };

  return (
    <div ref={containerRef} className="w-[100%] h-screen bg-black relative overflow-hidden">
      <div ref={ballRef} className="w-10 h-10 bg-white rounded-full absolute" style={{ top: '0px', left: '0px' }}></div>
      <div ref={blockRef} className="w-[20vw] h-4 bg-white absolute bottom-0" style={{ left: '0px' }}></div>
    </div>
  );
};

export default App;
