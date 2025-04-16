import { motion } from "framer-motion";

interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function CyberCard({
  children,
  className = "",
}: CyberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`cyber-card ${className}`}
    >
      {children}
    </motion.div>
  );
}
