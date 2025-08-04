import { AnimatePresence, motion } from "motion/react";
import type { ITextArea } from "../Interfaces";

export const TextArea = ({
  value,
  isValid,
  handleChange,
  loading,
  onSubmit,
}: ITextArea) => {
  return (
    <div className="relative flex flex-col flex-1 justify-center overflow-clip w-full space-between">
      <div className="border border-neutral-700 rounded-lg p-6 bg-neutral-800 w-full">
        <div className="relative flex w-full rounded-lg max-h-48 self-end flex-1 bg-gradient-to-br from-blue-400 via-purple-400 to-neutral-500 p-[1px]">
          <textarea
            value={value}
            onChange={handleChange}
            className="min-h-40 w-full flex-1 bg-neutral-600 rounded-lg p-2 placeholder:p-0 placeholder:text-neutral-400 focus:outline-none h-full resize-none"
            placeholder="Type here..."
          />
          <AnimatePresence>
            {isValid && !loading && (
              <motion.span
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={onSubmit}
                className="absolute right-2 w-12 cursor-pointer self-center rounded-lg bg-blue-500 p-2 text-center text-lg font-bold text-white"
              >
                &rarr;
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
