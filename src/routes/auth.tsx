import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { bootstrapFirstAdmin, hasAnyAdmin } from "@/lib/admin-users.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Entrar — NFIST" }, { name: "robots", content: "noindex" }] }),
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bootstrapNeeded, setBootstrapNeeded] = useState<boolean | null>(null);
  const [bootstrapDone, setBootstrapDone] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/admin" });
  }, [session, loading, navigate]);

  useEffect(() => {
    hasAnyAdmin()
      .then((r) => setBootstrapNeeded(!r.hasAdmin))
      .catch(() => setBootstrapNeeded(false));
  }, []);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }

  async function bootstrap(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await bootstrapFirstAdmin({ data: { email, password } });
      setBootstrapDone(true);
      setBootstrapNeeded(false);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container-page min-h-[70vh] flex items-center justify-center py-12 sm:py-20">
      <div className="w-full max-w-md border border-hairline p-6 sm:p-10 bg-background/60">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Área reservada</p>
        <h1 className="font-serif text-3xl mb-2">
          {bootstrapNeeded ? "Configuração inicial" : "Entrar"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {bootstrapNeeded
            ? "Define a primeira conta de administrador. Só é possível uma vez."
            : "Acesso restrito à equipa do NFIST."}
        </p>

        <form onSubmit={bootstrapNeeded ? bootstrap : signIn} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Palavra-passe</Label>
            <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {bootstrapDone && <p className="text-sm text-emerald-500">Conta criada.</p>}
          <Button type="submit" disabled={busy || bootstrapNeeded === null} className="w-full">
            {busy ? "…" : bootstrapNeeded ? "Criar administrador" : "Entrar"}
          </Button>
        </form>

        {!bootstrapNeeded && (
          <p className="mt-6 text-xs text-muted-foreground">
            Sem conta? O acesso é criado por um administrador em <em>Utilizadores</em>. Contacta a equipa do NFIST.
          </p>
        )}

        <div className="mt-8 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← Voltar ao site</Link>
        </div>
      </div>
    </main>
  );
}
