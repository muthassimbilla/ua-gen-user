"use client";

import { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  repeatInterval = 3000,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  repeatInterval?: number;
}) => {
  const [scope, animate] = useAnimate();
  const [isAnimating, setIsAnimating] = useState(false);
  let wordsArray = words.split(" ");
  
  const startAnimation = () => {
    setIsAnimating(true);
    
    // Reset all words to initial state
    animate(
      "span",
      {
        opacity: 0,
        filter: filter ? "blur(10px)" : "none",
      },
      {
        duration: 0.1,
      }
    );
    
    // Animate words one by one
    setTimeout(() => {
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration ? duration : 1,
          delay: stagger(0.2),
        }
      );
    }, 100);
  };
  
  useEffect(() => {
    // Start initial animation
    startAnimation();
    
    // Set up interval for repeating animation
    const interval = setInterval(() => {
      startAnimation();
    }, repeatInterval);
    
    return () => clearInterval(interval);
  }, [scope.current, repeatInterval]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="dark:text-white text-black opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
