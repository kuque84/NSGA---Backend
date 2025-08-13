SELECT 
    c.nombre AS curso,
    d.nombre AS division,
    COUNT(*) AS cantidad_alumnos
FROM inscripciones_cursos ic
JOIN alumnos a ON ic.id_alumno = a.id_alumno
JOIN cursos c ON ic.id_curso = c.id_curso
JOIN divisiones d ON ic.id_division = d.id_division
LEFT JOIN (
    SELECT p.id_alumno, COUNT(*) AS cantidad_coloquios
    FROM previas p
    JOIN condiciones co ON p.id_condicion = co.id_condicion
    WHERE co.nombre = 'COLOQUIO'
    GROUP BY p.id_alumno
) pc ON ic.id_alumno = pc.id_alumno
WHERE ic.id_ciclo = 58
  AND (pc.cantidad_coloquios IS NULL OR pc.cantidad_coloquios <= 3)
GROUP BY c.nombre, d.nombre
ORDER BY c.nombre, d.nombre;
