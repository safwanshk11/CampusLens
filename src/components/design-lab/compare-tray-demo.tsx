"use client";

import { AnimatePresence, LayoutGroup, LazyMotion, domMax, m } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { DURATION, EASE } from "@/config/design";

const COLLEGES = ["Northfield Institute", "Riverside College", "Lakeview University", "Eastgate Institute"] as const;
const DEMO_LIMIT = 3;

/**
 * Framer Motion's territory: React state driving presence and layout. Chips enter
 * and leave the tray while their neighbours slide into place. Doing this in GSAP
 * would mean measuring and FLIP-ing by hand.
 *
 * Layout animation needs the `domMax` feature bundle, loaded only here.
 */
export function CompareTrayDemo() {
  const [selected, setSelected] = useState<string[]>([COLLEGES[0]]);

  const toggle = (name: string) => {
    setSelected((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : current.length < DEMO_LIMIT
          ? [...current, name]
          : current,
    );
  };

  const transition = { duration: DURATION.base, ease: EASE.entrance };

  return (
    <LazyMotion features={domMax}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          {COLLEGES.map((name) => {
            const isSelected = selected.includes(name);
            return (
              <Chip
                key={name}
                selected={isSelected}
                disabled={!isSelected && selected.length >= DEMO_LIMIT}
                onClick={() => toggle(name)}
              >
                {name}
              </Chip>
            );
          })}
        </div>

        <div className="glass glass-elevated flex min-h-18 flex-wrap items-center gap-2 rounded-island p-2.5">
          <span className="eyebrow px-3" aria-live="polite">
            Compare · {selected.length}/{DEMO_LIMIT}
          </span>
          <LayoutGroup>
            <AnimatePresence mode="popLayout" initial={false}>
              {selected.map((name) => (
                <m.span
                  key={name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={transition}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full bg-surface pl-3.5 pr-1 text-label font-medium text-ink shadow-control"
                >
                  {name}
                  <button
                    type="button"
                    aria-label={`Remove ${name} from compare`}
                    onClick={() => toggle(name)}
                    className="grid size-8 place-items-center rounded-full text-ink-tertiary transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    <X aria-hidden className="size-3.5" strokeWidth={2} />
                  </button>
                </m.span>
              ))}
            </AnimatePresence>
            <m.div layout transition={transition} className="ml-auto">
              <Button size="sm" disabled={selected.length < 2}>
                Compare
              </Button>
            </m.div>
          </LayoutGroup>
        </div>
      </div>
    </LazyMotion>
  );
}
