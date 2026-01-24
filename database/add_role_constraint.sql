-- Agregar constraint CHECK para validar que role solo tenga valores permitidos
-- Esto asegura que solo se puedan insertar roles válidos

ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('Basic', 'Expert', 'Ads', 'Events', 'CountryManager', 'Administrator'));

-- Opcional: Agregar un valor por defecto
ALTER TABLE profiles 
ALTER COLUMN role SET DEFAULT 'Basic';

-- Verificar que el constraint funciona
-- Esto debería fallar:
-- UPDATE profiles SET role = 'InvalidRole' WHERE email = 'test@test.com';

