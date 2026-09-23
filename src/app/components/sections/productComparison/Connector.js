import { motion } from "motion/react";
import { IoArrowDownOutline } from "react-icons/io5";
const easeOut = [0.22, 1, 0.36, 1];

const connectorMotion = (visible) => ({
    initial: { opacity: 0, scaleY: 0, y: -50, filter: "blur(10px)" },
    animate: visible ? { opacity: 1, scaleY: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, scaleY: 0, y: -50, filter: "blur(10px)" },
  transition: { duration: 0.54, ease: easeOut },
});

export default function Connector({ visible }) {
  return (
    <motion.div
      aria-hidden="true"
      {...connectorMotion(visible)}
      className="flex items-center justify-center py-0 sm:py-0.5 origin-top"
    >
          <IoArrowDownOutline className="text-accent/40 text-[0.65rem] sm:text-lg dark:text-accent/40" />
    </motion.div>
  );
}
