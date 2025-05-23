-- DropForeignKey
ALTER TABLE "Movimiento" DROP CONSTRAINT "Movimiento_usuarioId_fkey";

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
