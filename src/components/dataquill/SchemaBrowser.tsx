
"use client";

import * as React from 'react';
import { useState, type ReactNode } from 'react';
import { Database, Table2, ListTree, ChevronRight, ChevronDown, KeyRound, Link2, Folder, FileKey2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface SchemaItemData {
  id: string;
  name: string;
  type: 'database' | 'table' | 'column' | 'folder' | 'index';
  children?: SchemaItemData[];
  dataType?: string; // For columns
  isPK?: boolean;    // For columns that are PK, or for PK indexes
  isFK?: boolean;    // For columns that are FK
  indexType?: 'PRIMARY' | 'UNIQUE' | 'INDEX' | string; // For indexes
}

interface SchemaItemProps {
  item: SchemaItemData;
  level: number;
  expandedItems: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
}

const ItemIcon = ({ type, isPK, isFK, indexType }: { type: SchemaItemData['type'], isPK?: boolean, isFK?: boolean, indexType?: SchemaItemData['indexType'] }) => {
  if (type === 'column') {
    if (isPK) return <KeyRound className="h-4 w-4 text-yellow-400 mr-2" />;
    if (isFK) return <Link2 className="h-4 w-4 text-blue-400 mr-2" />;
  }
  
  switch (type) {
    case 'database':
      return <Database className="h-4 w-4 text-accent mr-2" />;
    case 'table':
      return <Table2 className="h-4 w-4 text-green-400 mr-2" />;
    case 'column': 
      return <ListTree className="h-4 w-4 text-purple-400 mr-2" />;
    case 'folder':
      return <Folder className="h-4 w-4 text-sky-400 mr-2" />;
    case 'index':
      if (indexType === 'PRIMARY') return <KeyRound className="h-4 w-4 text-yellow-400 mr-2" />;
      return <FileKey2 className="h-4 w-4 text-orange-400 mr-2" />;
    default:
      return null;
  }
};

const SchemaTreeItem: React.FC<SchemaItemProps> = ({ item, level, expandedItems, onToggleExpand }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems[item.id] || false;

  // Padding for the content (chevron/spacer, icon, text) within its own row.
  // Kept minimal for leaf nodes.
  const itemContentPaddingLeft = !hasChildren ? "0.1rem" : "0.2rem"; 

  // Margin for the container of child items, creating the hierarchical indent.
  // 'level' here is the level of the current item. Its children will be level + 1.
  // The margin is applied to the container of those children.
  // Factor 0.4, base 0.2.
  const childrenContainerMarginLeft = `${level * 0 + 1.1}rem`;

  return (
    <div>
      <div
        className={cn(
          "flex items-center rounded-md hover:bg-muted cursor-pointer px-1 py-1.5" // Base horizontal padding (px-1), vertical padding (py-1.5)
        )}
        style={{ paddingLeft: itemContentPaddingLeft }} // Overrides left padding from px-1 for finer control
        onClick={() => hasChildren && onToggleExpand(item.id)}
      >
        {hasChildren ? (
          isExpanded ? <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
        ) : (
          <span className="w-4 mr-1" /> // Spacer to align with chevrons for leaf nodes
        )}
        <ItemIcon type={item.type} isPK={item.isPK} isFK={item.isFK} indexType={item.indexType} />
        <span className="text-sm text-foreground truncate">{item.name}</span>
        {item.type === 'column' && item.dataType && (
          <span className="ml-2 text-xs text-muted-foreground truncate">({item.dataType})</span>
        )}
         {item.type === 'index' && item.indexType && (
          <span className="ml-2 text-xs text-muted-foreground truncate">({item.indexType})</span>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div className="border-l border-border/50" style={{ marginLeft: childrenContainerMarginLeft }}>
          {item.children?.map((child) => (
            <SchemaTreeItem
              key={child.id}
              item={child}
              level={level + 1}
              expandedItems={expandedItems}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export type SchemaData = SchemaItemData[];

interface SchemaBrowserProps {
  schema: SchemaData;
}

export function SchemaBrowser({ schema }: SchemaBrowserProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const handleToggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  
  React.useEffect(() => {
    const initialExpansion: Record<string, boolean> = {};
    const expandRecursively = (items: SchemaItemData[], currentLevel: number) => {
      items.forEach(item => {
        if (item.type === 'database' || item.type === 'table' || item.type === 'folder') {
          initialExpansion[item.id] = true;
          if (item.children && currentLevel < 2) { 
            expandRecursively(item.children, currentLevel + 1);
          }
        }
      });
    };
    if (schema && schema.length > 0) {
      expandRecursively(schema, 0);
      setExpandedItems(initialExpansion);
    }
  }, [schema]);


  if (!schema || schema.length === 0) {
    return <div className="p-4 text-muted-foreground text-sm">No schema data available.</div>;
  }

  return (
    <ScrollArea className="h-full">
      {schema.map((item) => (
        <SchemaTreeItem
          key={item.id}
          item={item}
          level={0}
          expandedItems={expandedItems}
          onToggleExpand={handleToggleExpand}
        />
      ))}
    </ScrollArea>
  );
}
