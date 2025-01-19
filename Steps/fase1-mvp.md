# Fase 1: MVP (2 meses) 🚀

## Índice de Contenidos
1. [Sprint 1-2: Fundamentos](#1-sprint-1-2-fundamentos-)
   1. [Setup Inicial](#11-setup-inicial-)
   2. [Autenticación Básica](#12-autenticación-básica-)
   3. [Modelos de Datos Core](#13-modelos-de-datos-core-)
2. [Sprint 3-4: Funcionalidades Core](#2-sprint-3-4-funcionalidades-core-)
   1. [Registro de Usuarios](#21-registro-de-usuarios-)
   2. [Sistema de Viajes](#22-sistema-de-viajes-)
   3. [Pagos](#23-pagos-)

## 1. Sprint 1-2: Fundamentos 🏗️

### 1.1 Setup Inicial 💻
#### 1.1.1 Configuración del Proyecto
- [ ] Crear repositorio en GitHub
- [ ] Clonar repositorio localmente
- [ ] Inicializar proyecto Next.js 14  ```bash
  npx create-next-app@latest venezuela-ride --typescript --tailwind --eslint  ```
- [ ] Configurar estructura de carpetas  ```
  src/
  ├── app/
  ├── components/
  ├── lib/
  ├── hooks/
  ├── types/
  └── utils/  ```

#### 1.1.2 Setup de CI/CD
- [ ] Configurar GitHub Actions
  - [ ] Workflow de lint y test
  - [ ] Workflow de build
  - [ ] Workflow de deploy
- [ ] Configurar Vercel
  - [ ] Conectar con repositorio
  - [ ] Setup de variables de entorno
  - [ ] Configurar dominios

#### 1.1.3 Configuración de UI Base
- [ ] Setup de Tailwind CSS
  - [ ] Configurar tema personalizado
  - [ ] Definir variables de diseño
- [ ] Implementar Shadcn/ui
  - [ ] Instalar componentes base
  - [ ] Crear tema personalizado
- [ ] Configurar Lucide Icons

### 1.2 Autenticación Básica 🔐
#### 1.2.1 Setup de Clerk
- [ ] Crear proyecto en Clerk
- [ ] Implementar ClerkProvider
- [ ] Configurar páginas de auth
  - [ ] Sign In
  - [ ] Sign Up
  - [ ] Reset Password

#### 1.2.2 Roles y Permisos
- [ ] Implementar middleware de autenticación
- [ ] Configurar roles básicos
  - [ ] Usuario
  - [ ] Conductor
  - [ ] Administrador
- [ ] Crear HOCs de protección de rutas

### 1.3 Modelos de Datos Core 📊
#### 1.3.1 Setup de Base de Datos
- [ ] Setup inicial de Supabase
  ```bash
  # Instalar dependencias
  npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
  ```
- [ ] Configurar variables de entorno
  ```env
  NEXT_PUBLIC_SUPABASE_URL=your-project-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  DATABASE_URL=your-connection-string
  ```
- [ ] Inicializar Prisma con PostgreSQL
  ```bash
  npx prisma init
  ```
- [ ] Configurar extensiones PostgreSQL
  ```sql
  -- En Supabase SQL Editor
  CREATE EXTENSION IF NOT EXISTS postgis;    -- Para geolocalización
  CREATE EXTENSION IF NOT EXISTS vector;     -- Para búsquedas vectoriales
  CREATE EXTENSION IF NOT EXISTS pg_crypto;  -- Para encriptación
  ```

#### 1.3.2 Implementación de Modelos
- [ ] Users
  ```prisma
  model User {
    id            String    @id @default(uuid())
    email         String    @unique
    role          Role      @default(USER)
    profile       Profile?
    created_at    DateTime  @default(now())
    updated_at    DateTime  @updatedAt
    
    @@map("users")
  }

  enum Role {
    USER
    DRIVER
    ADMIN
  }
  ```

- [ ] Profiles
  ```prisma
  model Profile {
    id              String    @id @default(uuid())
    userId          String    @unique
    fullName        String
    phone           String?
    documentId      String?
    address         String?
    profilePicture  String?
    verificationStatus VerificationStatus @default(PENDING)
    user            User      @relation(fields: [userId], references: [id])
    
    @@map("profiles")
  }

  enum VerificationStatus {
    PENDING
    VERIFIED
    REJECTED
  }
  ```

- [ ] Vehicles
  ```prisma
  model Vehicle {
    id              String    @id @default(uuid())
    driverId        String
    brand           String
    model           String
    year            Int
    plate           String    @unique
    color           String
    status          VehicleStatus @default(ACTIVE)
    documentsStatus Json      @default("{}")
    driver          User      @relation(fields: [driverId], references: [id])
    
    @@map("vehicles")
  }

  enum VehicleStatus {
    ACTIVE
    INACTIVE
    MAINTENANCE
  }
  ```

- [ ] Trips
  ```prisma
  model Trip {
    id              String    @id @default(uuid())
    passengerId     String
    driverId        String
    vehicleId       String
    startLocation   Json      // PostGIS Point
    endLocation     Json      // PostGIS Point
    status          TripStatus @default(PENDING)
    price           Decimal   @db.Decimal(10,2)
    createdAt       DateTime  @default(now())
    completedAt     DateTime?
    
    passenger       User      @relation("PassengerTrips", fields: [passengerId], references: [id])
    driver          User      @relation("DriverTrips", fields: [driverId], references: [id])
    vehicle         Vehicle   @relation(fields: [vehicleId], references: [id])
    
    @@map("trips")
  }

  enum TripStatus {
    PENDING
    ACCEPTED
    IN_PROGRESS
    COMPLETED
    CANCELLED
  }
  ```

- [ ] Payments
  ```prisma
  model Payment {
    id              String    @id @default(uuid())
    tripId          String
    amount          Decimal   @db.Decimal(10,2)
    method          PaymentMethod
    status          PaymentStatus @default(PENDING)
    transactionId   String?
    createdAt       DateTime  @default(now())
    
    trip            Trip      @relation(fields: [tripId], references: [id])
    
    @@map("payments")
  }

  enum PaymentMethod {
    CASH
    TRANSFER
    CRYPTO
    CARD
  }

  enum PaymentStatus {
    PENDING
    COMPLETED
    FAILED
    REFUNDED
  }
  ```

#### 1.3.3 Configuración de Políticas RLS
- [ ] Configurar políticas base
  ```sql
  -- Política para usuarios
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users can read their own data" ON users
    FOR SELECT USING (auth.uid() = id);

  -- Política para perfiles
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Profiles are viewable by owners" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

  -- Política para vehículos
  ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Vehicles viewable by owner and admins" ON vehicles
    FOR SELECT USING (
      auth.uid() = driver_id OR 
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
    );
  ```

#### 1.3.4 Índices y Optimizaciones
- [ ] Crear índices para búsquedas frecuentes
  ```sql
  -- Índices geoespaciales
  CREATE INDEX idx_trips_start_location ON trips USING GIST (start_location);
  CREATE INDEX idx_trips_end_location ON trips USING GIST (end_location);

  -- Índices para búsquedas comunes
  CREATE INDEX idx_trips_status ON trips (status);
  CREATE INDEX idx_payments_status ON payments (status);
  ```

## 2. Sprint 3-4: Funcionalidades Core 🛠️

### 2.1 Registro de Usuarios 👥
#### 2.1.1 Formularios de Registro
- [ ] Implementar formulario de pasajeros
  - [ ] Datos personales
  - [ ] Validación de teléfono
  - [ ] Upload de foto
- [ ] Implementar formulario de conductores
  - [ ] Datos personales extendidos
  - [ ] Información del vehículo
  - [ ] Documentación requerida

#### 2.1.2 Verificación de Identidad
- [ ] Sistema de verificación de documentos
- [ ] Validación de números telefónicos
- [ ] Verificación de correo electrónico

### 2.2 Sistema de Viajes 🚗
#### 2.2.1 Implementación de Mapas
- [ ] Configurar Mapbox/Google Maps
- [ ] Implementar selector de ubicación
- [ ] Sistema de geocodificación

#### 2.2.2 Solicitud de Viajes
- [ ] Crear interfaz de solicitud
  - [ ] Selector de origen/destino
  - [ ] Estimación de precio
  - [ ] Selección de tipo de servicio
- [ ] Sistema de matching con conductores
- [ ] Implementar tracking en tiempo real

#### 2.2.3 Gestión de Viajes
- [ ] Panel de control de conductores
- [ ] Sistema de estados de viaje
- [ ] Historial de viajes

### 2.3 Pagos 💰
#### 2.3.1 Sistema de Pagos en Efectivo
- [ ] Implementar registro de pagos
- [ ] Sistema de confirmación
- [ ] Generación de recibos

#### 2.3.2 Gestión Financiera
- [ ] Sistema de balance de conductores
- [ ] Registro de transacciones
- [ ] Reportes básicos

## Checklist de Finalización de MVP ✅

### Infraestructura
- [ ] Proyecto desplegado en producción
- [ ] CI/CD funcionando correctamente
- [ ] Monitoreo básico implementado

### Funcionalidades Usuario
- [ ] Registro funcional
- [ ] Solicitud de viajes operativa
- [ ] Pagos en efectivo funcionando

### Funcionalidades Conductor
- [ ] Registro con verificación
- [ ] Aceptación de viajes
- [ ] Balance y pagos

### Calidad
- [ ] Tests básicos implementados
- [ ] Performance optimizada
- [ ] Errores principales manejados

### Documentación
- [ ] README actualizado
- [ ] Documentación técnica básica
- [ ] Guía de despliegue 