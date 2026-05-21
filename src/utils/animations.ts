import { Variants, TargetAndTransition } from 'framer-motion';

/**
 * Returns variants for a container that staggers its animated children.
 * Useful for grids (features, solutions) or hero text layouts.
 */
export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/**
 * Standard spring-based slide-up and fade-in animation for child elements.
 * Best used for list items, cards, or staggered sections.
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 80,
    },
  },
};

/**
 * A gentler spring slide-up and fade-in animation.
 * Ideal for headers, small badges, and buttons.
 */
export const fadeInUpGentle: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 18,
      stiffness: 100,
    },
  },
};

/**
 * Zoom-in and fade variant for floating widgets.
 */
export const zoomInEntrance = (delay = 0, stiffness = 80, damping = 18): Variants => ({
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness,
      damping,
      delay,
    },
  },
});

/**
 * Generates transition parameters for infinite, smooth floating loops.
 * @param yOffset The distance to float upwards (negative value)
 * @param duration Loop duration in seconds
 * @param delay Loop delay in seconds to desynchronize elements
 */
export const getFloatingTransition = (yOffset = -6, duration = 6, delay = 0): TargetAndTransition => ({
  y: [0, yOffset, 0],
  transition: {
    duration,
    repeat: Infinity,
    ease: 'easeInOut',
    delay,
  },
});

export const backdropFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

export const modalSpringScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { type: 'spring' as const, damping: 25, stiffness: 300 },
} as const;

export const contentSlideUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
} as const;

export const accordionExpand = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto' as const, opacity: 1 },
  exit: { height: 0, opacity: 0 },
} as const;

export const overlayFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

export const scoreReveal = (score: number) => ({
  initial: { strokeDasharray: '0, 100' as const },
  animate: { strokeDasharray: `${score * 0.942}, 100` },
  transition: { duration: 1.2 },
});

export const progressWidth = (percent: number) => ({
  animate: { width: `${percent}%` },
  transition: { duration: 0.5 },
});
