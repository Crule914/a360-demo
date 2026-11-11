import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
  HeadContent,
  type ErrorComponentProps,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useAuthUser } from "@/lib/auth";
import { useViewPrefsSync } from "@/lib/viewPrefs";


import { reportLovableError } from "../lib/lovable-error-reporting";
import appCssUrl from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
      { name: "googlebot", content: "noindex, nofollow" },
      { title: "Advisor360 Demo" },
      { name: "description", content: "Advisor360° Dashboard is an internal wealth management prototype for financial advisors." },
      { name: "author", content: "Advisor360" },
      { property: "og:title", content: "Advisor360 Demo" },
      { property: "og:description", content: "Advisor360° Dashboard is an internal wealth management prototype for financial advisors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Advisor360" },
      { name: "twitter:title", content: "Advisor360 Demo" },
      { name: "twitter:description", content: "Advisor360° Dashboard is an internal wealth management prototype for financial advisors." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/83f22d27-8dce-4aca-a7e4-5f23d27ebb51/id-preview-d3f86327--f1aa9ad3-43ba-43b4-aabe-27a047e75e8a.lovable.app-1782148170932.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/83f22d27-8dce-4aca-a7e4-5f23d27ebb51/id-preview-d3f86327--f1aa9ad3-43ba-43b4-aabe-27a047e75e8a.lovable.app-1782148170932.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCssUrl },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [authChecked, setAuthChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    type SessionLike = {
      user?: {
        email?: string | null;
        user_metadata?: Record<string, unknown>;
      };
    } | null;

    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { clearStoredUser, signIn } = await import("@/lib/auth");

      const syncFromSession = (
        session: SessionLike,
        options: { clearWhenMissing?: boolean } = {},
      ) => {
        if (!session?.user?.email) {
          if (options.clearWhenMissing) {
            clearStoredUser();
          }
          setHasSession(false);
          return;
        }
        const meta = session.user.user_metadata ?? {};
        const name =
          (meta.full_name as string | undefined) ??
          (meta.name as string | undefined) ??
          undefined;
        signIn(session.user.email, name);
        setHasSession(true);
      };

      const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
        if (
          event !== "INITIAL_SESSION" &&
          event !== "SIGNED_IN" &&
          event !== "SIGNED_OUT" &&
          event !== "USER_UPDATED"
        ) {
          return;
        }
        syncFromSession(session as SessionLike, {
          clearWhenMissing: event === "SIGNED_OUT",
        });
      });
      unsubscribe = () => sub.subscription.unsubscribe();

      if (cancelled) {
        unsubscribe();
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!cancelled) {
        syncFromSession(data.session as SessionLike);
        setAuthChecked(true);
      }
    })().catch((error) => {
      console.error(error);
      if (!cancelled) {
        setHasSession(false);
        setAuthChecked(true);
      }
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate authChecked={authChecked} hasSession={hasSession}>
        <ViewPrefsSync />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </AuthGate>
    </QueryClientProvider>
  );
}

function ViewPrefsSync() {
  useViewPrefsSync();
  return null;
}


const PUBLIC_ROUTES = [
  "/login",
  "/home-office",
  "/account-opening",
  // Impersonated client portal opens in a new tab and inherits the advisor's
  // session — never bounce it to the sign-in screen.
  "/investor360-portal",
];

function AuthGate({
  authChecked,
  hasSession,
  children,
}: {
  authChecked: boolean;
  hasSession: boolean;
  children: ReactNode;
}) {
  const user = useAuthUser();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const isPublic = PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const hasAppSession = hasSession || Boolean(user);

  useEffect(() => {
    if (!authChecked) return;

    if (!hasAppSession && !isPublic) {
      navigate({ to: "/login", replace: true });
    } else if (hasAppSession && pathname === "/login") {
      navigate({ to: "/", replace: true });
    }
  }, [authChecked, hasAppSession, isPublic, pathname, navigate]);

  if (!isPublic && (!authChecked || !hasAppSession)) return null;
  if (isPublic && hasAppSession && pathname === "/login") return null;

  return <>{children}</>;
}
