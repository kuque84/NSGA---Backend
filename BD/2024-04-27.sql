-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: nsgadb
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alumnos`
--

DROP TABLE IF EXISTS `alumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnos` (
  `dni` varchar(12) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `nombres` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumnos`
--

LOCK TABLES `alumnos` WRITE;
/*!40000 ALTER TABLE `alumnos` DISABLE KEYS */;
/*!40000 ALTER TABLE `alumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calificaciones`
--

DROP TABLE IF EXISTS `calificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calificaciones` (
  `id_calificacion` int NOT NULL AUTO_INCREMENT,
  `calificacion` varchar(2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `aprobado` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_calificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calificaciones`
--

LOCK TABLES `calificaciones` WRITE;
/*!40000 ALTER TABLE `calificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `calificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciclolectivos`
--

DROP TABLE IF EXISTS `ciclolectivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciclolectivos` (
  `id_ciclo` int NOT NULL AUTO_INCREMENT,
  `anio` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_ciclo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciclolectivos`
--

LOCK TABLES `ciclolectivos` WRITE;
/*!40000 ALTER TABLE `ciclolectivos` DISABLE KEYS */;
INSERT INTO `ciclolectivos` VALUES (1,2015,'2024-04-27 17:29:43','2024-04-27 17:29:43'),(2,2016,'2024-04-27 17:29:54','2024-04-27 17:29:54'),(3,2017,'2024-04-27 17:29:57','2024-04-27 17:29:57'),(4,2018,'2024-04-27 17:30:01','2024-04-27 17:30:01'),(5,2019,'2024-04-27 17:30:06','2024-04-27 17:30:06'),(6,2020,'2024-04-27 17:30:08','2024-04-27 17:30:08'),(7,2021,'2024-04-27 17:30:11','2024-04-27 17:30:11'),(8,2022,'2024-04-27 17:30:13','2024-04-27 17:30:13'),(9,2023,'2024-04-27 17:30:17','2024-04-27 17:30:17');
/*!40000 ALTER TABLE `ciclolectivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `condiciones`
--

DROP TABLE IF EXISTS `condiciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `condiciones` (
  `id_condicion` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_condicion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `condiciones`
--

LOCK TABLES `condiciones` WRITE;
/*!40000 ALTER TABLE `condiciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `condiciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos` (
  `id_curso` int NOT NULL AUTO_INCREMENT,
  `id_plan` int NOT NULL,
  `nombre` varchar(2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_curso`),
  KEY `id_plan` (`id_plan`),
  CONSTRAINT `cursos_ibfk_1` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_10` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_11` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_12` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_13` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_14` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_15` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_16` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_17` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_18` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_19` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_2` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_20` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_21` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_22` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_23` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_24` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_25` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_26` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_27` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_28` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_29` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_3` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_30` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_31` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_32` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_33` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_34` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_35` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_4` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_5` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_6` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_7` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_8` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  CONSTRAINT `cursos_ibfk_9` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
INSERT INTO `cursos` VALUES (1,1,'1°','2024-04-27 18:30:25','2024-04-27 18:30:25'),(2,1,'2°','2024-04-27 18:30:28','2024-04-27 18:30:28'),(3,1,'3°','2024-04-27 18:30:31','2024-04-27 18:30:31'),(4,2,'4°','2024-04-27 18:30:35','2024-04-27 18:30:35'),(5,2,'5°','2024-04-27 18:30:39','2024-04-27 18:30:39'),(6,2,'6°','2024-04-27 18:30:42','2024-04-27 18:30:42');
/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fechas`
--

DROP TABLE IF EXISTS `fechas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fechas` (
  `id_fecha` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL,
  `id_turno` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_fecha`),
  KEY `id_turno` (`id_turno`),
  CONSTRAINT `fechas_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_10` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_11` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_12` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_13` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_14` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_15` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_16` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_17` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_18` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_19` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_2` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_20` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_21` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_22` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_23` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_24` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_25` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_26` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_27` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_28` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_29` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_3` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_30` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_4` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_5` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_6` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_7` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_8` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `fechas_ibfk_9` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fechas`
--

LOCK TABLES `fechas` WRITE;
/*!40000 ALTER TABLE `fechas` DISABLE KEYS */;
/*!40000 ALTER TABLE `fechas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripciones`
--

DROP TABLE IF EXISTS `inscripciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscripciones` (
  `id_inscripcion` int NOT NULL AUTO_INCREMENT,
  `id_previa` int NOT NULL,
  `id_turno` int NOT NULL,
  `id_fecha` int NOT NULL,
  `nota` int DEFAULT NULL,
  `libro` varchar(255) DEFAULT NULL,
  `folio` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_inscripcion`),
  KEY `id_previa` (`id_previa`),
  KEY `id_turno` (`id_turno`),
  KEY `id_fecha` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_10` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_11` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_12` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_13` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_14` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_15` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_16` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_17` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_18` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_19` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_20` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_21` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_22` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_23` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_24` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_25` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_26` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_27` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_28` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_29` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_3` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_30` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_31` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_32` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_33` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_34` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_35` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_36` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_37` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_38` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_39` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_4` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_40` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_41` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_42` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_43` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_44` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_45` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_46` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_47` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_48` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_49` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_5` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_50` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_51` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_52` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_53` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_54` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_55` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_56` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_57` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_58` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_59` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_6` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_60` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_61` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_62` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_63` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_64` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_65` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_66` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_67` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_68` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_69` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_7` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_70` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_71` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_72` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_73` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_74` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_75` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_76` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_77` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_78` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_79` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_8` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_80` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_81` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_82` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_83` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_84` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_85` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_86` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_87` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_88` FOREIGN KEY (`id_previa`) REFERENCES `previas` (`id_previa`),
  CONSTRAINT `inscripciones_ibfk_89` FOREIGN KEY (`id_turno`) REFERENCES `turnosexamen` (`id_turno`),
  CONSTRAINT `inscripciones_ibfk_9` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`),
  CONSTRAINT `inscripciones_ibfk_90` FOREIGN KEY (`id_fecha`) REFERENCES `fechas` (`id_fecha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripciones`
--

LOCK TABLES `inscripciones` WRITE;
/*!40000 ALTER TABLE `inscripciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `inscripciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materias`
--

DROP TABLE IF EXISTS `materias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materias` (
  `id_materia` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `area` varchar(255) NOT NULL,
  `id_curso` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_materia`),
  KEY `id_curso` (`id_curso`),
  CONSTRAINT `materias_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_10` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_11` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_12` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_13` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_14` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_15` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_16` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_17` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_18` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_19` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_2` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_20` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_21` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_22` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_23` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_24` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_25` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_26` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_27` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_28` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_29` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_3` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_30` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_31` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_4` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_5` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_6` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_7` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_8` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  CONSTRAINT `materias_ibfk_9` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materias`
--

LOCK TABLES `materias` WRITE;
/*!40000 ALTER TABLE `materias` DISABLE KEYS */;
/*!40000 ALTER TABLE `materias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planes`
--

DROP TABLE IF EXISTS `planes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planes` (
  `id_plan` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(25) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `id_ciclo` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_plan`),
  KEY `id_ciclo` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_1` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_10` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_11` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_12` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_13` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_14` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_15` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_16` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_17` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_18` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_19` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_2` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_20` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_21` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_22` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_23` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_24` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_25` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_26` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_27` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_28` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_29` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_3` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_30` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_31` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_32` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_33` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_34` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_35` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_4` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_5` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_6` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_7` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_8` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`),
  CONSTRAINT `planes_ibfk_9` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclolectivos` (`id_ciclo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planes`
--

LOCK TABLES `planes` WRITE;
/*!40000 ALTER TABLE `planes` DISABLE KEYS */;
INSERT INTO `planes` VALUES (1,'Dcto. N° 344/11','BACHILLER EN ECONOMÍA Y ADMINISTRACIÓN',9,'2024-04-27 18:12:24','2024-04-27 18:12:24'),(2,'Dcto. N° 668/11','BACHILLER EN ECONOMÍA Y ADMINISTRACIÓN',9,'2024-04-27 18:13:02','2024-04-27 18:13:02');
/*!40000 ALTER TABLE `planes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `previas`
--

DROP TABLE IF EXISTS `previas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `previas` (
  `id_previa` int NOT NULL AUTO_INCREMENT,
  `dni_alumno` varchar(12) NOT NULL,
  `id_condicion` int NOT NULL,
  `id_materia` int NOT NULL,
  `aprobado` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_previa`),
  KEY `dni_alumno` (`dni_alumno`),
  KEY `id_condicion` (`id_condicion`),
  KEY `id_materia` (`id_materia`),
  CONSTRAINT `previas_ibfk_1` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_10` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_11` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_12` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_13` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_14` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_15` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_16` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_17` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_18` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_19` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_2` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_20` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_21` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_22` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_23` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_24` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_25` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_26` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_27` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_28` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_29` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_3` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_30` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_31` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_32` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_33` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_34` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_35` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_36` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_37` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_38` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_39` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_4` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_40` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_41` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_42` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_43` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_44` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_45` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_46` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_47` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_48` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_49` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_5` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_50` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_51` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_52` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_53` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_54` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_55` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_56` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_57` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_58` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_59` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_6` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_60` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_61` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_62` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_63` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_64` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_65` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_66` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_67` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_68` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_69` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_7` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_70` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_71` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_72` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_73` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_74` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_75` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_76` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_77` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_78` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_79` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_8` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_80` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_81` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_82` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_83` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_84` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_85` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_86` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_87` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_88` FOREIGN KEY (`dni_alumno`) REFERENCES `alumnos` (`dni`),
  CONSTRAINT `previas_ibfk_89` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones` (`id_condicion`),
  CONSTRAINT `previas_ibfk_9` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`),
  CONSTRAINT `previas_ibfk_90` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `previas`
--

LOCK TABLES `previas` WRITE;
/*!40000 ALTER TABLE `previas` DISABLE KEYS */;
/*!40000 ALTER TABLE `previas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnosexamen`
--

DROP TABLE IF EXISTS `turnosexamen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnosexamen` (
  `id_turno` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_turno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnosexamen`
--

LOCK TABLES `turnosexamen` WRITE;
/*!40000 ALTER TABLE `turnosexamen` DISABLE KEYS */;
/*!40000 ALTER TABLE `turnosexamen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `dni` varchar(8) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Eugenio Regis','kuque84@gmail.com','30711347','$2b$08$WeyhSl/raBQfky6wMCBcy.SxvxkpmzKv4Uud6o.txubKkln4j4FIS','2024-04-27 17:28:17','2024-04-27 17:28:17');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-27 16:20:14
