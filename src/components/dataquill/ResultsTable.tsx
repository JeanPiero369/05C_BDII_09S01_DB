"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Column {
  key: string;
  name: string;
}

interface Row {
  [key: string]: any;
}

interface ResultsTableProps {
  columns: Column[];
  rows: Row[];
  error?: string | null;
  isLoading: boolean;
  executionTime?: number; // in milliseconds
  rowCount?: number;
  queryPlan?: string; // Aquí pondremos el plan de consulta
}

export function ResultsTable({
  columns,
  rows,
  error,
  isLoading,
  executionTime,
  rowCount,
  queryPlan,
}: ResultsTableProps) {
  const [activeTab, setActiveTab] = useState<"result" | "queryPlan">("result");

  // Contenido para cuando está cargando
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-accent"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Executing query...
      </div>
    );
  }

  if (error) {
    return (
      <Card className="h-full border-destructive bg-destructive/10">
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive font-semibold mb-2">Query Error</p>
          <ScrollArea className="w-full max-h-40">
            <pre className="text-xs text-destructive whitespace-pre-wrap p-2 bg-destructive/10 rounded-md font-mono">
              {error}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  if (rows.length === 0 && columns.length === 0 && !error && executionTime !== undefined) {
    return (
      <Card className="h-full border-green-500 bg-green-500/10">
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <p className="text-green-500 font-semibold">Query executed successfully.</p>
          {executionTime !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              Execution time: {executionTime.toFixed(2)} ms.
              {rowCount !== undefined && ` ${rowCount} row(s) affected.`}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
  /*
  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No results to display. Run a query to see data.
      </div>
    );
  }*/

  return (
    <div className="relative h-full flex flex-col">
      {/* Barra de pestañas */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("result")}
          className={`px-4 py-2 -mb-px font-semibold ${
            activeTab === "result"
              ? "border-b-2 border-accent text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Result
        </button>
        <button
          onClick={() => setActiveTab("queryPlan")}
          className={`px-4 py-2 -mb-px font-semibold ${
            activeTab === "queryPlan"
              ? "border-b-2 border-accent text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Query Plan
        </button>
      </div>

      {/* Contenido pestañas */}
      <div className="flex-1 overflow-y-auto"> {/* Cambiado a overflow-y-auto para permitir x */}
          {activeTab === "result" && (
            <ScrollArea className="h-full font-mono text-sm">
              {/* Wrapper para el desplazamiento horizontal */}
              <div className="overflow-x-auto pb-4">
                <Table className="min-w-max">
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      {columns.map((col) => (
                        <TableHead
                          key={col.key}
                          className="whitespace-nowrap text-foreground/80"
                        >
                          {col.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {columns.map((col) => (
                          <TableCell
                            key={`${rowIndex}-${col.key}`}
                            className="whitespace-nowrap"
                          >
                            {String(row[col.key])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          )}


        {activeTab === "queryPlan" && (
          <ScrollArea className="h-full p-4 font-mono text-sm whitespace-pre-wrap bg-card text-foreground">
            {queryPlan ? (
              <pre>{queryPlan}</pre>
            ) : (
              <p className="text-muted-foreground">
                Query plan information not available.
              </p>
            )}
          </ScrollArea>
        )}
      </div>

      {/* Barra de estado inferior */}
      <div className="border-t border-border bg-card flex justify-between items-center px-4 py-2 text-xs text-muted-foreground select-none">
        <div>
          {rowCount} record{rowCount !== 1 ? "s" : ""} found
        </div>
        <div>
          {executionTime !== undefined
            ? `Execution time: ${executionTime.toFixed(2)} ms`
            : ""}
        </div>
      </div>
    </div>
  );
}
