import React from 'react';
import { motion } from 'framer-motion';

const DynamicBackground: React.FC = () => {
  // 生成一些漂浮的圆形和图标
  const items = Array.from({ length: 15 });

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-300">
      {/* 渐变背景 */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 bg-gradient-to-tr from-pink-200 via-white to-blue-200 dark:from-pink-900/20 dark:via-slate-950 dark:to-blue-900/20"></div>
      
      {/* 漂浮元素 */}
      {items.map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            opacity: 0.1 + Math.random() * 0.3,
            scale: 0.5 + Math.random() * 1
          }}
          animate={{
            y: [null, '-20%', '120%'],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
            delay: -Math.random() * 20
          }}
        >
          {i % 2 === 0 ? (
            <div className="w-12 h-12 bg-[#fb7299]/20 dark:bg-[#fb7299]/10 rounded-lg"></div>
          ) : (
            <svg width="40" height="40" viewBox="0 0 1024 1024" className="text-blue-400/20 dark:text-blue-400/10 fill-current">
              <path d="M777.1 123.3c19.4 0 35.1 15.7 35.1 35.1v108.6h85.3c35.1 0 63.5 28.5 63.5 63.5v447.4c0 35-28.4 63.5-63.5 63.5H126.5c-35.1 0-63.5-28.5-63.5-63.5V330.5c0-35 28.4-63.5 63.5-63.5h85.3V158.4c0-19.4 15.7-35.1 35.1-35.1s35.1 15.7 35.1 35.1v108.6h460V158.4c0-19.4 15.8-35.1 35.1-35.1z m85.3 268.4H161.6v404.9h700.8V391.7z m-538.5 73.1c31.1 0 56.4 25.3 56.4 56.4v30.5c0 31.1-25.3 56.4-56.4 56.4s-56.4-25.3-56.4-56.4v-30.5c0-31.1 25.3-56.4 56.4-56.4z m376.5 0c31.1 0 56.4 25.3 56.4 56.4v30.5c0 31.1-25.3 56.4-56.4 56.4s-56.4-25.3-56.4-56.4v-30.5c0-31.1 25.3-56.4 56.4-56.4z"></path>
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default DynamicBackground;
