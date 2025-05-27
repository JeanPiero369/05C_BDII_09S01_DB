
"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import Editor, { Monaco, OnChange, loader } from "@monaco-editor/react";

import { PlayCircle, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Ensure Monaco assets are loaded correctly
// loader.config({ paths: { vs: '/monaco-editor/vs' } });
loader.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs' } });


interface SqlEditorProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function SqlEditor({ 
  query, 
  onQueryChange, 
}: SqlEditorProps) {
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<any>(null); // Monaco editor instance
  const [isMonacoReady, setIsMonacoReady] = useState(false);
  const [monacoError, setMonacoError] = useState<string | null>(null);

  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      onQueryChange(value);
    }
  };
  
  useEffect(() => {
    // Este efecto es solo para verificar si Monaco se carga.
    // El loader.config ya se encarga de intentar cargar los archivos.
    const timer = setTimeout(() => {
      if (!monacoRef.current && !editorRef.current) {
        // Si después de un tiempo prudencial Monaco no se ha montado, asumimos un problema.
        // @monaco-editor/react podría no exponer un error directo de carga de 'vs',
        // así que este es un indicador indirecto.
        setMonacoError("No se pudo cargar el editor. Asegúrate de que los archivos de Monaco (la carpeta 'vs') estén en 'public/monaco-editor/vs'.");
        setIsMonacoReady(false); // Aunque podría estar "cargando" indefinidamente.
      }
    }, 5000); // Espera 5 segundos

    return () => clearTimeout(timer);
  }, []);

  const handleGetSelectedText = () => {
    const selection = editorRef.current?.getSelection();
    const model = editorRef.current?.getModel();
    const selectedText = model?.getValueInRange(selection);
    return selectedText;
  };

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsMonacoReady(true);
    setMonacoError(null); // Limpiar cualquier error previo si se monta correctamente

    // Basic auto-indentation and formatting (can be enhanced)
    editor.getModel()?.updateOptions({ tabSize: 2, insertSpaces: true });

    // Forzar el foco al editor una vez montado
    editor.focus();
  }

  function handleEditorWillUnmount() {
    // Limpieza si es necesario
    editorRef.current = null;
    monacoRef.current = null;
    setIsMonacoReady(false);
  }

  if (monacoError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive p-4">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="font-semibold mb-2 text-center">Error al cargar el Editor SQL</p>
        <p className="text-sm text-center">{monacoError}</p>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Si el problema persiste, revisa la consola del navegador para más detalles.
        </p>
      </div>
    );
  }
  
  // Muestra "Cargando editor..." solo mientras no esté listo y no haya error.
  // El componente Editor internamente muestra "Loading..." si aún no ha montado.
  // Este estado es para controlar nuestro UI antes de que el editor se monte.
  // Una vez que onMount se llama, isMonacoReady será true.
  // Si el editor en sí mismo se queda en "loading...", es porque no puede encontrar sus archivos.
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow relative">
        {/*
          IMPORTANTE: Para que Monaco Editor funcione, sus archivos deben estar disponibles.
          Asegúrate de que el directorio 'vs' de 'node_modules/monaco-editor/min/vs' se haya copiado a 'public/monaco-editor/vs'.
          Si esto no se hace, el editor no se inicializará correctamente y podría no ser interactivo, mostrando "Loading...".
        */}
        <Editor
          height="100%" // Asegura que el editor tome la altura disponible
          language="sql"
          theme="vs-dark" // Monaco's built-in dark theme
          value={query}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          onUnmount={handleEditorWillUnmount} // Buena práctica para limpiar
          loading={ // Mientras isMonacoReady es falso y no hay error, mostramos nuestro propio mensaje de carga
            !isMonacoReady && !monacoError ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Inicializando editor de SQL...
              </div>
            ) : ( // Si isMonacoReady es true, o hay error, el Editor maneja su propio 'loading' o no lo muestra.
                 // Dejamos que el Editor muestre su "Loading..." si es un problema de carga de assets.
              undefined 
            )
          }
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true, // Esencial para que se redimensione bien
            scrollBeyondLastLine: false,
            tabSize: 2,
            insertSpaces: true,
            lineNumbers: 'on', 
            readOnly: false, // Asegurar que no sea solo lectura
            // suggestOnTriggerCharacters: true, // Habilita sugerencias al escribir ciertos caracteres
            // quickSuggestions: true, // Habilita sugerencias rápidas
            // snippetSuggestions: 'inline', // Muestra snippets en línea
            // acceptSuggestionOnEnter: 'on', // Acepta sugerencias con Enter
          }}
        />
      </div>
    </div>
  );
}
