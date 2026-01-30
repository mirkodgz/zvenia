'use client';

import { useState, useEffect, useRef } from 'react';
import {
  UserIcon,
  SettingsIcon,
  ShieldCheckIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  Globe,
  Mic,
  Megaphone,
} from 'lucide-react';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderUserDropdownProps {
  user: {
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    role?: string;
    profile_slug?: string | null;
  };
  profile?: {
    role?: string;
    profile_slug?: string;
  } | null;
}

export default function HeaderUserDropdown({ user, profile }: HeaderUserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevenir bloqueo del scroll cuando el dropdown está abierto
  useEffect(() => {
    if (isOpen) {
      // Remover cualquier estilo que bloquee el scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'auto';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Obtener datos del usuario
  const firstName = user.first_name || '';
  const lastName = user.last_name || '';
  const fullName = user.full_name || `${firstName} ${lastName}`.trim() || user.email?.split('@')[0] || 'User';
  const displayName = firstName && lastName ? `${firstName} ${lastName}` : fullName;
  const email = user.email || '';
  const avatarUrl = user.avatar_url;

  // Obtener rol - priorizar profile.role sobre user.role
  // user.role puede ser "authenticated" (incorrecto), así que usamos profile.role primero
  const userRole = (profile?.role || (user.role && user.role !== 'authenticated' ? user.role : null) || 'Basic').trim();

  // Obtener profile slug para el link
  const profileSlug = profile?.profile_slug || user.profile_slug;
  const profileLink = profileSlug ? `/profile/${profileSlug}` : '/profile';

  // Debug: Log para verificar el rol
  useEffect(() => {
    console.log('[HeaderUserDropdown] User object:', user);
    console.log('[HeaderUserDropdown] Profile object:', profile);
    console.log('[HeaderUserDropdown] User role:', user.role);
    console.log('[HeaderUserDropdown] Profile role:', profile?.role);
    console.log('[HeaderUserDropdown] Final userRole:', userRole);
    console.log('[HeaderUserDropdown] isAdministrator:', userRole === 'Administrator');
    console.log('[HeaderUserDropdown] Role comparison:', {
      userRole,
      isExactMatch: userRole === 'Administrator',
      includesAdmin: userRole.toLowerCase().includes('admin'),
    });
  }, [userRole, user.role, profile?.role]);

  // Generar iniciales
  const initials = (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '') ||
    fullName?.charAt(0).toUpperCase() ||
    email?.charAt(0).toUpperCase() || 'U';

  // Colores por rol
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrator':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'CountryManager':
        return 'bg-blue-500/20 text-blue-500';
      case 'Expert':
        return 'bg-green-500/20 text-green-500';
      case 'Ads':
        return 'bg-purple-500/20 text-purple-500';
      case 'Events':
        return 'bg-orange-500/20 text-orange-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const roleColorClass = getRoleColor(userRole);
  // Verificar si es Administrator (case-insensitive para mayor robustez)
  const isAdministrator = userRole === 'Administrator' || userRole.toLowerCase() === 'administrator';

  const handleSignOut = async () => {
    window.location.href = '/api/auth/signout';
  };

  // Handlers para hover (desktop) y click (mobile/desktop)
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (!isMobile) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      // Usar un pequeño delay para permitir que el mouse se mueva al dropdown
      hoverTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  const handleClick = () => {
    // Permitir click tanto en mobile como desktop
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-white hover:text-primary-400 transition-colors focus:outline-none"
          >
            <span className="sr-only">Open user menu</span>
            <Avatar className="h-8 w-8 cursor-pointer" style={{ backgroundColor: '#00c44b' }}>
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={displayName} />
              ) : null}
              <AvatarFallback className="text-white font-bold" style={{ backgroundColor: '#00c44b' }}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden xl:block">{firstName || email?.split('@')[0]}</span>
            <svg
              className="h-5 w-5 flex-none text-gray-400 group-hover:text-primary-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80 bg-white border border-gray-200 shadow-lg"
          align="end"
          sideOffset={8}
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
            if (!isMobile) {
              setIsOpen(true);
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          {/* Header con Avatar, Nombre y Email */}
          <DropdownMenuLabel className="flex items-center gap-4 px-4 py-3 font-normal border-b border-gray-200">
            <div className="relative">
              <Avatar className="size-10" style={{ backgroundColor: '#00c44b' }}>
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={displayName} />
                ) : null}
                <AvatarFallback className="text-white font-bold" style={{ backgroundColor: '#00c44b' }}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute right-0 bottom-0 block size-2.5 rounded-full bg-green-600 ring-2 ring-white" />
            </div>
            <div className="flex flex-1 flex-col items-start">
              <span className="text-dark text-base font-semibold">{displayName}</span>
              <span className="text-gray-500 text-sm">{email}</span>
            </div>
          </DropdownMenuLabel>

          {/* Role Badge */}
          <div className={`px-4 py-2 border-b border-gray-200 ${roleColorClass}`}>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">{userRole}</span>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-gray-200" />

          {/* Menu Items */}
          <DropdownMenuGroup>
            {isAdministrator && (
              <DropdownMenuItem
                className="px-4 py-2.5 text-base cursor-pointer"
                onClick={() => (window.location.href = '/admin')}
              >
                <LayoutDashboardIcon className="text-yellow-500 size-5 mr-3" />
                <span className="text-yellow-500 font-bold">Admin</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="px-4 py-2.5 text-base cursor-pointer"
              onClick={() => (window.location.href = '/z-network')}
            >
              <Globe className="text-dark size-5 mr-3" />
              <span className="text-dark font-semibold">Z-NETWORK</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="px-4 py-2.5 text-base cursor-pointer"
              onClick={() => (window.location.href = '/z-talks')}
            >
              <Mic className="text-dark size-5 mr-3" />
              <span className="text-dark font-semibold">Z-TALKS</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="px-4 py-2.5 text-base cursor-pointer"
              onClick={() => (window.location.href = '/ads')}
            >
              <Megaphone className="text-dark size-5 mr-3" />
              <span className="text-dark font-semibold">ADS</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="px-4 py-2.5 text-base cursor-pointer"
              onClick={() => (window.location.href = '/dashboard/profile')}
            >
              <UserIcon className="text-dark size-5 mr-3" />
              <span className="text-dark font-semibold">User Area</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="px-4 py-2.5 text-base cursor-pointer"
              onClick={() => (window.location.href = profileLink)}
            >
              <UserIcon className="text-dark size-5 mr-3" />
              <span className="text-dark">Your Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="px-4 py-2.5 text-base cursor-pointer"
              onClick={() => (window.location.href = '/dashboard/profile/edit')}
            >
              <SettingsIcon className="text-dark size-5 mr-3" />
              <span className="text-dark">Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-gray-200" />

          <DropdownMenuItem
            variant="destructive"
            className="px-4 py-2.5 text-base cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOutIcon className="size-5 mr-3" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

