import { e as createComponent, l as renderHead, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
/* empty css                                    */
import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { useState } from 'react';
import { Check, EyeOffIcon, EyeIcon } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { c as cn } from '../../chunks/utils_C0eazIxq.mjs';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as LabelPrimitive from '@radix-ui/react-label';
import { s as supabase } from '../../chunks/supabase_DZBRYQhj.mjs';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
export { renderers } from '../../renderers.mjs';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      CheckboxPrimitive.Indicator,
      {
        className: cn("flex items-center justify-center text-current"),
        children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" })
      }
    )
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;

function AdminLoginForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (authError) throw authError;
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
      const role = profile?.role || "Basic";
      const adminRoles = ["CountryManager", "Administrator"];
      if (!adminRoles.includes(role)) {
        await supabase.auth.signOut();
        throw new Error("No tienes permisos de administrador");
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.href = "/admin";
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      Input,
      {
        type: "text",
        name: "name",
        placeholder: "Escribe tu nombre (opcional)",
        disabled: isLoading
      }
    ) }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      Input,
      {
        type: "email",
        name: "email",
        placeholder: "tu@email.com",
        required: true,
        disabled: isLoading
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "password",
          name: "password",
          type: isVisible ? "text" : "password",
          placeholder: "••••••••••••••••",
          className: "pr-9",
          required: true,
          disabled: isLoading
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "icon",
          onClick: () => setIsVisible((prevState) => !prevState),
          className: "text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent",
          disabled: isLoading,
          children: [
            isVisible ? /* @__PURE__ */ jsx(EyeOffIcon, {}) : /* @__PURE__ */ jsx(EyeIcon, {}),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: isVisible ? "Ocultar contraseña" : "Mostrar contraseña" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Checkbox, { id: "rememberMe", className: "size-6" }),
        /* @__PURE__ */ jsx(Label, { htmlFor: "rememberMe", className: "text-muted-foreground", children: "Recuérdame" })
      ] }),
      /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline text-sm text-muted-foreground", children: "¿Olvidaste tu contraseña?" })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm", children: error }),
    /* @__PURE__ */ jsx(Button, { className: "w-full bg-[#00c44b] hover:bg-[#00a33f] text-white", type: "submit", disabled: isLoading, children: isLoading ? "Iniciando sesión..." : "Iniciar Sesión en ZVENIA Admin" })
  ] });
}

const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>Login - Admin Dashboard ZVENIA</title><!-- Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <body class="bg-white"> <div class="h-dvh lg:grid lg:grid-cols-2 overflow-hidden"> <!-- Left Side - Brand Section (Premium Design) --> <div class="bg-[#2a2a2a] relative flex flex-col items-center justify-between gap-12 p-10 max-lg:hidden xl:p-16 overflow-hidden"> <!-- Decorative background elements --> <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00c44b]/20 blur-[120px] rounded-full"></div> <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00c44b]/10 blur-[100px] rounded-full"></div> <div class="text-white relative z-10 w-full"> <h1 class="mb-6 text-4xl font-bold tracking-tight">
Welcome back! Please sign in to your ZVENIA Admin
                        account
</h1> <p class="text-xl text-gray-400">
Thank you for your hard work! Please enter your
                        credentials to access the management dashboard.
</p> </div> <!-- Dashboard Mockup Image Wrapper --> <div class="relative z-10 border-white/10 bg-white/5 flex max-h-[500px] w-full items-center justify-center rounded-2xl border-[1px] p-4 shadow-2xl backdrop-blur-md"> <div class="bg-[#1a1a1a] rounded-xl p-6 shadow-inner overflow-hidden border border-white/10 w-full flex items-center justify-center min-h-[300px]"> <div class="text-center group"> <img src="/zvenia-Logo.svg" alt="ZVENIA Mining" class="w-full max-w-[280px] opacity-90 group-hover:scale-105 transition-transform duration-500"> <div class="mt-8 flex justify-center gap-3"> <div class="h-2 w-12 bg-[#00c44b] rounded-full"></div> <div class="h-2 w-2 bg-white/20 rounded-full"></div> <div class="h-2 w-2 bg-white/20 rounded-full"></div> </div> </div> </div> </div> <!-- Social Icons / Badges --> <div class="relative z-10 flex gap-4 rounded-full bg-white/5 border border-white/10 px-4 py-3 backdrop-blur-md"> <div class="flex size-10 items-center justify-center rounded-full bg-white text-[#2a2a2a] shadow-lg"> <span class="font-bold">Z</span> </div> <div class="flex size-10 items-center justify-center rounded-full bg-white text-[#2a2a2a] shadow-lg"> <span class="font-bold text-xs uppercase">AI</span> </div> <div class="flex size-10 items-center justify-center rounded-full bg-white text-[#2a2a2a] shadow-lg"> <span class="font-bold">M</span> </div> </div> </div> <!-- Right Side - Login Form (Premium Design) --> <div class="flex h-full flex-col items-center justify-center py-10 px-6 sm:px-12 bg-white"> <div class="flex w-full max-w-md flex-col gap-8"> <!-- Logo for Mobile --> <div class="lg:hidden flex justify-center mb-2"> <img src="/zvenia-Logo.svg" alt="ZVENIA" class="h-14"> </div> <div class="space-y-3 text-center lg:text-left"> <h2 class="text-3xl font-bold text-gray-900 tracking-tight">
Welcome Back 👋
</h2> <p class="text-gray-500">
Inicia sesión para gestionar toda la plataforma de
                            ZVENIA
</p> </div> <!-- Quick Login Buttons --> <div class="flex flex-col gap-3"> ${renderComponent($$result, "Button", Button, { "variant": "outline", "className": "w-full h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all font-medium flex items-center justify-center gap-3" }, { "default": ($$result2) => renderTemplate` <svg class="w-5 h-5" viewBox="0 0 24 24"> <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path> <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path> <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path> <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path> </svg>
Login with Google
` })} ${renderComponent($$result, "Button", Button, { "variant": "outline", "className": "w-full h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all font-medium flex items-center justify-center gap-3" }, { "default": ($$result2) => renderTemplate` <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path> </svg>
Login with Facebook
` })} </div> <div class="flex items-center gap-4"> ${renderComponent($$result, "Separator", Separator, { "className": "flex-1 bg-gray-100" })} <p class="text-xs text-gray-400 uppercase font-bold tracking-widest">
Or
</p> ${renderComponent($$result, "Separator", Separator, { "className": "flex-1 bg-gray-100" })} </div> <div class="space-y-6"> <!-- Main Login Form Component --> ${renderComponent($$result, "AdminLoginForm", AdminLoginForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/admin/AdminLoginForm", "client:component-export": "default" })} <!-- Signup / Bottom Links --> <div class="pt-2"> <p class="text-gray-500 text-center text-sm">
Don&apos;t have an account yet?${" "} <a href="#" class="text-[#00c44b] hover:text-[#00a33f] font-bold transition-colors">
Sign Up
</a> </p> <p class="text-center mt-6"> <a href="/" class="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg>
Back to ZVENIA Home
</a> </p> </div> </div> </div> </div> </div> </body></html>`;
}, "D:/zveniaproject/src/pages/admin/login.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Login,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
