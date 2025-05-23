# Casos de Uso – CajaPyme

## 1. Registrar Ingreso/Egreso
**Actor:** Usuario (Cajero o Administrador)
**Flujo principal:**
1. El usuario inicia sesión en el sistema.
2. Accede a la sección "Caja".
3. Ingresa el monto, categoría y descripción del movimiento.
4. El sistema valida los datos y registra el ingreso o egreso.
5. El saldo y el historial se actualizan en tiempo real.

## 2. Visualizar Historial de Movimientos
**Actor:** Usuario
**Flujo principal:**
1. El usuario accede a la sección "Caja" o "Dashboard".
2. Selecciona un rango de fechas o periodo (día, mes).
3. El sistema muestra la lista de movimientos filtrados.

## 3. Generar Reporte
**Actor:** Usuario
**Flujo principal:**
1. El usuario accede a la sección de reportes.
2. Selecciona el periodo y tipo de reporte.
3. El sistema genera y muestra el resumen (ingresos, egresos, saldo neto).

## 4. Login y Cierre de Sesión
**Actor:** Usuario
**Flujo principal:**
1. El usuario ingresa sus credenciales.
2. El sistema valida y otorga acceso (JWT).
3. El usuario puede cerrar sesión desde cualquier pantalla.

## 5. Administración de Usuarios
**Actor:** Administrador
**Flujo principal:**
1. El administrador accede a la sección de configuración.
2. Puede crear, editar o eliminar usuarios y asignar roles.
3. El sistema actualiza la base de datos y los permisos.
