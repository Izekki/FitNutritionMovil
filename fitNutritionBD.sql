-- ----------------------------
-- Crear la base de datos
-- ----------------------------
CREATE DATABASE IF NOT EXISTS fitNutrition
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;
SET FOREIGN_KEY_CHECKS = 0;

-- Seleccionar la base de datos
USE fitNutrition;

SET NAMES utf8mb4;

-- ----------------------------
-- Tabla medico
-- ----------------------------
DROP TABLE IF EXISTS `medico`;
CREATE TABLE `medico`  (
  `idMedico` INT NOT NULL AUTO_INCREMENT,
  `numPersonal` INT NOT NULL UNIQUE,
  `cedulaProfesional` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL UNIQUE,
  `nombreMedico` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `apellidosMedico` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fechaNacimiento` DATE NOT NULL,
  `genero` ENUM('M','F', 'Otro') NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL UNIQUE,
  `telefono` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `domicilio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fotografia` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `estatus` ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (`idMedico`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Tabla paciente
-- ----------------------------
DROP TABLE IF EXISTS `paciente`;
CREATE TABLE `paciente`  (
  `idPaciente` INT NOT NULL AUTO_INCREMENT,
  `idMedico` INT NOT NULL,
  `nombrePaciente` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `apellidosPaciente` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fechaNacimiento` DATE NOT NULL,
  `genero` ENUM('M','F', 'Otro') NOT NULL,
  `peso` DECIMAL(5,2) NOT NULL,
  `estatura` DECIMAL(5,2) NOT NULL,
  `talla` DECIMAL(5,2) NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL UNIQUE,
  `telefono` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `domicilio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fotografia` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `codigoAcceso` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `estatus` ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (`idPaciente`) USING BTREE,

  CONSTRAINT `fk_medicoPaciente` FOREIGN KEY (`idMedico`) REFERENCES `medico` (`idMedico`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Tabla administrador
-- ----------------------------
DROP TABLE IF EXISTS `administrador`;
CREATE TABLE `administrador`  (
  `idAdministrador` INT NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL UNIQUE,
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nombreAdmin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`idAdministrador`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Tabla dieta
-- ----------------------------
DROP TABLE IF EXISTS `dieta`;
CREATE TABLE `dieta`  (
  `idDieta` INT NOT NULL AUTO_INCREMENT,
  `nombreDieta` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `caloriasTotales` DECIMAL(6,2) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `estatusEdicion` ENUM('Editable','Bloqueada') NOT NULL,

  PRIMARY KEY (`idDieta`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Tabla cita
-- ----------------------------
DROP TABLE IF EXISTS `cita`;
CREATE TABLE `cita`  (
  `idCita` INT NOT NULL AUTO_INCREMENT,
  `idPaciente` INT NOT NULL, 
  `idMedico` INT NOT NULL,
  `idMedicoAnterior` INT NULL,
  `fecha` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `estado` ENUM('Asignada','Cancelada','Reagendada', 'Asistida', 'Ausente') NOT NULL  DEFAULT 'Asignada',
  `observaciones` TEXT NULL,
  PRIMARY KEY (`idCita`) USING BTREE,

  CONSTRAINT `fk_citaPaciente` FOREIGN KEY (`idPaciente`) REFERENCES `paciente` (`idPaciente`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_citaMedica` FOREIGN KEY (`idMedico`) REFERENCES `medico` (`idMedico`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_citaMedicoAnterior` FOREIGN KEY (`idMedicoAnterior`) REFERENCES `medico` (`idMedico`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Tabla consulta 
-- ----------------------------
DROP TABLE IF EXISTS `consulta`;
CREATE TABLE `consulta`  (
  `idConsulta` INT NOT NULL AUTO_INCREMENT,
  `idPaciente` INT NOT NULL,
  `idMedico` INT NOT NULL,
  `idCita` INT NOT NULL,
  `idDieta` INT NOT NULL,
  `fecha` DATE NOT NULL,
  `pesoCapturado` DECIMAL(5,2) NOT NULL,
  `tallaCapturada` DECIMAL(5,2) NOT NULL,
  `imcCalculado` DECIMAL(5,2) NOT NULL,
  `observaciones` TEXT NULL,
  PRIMARY KEY (`idConsulta`) USING BTREE,

  CONSTRAINT `fk_consultaCita` FOREIGN KEY (`idCita`) REFERENCES `cita` (`idCita`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_consultaPaciente` FOREIGN KEY (`idPaciente`) REFERENCES `paciente` (`idPaciente`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_consultaMedico` FOREIGN KEY (`idMedico`) REFERENCES `medico` (`idMedico`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_consultaDieta` FOREIGN KEY (`idDieta`) REFERENCES `dieta` (`idDieta`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Tabla alimento
-- ----------------------------
DROP TABLE IF EXISTS `alimento`;
CREATE TABLE alimento (
  idAlimento INT AUTO_INCREMENT,
  nombreAlimento VARCHAR(100) NOT NULL UNIQUE,
  calorias DECIMAL(6,2) NOT NULL,
  porcion varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  proteinas DECIMAL(6,2) NOT NULL,
  carbohidratos DECIMAL(6,2) NOT NULL,
  grasas DECIMAL (6,2) NOT NULL,
  PRIMARY KEY (`idAlimento`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Tabla alimento/dieta
-- ----------------------------
DROP TABLE IF EXISTS `dietaAlimento`;
CREATE TABLE dietaAlimento (
    idDietaAlimento INT AUTO_INCREMENT,
    idDieta INT NOT NULL,
    idAlimento INT NOT NULL,
    porcion VARCHAR(50) NOT NULL,
    caloriasPorcion DECIMAL(6,2) NOT NULL,
    tiempoComida VARCHAR(50) NOT NULL,
    PRIMARY KEY(idDietaAlimento),

    UNIQUE(idDieta, idAlimento, tiempoComida),
    
    CONSTRAINT `fk_dietaAlimento_Dieta` FOREIGN KEY(idDieta) REFERENCES dieta(idDieta) ON DELETE CASCADE,
    CONSTRAINT `fk_DietaAlimento_Alimento` FOREIGN KEY(idAlimento) REFERENCES alimento(idAlimento) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Insert
-- ----------------------------

INSERT INTO administrador (email, contrasena, nombreAdmin) 
VALUES ('miguellmrjilo@gmail.com', SHA2('admin123',256), 'Teo');

INSERT INTO medico (numPersonal, cedulaProfesional, nombreMedico, apellidosMedico, contrasena, fechaNacimiento, genero, email, telefono, domicilio, fotografia, estatus) 
VALUES (1001, 'CED123456', 'Carlos', 'Ramirez Lopez', SHA2('medico123',256), '1980-05-10', 'M', 'carlos.ramirez@fitnutrition.com', '2281234567', 'Xalapa, Veracruz', 'medico1.jpg', 'Activo');

INSERT INTO paciente (idMedico, nombrePaciente, apellidosPaciente, fechaNacimiento, genero, peso, estatura, talla, email, telefono, domicilio, fotografia, codigoAcceso, estatus) 
VALUES (1, 'Ana', 'Martinez Gomez', '2000-08-15', 'F', 62.50, 1.65, 28.00, 'ana.martinez@gmail.com', '2289876543', 'Coatepec, Veracruz', 'paciente1.jpg', '1234', 'Activo');

INSERT INTO dieta (nombreDieta, caloriasTotales, descripcion, estatusEdicion) 
VALUES ('Dieta Balanceada', 2200.00, 'Plan alimenticio balanceado para mantenimiento.', 'Editable');

INSERT INTO cita (idPaciente, idMedico, fecha, hora, estado, observaciones) 
VALUES (1, 1, '2026-05-20', '10:30:00', 'Asignada', 'Primera consulta nutricional.');

INSERT INTO consulta (idPaciente, idMedico, idCita, idDieta, fecha, pesoCapturado, tallaCapturada, imcCalculado, observaciones) 
VALUES (1, 1, 1, 1, '2026-05-20', 62.50, 1.65, 22.96, 'Paciente con buen estado general.');

INSERT INTO alimento (nombreAlimento, calorias, porcion, proteinas, carbohidratos, grasas) 
VALUES ('Pechuga de pollo', 165.00, '100g', 31.00, 0.00, 3.60), ('Arroz blanco', 130.00, '100g', 2.70, 28.00, 0.30), ('Manzana', 52.00, '1 pieza', 0.30, 14.00, 0.20);

INSERT INTO dietaAlimento (idDieta, idAlimento, porcion, caloriasPorcion, tiempoComida) 
VALUES (1, 1, '150g', 247.50, 'Comida'), (1, 2, '200g', 260.00, 'Comida'), (1, 3, '1 pieza', 52.00, 'Colacion1');