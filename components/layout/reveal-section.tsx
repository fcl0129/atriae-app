"use client";

import type { HTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type RevealSectionProps = HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "article" | "footer";
};

export function RevealSection({ as = "section", className, children, ...props }: RevealSectionProps) {
  const [visible, setVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const target = elementRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.14
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  const Tag = as;

  return (
    <Tag ref={elementRef as never} data-visible={visible} className={cn("reveal-section", className)} {...props}>
      {children}
    </Tag>
  );
}
