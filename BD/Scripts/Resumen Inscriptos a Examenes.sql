SELECT 
    a.apellidos AS Apellido_Alumno,
    a.nombres AS Nombre_Alumno,
    a.dni AS DNI,
    m.nombre AS Nombre_Materia,
    f.fechaExamen AS Fecha_Examen,
    cond.nombre AS Condicion,
    cu.nombre AS Nombre_Curso,
    cal.calificacion AS Nota,
    cal.aprobado AS Aprobado,
    i.libro AS L,
    i.folio AS F
FROM 
    alumnos a
JOIN 
    previas p ON a.id_alumno = p.id_alumno
JOIN 
    inscripciones i ON p.id_previa = i.id_previa
JOIN 
    fechasexamen f ON i.id_fechaExamen = f.id_fechaExamen
JOIN 
    materias m ON f.id_materia = m.id_materia
JOIN 
    condiciones cond ON f.id_condicion = cond.id_condicion
JOIN 
    cursos cu ON p.id_curso = cu.id_curso
LEFT JOIN 
    calificaciones cal ON i.id_calificacion = cal.id_calificacion
WHERE
    i.id_turno = 24  -- Asegúrate de que este ID sea el correcto
    AND f.id_condicion = 4
ORDER BY 
    f.fechaExamen ASC, 
    m.nombre ASC, 
    a.apellidos ASC;