import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="w-full space-y-4 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="bg-white rounded-xl p-4 shadow-card"
        >
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-slate-200 rounded"></div>
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-slate-100 rounded-full w-16"></div>
                <div className="h-6 bg-slate-100 rounded-full w-20"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;