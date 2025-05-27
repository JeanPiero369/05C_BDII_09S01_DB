"use client";

import { ReactNode, useState, useRef, useEffect ,useCallback} from "react";

import { Card } from "@/components/ui/card";
import { PlayCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

type DataQuillLayoutProps = {
  schemaBrowser: ReactNode;
  sqlEditor: ReactNode;
  resultsTable: ReactNode;
  headerActions?: ReactNode;
  handleRefreshSchema:  () => void;
  onRunQuery:  () => void;
};

export function DataQuillLayout({
  handleRefreshSchema,
  onRunQuery,
  schemaBrowser,
  sqlEditor,
  resultsTable,
}: DataQuillLayoutProps) {
  // Ancho del panel izquierdo (schemaBrowser)
  const [leftWidth, setLeftWidth] = useState(320);
  // Altura del panel sqlEditor (arriba en el lado derecho)
  const [topHeight, setTopHeight] = useState(300);

  // Referencia para detectar mouse events en documento
  const containerRef = useRef<HTMLDivElement>(null);

  // Resizing left panel width
  const isResizingLeft = useRef(false);

  // Resizing top panel height
  const isResizingTop = useRef(false);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isResizingLeft.current && containerRef.current) {
        // Calculamos nuevo width relativo al contenedor
        const bounds = containerRef.current.getBoundingClientRect();
        let newWidth = e.clientX - bounds.left;
        if (newWidth < 250) newWidth = 250;
        if (newWidth > 400) newWidth = 400;
        setLeftWidth(newWidth);
      }
      if (isResizingTop.current && containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        let newHeight = e.clientY - bounds.top;
        if (newHeight < 150) newHeight = 150;
        if (newHeight > bounds.height - 150) newHeight = bounds.height - 150;
        setTopHeight(newHeight);
      }
    }
    function handleMouseUp() {
      isResizingLeft.current = false;
      isResizingTop.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);



  return (
    <div
      className="flex flex-col h-screen bg-background text-foreground font-sans"
      ref={containerRef}
    >
      <header className="flex items-center justify-between h-14 px-6 border-b border-border shadow-md">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h12" />
            <path d="M18 15l3 3-3 3" />
          </svg>
          <h1 className="text-xl font-semibold text-foreground">DataQuill</h1>
        </div>
        
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Panel Izquierdo */}
        <div
          style={{ width: leftWidth }}
          className="m-2 rounded-lg border-border shadow-lg flex flex-col overflow-hidden"
        >
          <div className="p-2 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Schema Explorer
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshSchema}
              title="Refresh Schema"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">{schemaBrowser}</div>
        </div>

        {/* Divider vertical draggable */}
        <div
          onMouseDown={() => {
            isResizingLeft.current = true;
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
          }}
          className="w-1 cursor-col-resize bg-border"
          style={{ margin: "8px 0" }}
        />

        {/* Panel derecho (flex columna) */}
        <div className="flex-1 flex flex-col overflow-hidden m-2 ml-0 space-y-2">
          {/* Panel superior (Editor SQL) */}
          <div
            style={{ height: topHeight }}
            className="rounded-lg border-border shadow-lg flex flex-col overflow-hidden"
          >
          <div className="p-2 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              SQL Editor
            </h2>
            <Button
              onClick={onRunQuery}
              variant="outline"
              size="sm"
              className="text-white border-muted hover:bg-accent hover:text-black"
            >
              <PlayCircle className="mr-2 h-4 w-4 text-green-500" />
              Run Query
            </Button>
          </div>
            <div className="flex-1 p-2 overflow-hidden relative">{sqlEditor}</div>
          </div>

          {/* Divider horizontal draggable */}
          <div
            onMouseDown={() => {
              isResizingTop.current = true;
              document.body.style.cursor = "row-resize";
              document.body.style.userSelect = "none";
            }}
            className="h-1 cursor-row-resize bg-border"
            style={{ margin: "0 8px" }}
          />

          {/* Panel inferior (Results) */}
          <div className="flex-1 rounded-lg border-border shadow-lg flex flex-col overflow-hidden">
            <div className="flex-1 p-2 overflow-auto">{resultsTable}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
