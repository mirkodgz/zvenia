'use client';

import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

export default function AdminLoginForm() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Verificar que el usuario tiene rol de admin
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            const role = profile?.role || 'Basic';
            const adminRoles = ['CountryManager', 'Administrator'];

            if (!adminRoles.includes(role)) {
                await supabase.auth.signOut();
                throw new Error('No tienes permisos de administrador');
            }

            // Esperar un momento para que las cookies se guarden
            await new Promise(resolve => setTimeout(resolve, 500));

            // Forzar recarga completa para que el middleware lea las cookies
            window.location.href = '/admin';
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name (Optional in original, kept for layout) */}
            <div>
                <Input
                    type="text"
                    name="name"
                    placeholder="Escribe tu nombre (opcional)"
                    disabled={isLoading}
                />
            </div>

            {/* Email */}
            <div>
                <Input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    required
                    disabled={isLoading}
                />
            </div>

            {/* Password */}
            <div className="relative">
                <Input
                    id="password"
                    name="password"
                    type={isVisible ? 'text' : 'password'}
                    placeholder="••••••••••••••••"
                    className="pr-9"
                    required
                    disabled={isLoading}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVisible((prevState) => !prevState)}
                    className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                    disabled={isLoading}
                >
                    {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                    <span className="sr-only">{isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}</span>
                </Button>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className='flex items-center justify-between gap-y-2'>
                <div className='flex items-center gap-3'>
                    <Checkbox id='rememberMe' className='size-6' />
                    <Label htmlFor='rememberMe' className='text-muted-foreground'>
                        Recuérdame
                    </Label>
                </div>

                <a href='#' className='hover:underline text-sm text-muted-foreground'>
                    ¿Olvidaste tu contraseña?
                </a>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <Button className="w-full bg-[#00c44b] hover:bg-[#00a33f] text-white" type="submit" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión en ZVENIA Admin'}
            </Button>
        </form>
    );
}
