SELECT
    C.TABLE_NAME AS 'Tabla',
    C.COLUMN_NAME AS 'Campo',
    C.DATA_TYPE AS 'Tipo de Dato',
    C.IS_NULLABLE AS 'Permite Nulos',
    -- Determina el tipo de clave (PK, FK, etc.)
    CASE
        WHEN C.COLUMN_KEY = 'PRI' THEN 'PRIMARY KEY (PK)'
        WHEN KCU.REFERENCED_TABLE_NAME IS NOT NULL THEN 'FOREIGN KEY (FK)'
        WHEN C.COLUMN_KEY = 'UNI' THEN 'UNIQUE'
        ELSE ''
    END AS 'Tipo de Clave',
    
    -- Información de la Relación (solo si es una FK)
    KCU.REFERENCED_TABLE_NAME AS 'Referencia Tabla',
    KCU.REFERENCED_COLUMN_NAME AS 'Referencia Columna'
FROM
    information_schema.COLUMNS AS C
LEFT JOIN
    -- Unimos con KEY_COLUMN_USAGE para obtener info de FKs y PKs
    information_schema.KEY_COLUMN_USAGE AS KCU 
    ON C.TABLE_SCHEMA = KCU.TABLE_SCHEMA 
    AND C.TABLE_NAME = KCU.TABLE_NAME
    AND C.COLUMN_NAME = KCU.COLUMN_NAME
    AND KCU.CONSTRAINT_SCHEMA = 'nsgaDb'
WHERE
    C.TABLE_SCHEMA = 'nsgaDb' -- Reemplaza 'nsgaDb' con el nombre de tu base de datos
ORDER BY
    C.TABLE_NAME, C.ORDINAL_POSITION;