"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedDatabasePatternProps {
  size?: number;
  className?: string;
  color?: string;
  duration?: number;
}

export function AnimatedDatabasePattern({
  size = 500,
  className,
  color = "#4f46e5", // base color for the database
  duration = 4,
}: AnimatedDatabasePatternProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const numLayers = 5;
  const layerHeight = size / 6;
  const layerWidth = size;

  return (
    <svg
  ref={containerRef}
  aria-hidden="true"
  className={cn("pointer-events-none absolute left-100 top-0 h-full ml-50", className)}
  style={{ width: size }}  // tamaño fijo o relativo que quieras
>
  {/* Discos apilados */}
  {[...Array(numLayers)].map((_, i) => {
    const y = centerY + i * (layerHeight / 2) - ((numLayers * layerHeight) / 2);
    return (
      <ellipse
        key={i}
        cx={centerX}
        cy={y}
        rx={layerWidth / 2}
        ry={layerHeight / 2}
        fill={color}
        opacity={0.6 - i * 0.1}
      />
    );
  })}
</svg>
  );
}
