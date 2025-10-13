import { useEffect } from "react";
import { motion } from "framer-motion";

const ConfettiEffect = ({ show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  const colors = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    x: Math.random() * 100 - 50,
    rotation: Math.random() * 360
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ scale: 0, x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0.8],
            x: particle.x,
            y: -100,
            rotate: particle.rotation,
            opacity: [1, 1, 0]
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute w-3 h-3 rounded-full"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;