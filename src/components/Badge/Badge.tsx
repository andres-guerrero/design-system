import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Badge.module.css';

/** Figma: Badge → property "Tone" */
export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  /** Figma "Tone". Defaults to neutral, like the Figma component. */
  tone?: BadgeTone;
  /** Figma "Text" property. */
  children: ReactNode;
};

/** Status label. Figma: Library → Components → Badge */
export function Badge({ tone = 'neutral', className, children, ...rest }: BadgeProps) {
  const classes = [styles.badge, styles[tone], className].filter(Boolean).join(' ');
  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
