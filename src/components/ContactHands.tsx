"use client";

import { useEffect, useRef } from "react";
import { createContactHands } from "@/lib/contact-hands";
import { createFooterRevealReader } from "@/lib/footer-reveal";

export function ContactHands() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handle = createContactHands(root, {
      reveal: createFooterRevealReader(),
      startThreshold: 0.7,
      desktopBoost: 1.05,
      mobileBoost: 1.9,
      budgetScale: 0.6,
    });

    return () => handle.destroy();
  }, []);

  return (
    <div className="contact-hands" ref={rootRef} data-hands aria-hidden="true">
      <div className="contact-hands__viewport" data-hands-viewport>
        <div className="contact-hands__stage" data-hands-stage>
          <div className="contact-hands__parallax" data-hands-parallax>
            <div className="contact-hands__hand contact-hands__hand--left" data-hands-left />
            <div className="contact-hands__hand contact-hands__hand--right" data-hands-right />
            <canvas className="contact-hands__canvas" data-hands-canvas />
            <div className="contact-hands__scan" data-hands-scan />
            <div className="contact-hands__spark" data-hands-spark />
          </div>
        </div>
      </div>
    </div>
  );
}
