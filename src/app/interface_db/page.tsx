"use client";

import { useState, useEffect, useCallback } from 'react';
import { DataQuillLayout } from '@/components/dataquill/DataQuillLayout';
import { SchemaBrowser, type SchemaData } from '@/components/dataquill/SchemaBrowser';
import { SqlEditor } from '@/components/dataquill/SqlEditor';
import { ResultsTable } from '@/components/dataquill/ResultsTable';
import { useToast } from "@/hooks/use-toast";

interface QueryResult {
  columns: { key: string; name: string }[];
  rows: { [key: string]: any }[];
}

export default function DataQuillPage() {
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM Customers WHERE Country = \'Germany\';');
  const [schema, setSchema] = useState<SchemaData>();
  const [results, setResults] = useState<QueryResult>({ columns: [], rows: [] });
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isLoadingQuery, setIsLoadingQuery] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  const [rowCount, setRowCount] = useState<number | undefined>(undefined);

  const { toast } = useToast();

    useEffect(() => {
    const fetchInitialSchema = async () => {

      try {
        const response = await fetch('http://localhost:8000/estructura');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: SchemaData = await response.json();
        
        setSchema(data); // Establece el esquema cargado

        toast({
          title: "Schema Loaded",
          description: "Schema has been loaded.",
          variant: "default",
        });
        
      } catch (error: any) {
        console.error("Error al cargar el esquema inicial:", error);
        toast({
          title: "Schema Loaded Failed",
          description: "Schema not has been loaded.",
          variant: "destructive",
        });

      } finally {
      }
    };

    fetchInitialSchema();
  }, []); // El array vacío [] asegura que este efecto se ejecute SOLAMENTE una vez al montar el componente.


  const handleRunQuery = useCallback(async () => {
    setIsLoadingQuery(true);
    setQueryError(null);
    setResults({ columns: [], rows: [] });
    setExecutionTime(undefined);
    setRowCount(undefined);

    try {
      const startTime = performance.now();

      const lowerQuery = sqlQuery.trim().toLowerCase();

      const response = await fetch('http://localhost:8000/consultar/20', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          consulta: lowerQuery
                        })
                      });
      const endTime = performance.now();
      const timeTaken = endTime - startTime;
      setExecutionTime(timeTaken);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const newResults: QueryResult  = {
        columns: data.columns,
        rows: data.rows,
      };

      setResults(newResults);
      setRowCount(data.count_rows);
    }catch (error: any) {
      setQueryError('SQL Error: Syntax error. Please check your query.');
    }finally {
      setIsLoadingQuery(false);
    }

  }, [sqlQuery, toast]);

  const handleRefreshSchema = useCallback(async () => {
    toast({
      title: "Schema Refresh",
      description: "Refreshing Schema wait...",
    });

    const response = await fetch('http://localhost:8000/estructura');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: SchemaData = await response.json();
    setSchema(data); // Establece el esquema cargado

    toast({
      title: "Schema Refreshed",
      description: "Schema has been updated.",
      variant: "default",
    });
  }, [toast]);

  return (
    <DataQuillLayout
      schemaBrowser={<SchemaBrowser schema={schema} />}
      handleRefreshSchema={handleRefreshSchema}
      onRunQuery={handleRunQuery}
      sqlEditor={
        <SqlEditor
          query={sqlQuery}
          onQueryChange={setSqlQuery}
          
        />
      }
      resultsTable={
        <ResultsTable
          columns={results.columns}
          rows={results.rows}
          error={queryError}
          isLoading={isLoadingQuery}
          executionTime={executionTime}
          rowCount={rowCount}
        />
      }
    />
  );
}
