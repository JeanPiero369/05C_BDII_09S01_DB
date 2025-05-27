from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import psycopg2
import json
from fastapi.middleware.cors import CORSMiddleware
import uvicorn  # Importar uvicorn para correr el servidor

# Configuración
DB_CONFIG = {
    "host": "localhost",
    "database": "my_db",
    "user": "postgres",
    "password": "utec",
    "port": "8005"
}

# FastAPI App
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite cualquier origen
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP (GET, POST, etc)
    allow_headers=["*"],  # Permite todas las cabeceras
)
# Modelo de entrada
class ConsultaSQL(BaseModel):
    consulta: str

# Conexión a la base de datos
def get_connection():
    return psycopg2.connect(**DB_CONFIG)
# Ejecutar cualquier consulta (SELECT o no SELECT)
def ejecutar_consulta_sql(query: str, limit: int):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(query)

        # Si la consulta retorna datos (ej. SELECT)
        if cur.description is not None:
            columns = [desc[0] for desc in cur.description]
            rows = cur.fetchall()
            df = pd.DataFrame(rows, columns=columns)
            
            df_limited_rows = df.head(limit) # Obtiene las primeras 10 filas
            query_result = {
                'columns': [{'key': col, 'name': col} for col in df_limited_rows.columns],
                'rows': df_limited_rows.to_dict(orient='records'),
                'count_rows':len(df) 
            }
        else:
            conn.commit()
            query_result = {
                            'columns': [],
                            'rows': [],
                            "message": "Consulta ejecutada correctamente.",
                            'count_rows':0
                            }

        cur.close()
        conn.close()
        return query_result

    except Exception as e:
        raise Exception(f"Error en la consulta: {e}")

# Endpoint
@app.post("/consultar/{limit}")
def ejecutar_consulta(entrada: ConsultaSQL,limit:int ):
    try:
        return ejecutar_consulta_sql(entrada.consulta, limit)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@app.get("/estructura")
def obtener_estructura_bd():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        query = """
        SELECT
            jsonb_build_object(
                'id', 'db_' || current_database(),
                'name', current_database(),
                'type', 'database',
                'children', jsonb_agg(
                    jsonb_build_object(
                        'id', 'tbl_' || t.table_name,
                        'name', t.table_name,
                        'type', 'table',
                        'children', jsonb_build_array(
                            jsonb_build_object(
                                'id', 'fld_cols_' || t.table_name,
                                'name', 'Columns',
                                'type', 'folder',
                                'children', (
                                    SELECT
                                        jsonb_agg(
                                            jsonb_build_object(
                                                'id', 'col_' || t.table_name || '_' || c.column_name,
                                                'name', c.column_name,
                                                'type', 'column',
                                                'dataType', c.data_type,
                                                'isPK', CASE WHEN pk_cols.column_name IS NOT NULL THEN true ELSE false END
                                            ) ORDER BY c.ordinal_position
                                        )
                                    FROM
                                        information_schema.columns c
                                    LEFT JOIN (
                                        SELECT kcu.column_name
                                        FROM information_schema.table_constraints tc
                                        JOIN information_schema.key_column_usage kcu
                                            ON tc.constraint_name = kcu.constraint_name
                                            AND tc.table_schema = kcu.table_schema
                                            AND tc.table_name = kcu.table_name
                                        WHERE tc.constraint_type = 'PRIMARY KEY'
                                        AND tc.table_schema = t.table_schema
                                        AND tc.table_name = t.table_name
                                    ) AS pk_cols ON c.column_name = pk_cols.column_name
                                    WHERE
                                        c.table_schema = t.table_schema AND c.table_name = t.table_name
                                )
                            ),
                            jsonb_build_object(
                                'id', 'fld_idx_' || t.table_name,
                                'name', 'Indexes',
                                'type', 'folder',
                                'children', (
                                    SELECT
                                        jsonb_agg(
                                            jsonb_build_object(
                                                'id', 'idx_' || pg_index_info.indexname,
                                                'name', pg_index_info.indexname,
                                                'type', 'index',
                                                'indexType', CASE
                                                    WHEN (
                                                        SELECT TRUE FROM pg_constraint
                                                        WHERE conrelid = (SELECT oid FROM pg_class WHERE relname = t.table_name AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = t.table_schema))
                                                        AND conindid = (SELECT oid FROM pg_class WHERE relname = pg_index_info.indexname AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = t.table_schema))
                                                        AND contype = 'p'
                                                    ) IS NOT NULL THEN 'PRIMARY'
                                                    WHEN (
                                                        SELECT TRUE FROM pg_constraint
                                                        WHERE conrelid = (SELECT oid FROM pg_class WHERE relname = t.table_name AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = t.table_schema))
                                                        AND conindid = (SELECT oid FROM pg_class WHERE relname = pg_index_info.indexname AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = t.table_schema))
                                                        AND contype = 'u'
                                                    ) IS NOT NULL THEN 'UNIQUE'
                                                    ELSE pg_index_info.access_method_name
                                                END
                                                -- Remove this line to exclude index_columns from the final output:
                                                -- 'index_columns', pg_index_info.index_columns
                                            ) ORDER BY pg_index_info.indexname
                                        )
                                    FROM
                                        (
                                            SELECT
                                                pi.indexname,
                                                am.amname AS access_method_name,
                                                (
                                                    SELECT
                                                        jsonb_agg(a.attname ORDER BY array_position(idx.indkey, a.attnum))
                                                    FROM
                                                        pg_index idx
                                                    JOIN
                                                        pg_attribute a ON a.attrelid = idx.indrelid AND a.attnum = ANY(idx.indkey)
                                                    WHERE
                                                        idx.indexrelid = pc.oid
                                                        AND a.attnum > 0
                                                ) AS index_columns -- This subquery still creates index_columns, but it won't be used in the final build_object
                                            FROM
                                                pg_indexes pi
                                            JOIN
                                                pg_class pc ON pc.relname = pi.indexname AND pc.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = pi.schemaname)
                                            JOIN
                                                pg_am am ON am.oid = pc.relam
                                            WHERE
                                                pi.schemaname = t.table_schema
                                                AND pi.tablename = t.table_name
                                        ) AS pg_index_info
                                )
                            )
                        )
                    ) ORDER BY t.table_name
                )
            )
        FROM
            information_schema.tables t
        WHERE
            t.table_schema = 'public'
            AND t.table_type = 'BASE TABLE';
        """
        
        cursor.execute(query)
        resultado = cursor.fetchone()
        cursor.close()
        conn.close()

        if resultado:
            # Construir el diccionario Python con la estructura deseada
            output_json_data = resultado
            return output_json_data
        else:
            # Si no se encuentra ninguna tabla en el esquema 'public'
            return []

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener la estructura: {e}")
    

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
