-- Solo ejecutar esto para permitir la creación de anuncios
-- La política de lectura ya existe, así que solo agregamos la de INSERTAR

CREATE POLICY "Enable insert for authenticated users" 
ON "public"."ads" 
FOR INSERT 
TO authenticated 
WITH CHECK (true);
