import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRoles } from "@/lib/auth";
import { createAppUser, deleteAppUser, listAppUsers } from "@/lib/admin-users.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/utilizadores")({
  component: UsersAdmin,
});

type AppUser = {
  id: string;
  email: string;
  created_at: string;
  roles: { id: string; role: "admin" | "editor"; section_slug: string | null }[];
};

function UsersAdmin() {
  const { isAdmin, loading: rolesLoading, session } = useRoles();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");
  const [sectionSlug, setSectionSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const list = await listAppUsers();
      setUsers(list as AppUser[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin]);

  function suggestPassword() {
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    setPassword(btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, "").slice(0, 14));
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await createAppUser({
        data: {
          email: email.trim(),
          password,
          role,
          section_slug: role === "editor" ? sectionSlug.trim() || null : null,
        },
      });
      setNotice(`Conta criada para ${email}. Partilha a palavra-passe temporária: ${password}`);
      setEmail("");
      setPassword("");
      setSectionSlug("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setBusy(false);
    }
  }

  async function remove(u: AppUser) {
    if (!confirm(`Eliminar ${u.email}? Esta acção é irreversível.`)) return;
    try {
      await deleteAppUser({ data: { userId: u.id } });
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro");
    }
  }

  if (rolesLoading) return <p className="text-muted-foreground">A carregar…</p>;
  if (!isAdmin) return <p className="text-muted-foreground">Apenas administradores podem gerir utilizadores.</p>;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
      <h1 className="font-serif text-3xl sm:text-4xl mt-2 mb-6 sm:mb-8">Utilizadores</h1>

      <form onSubmit={add} className="border border-hairline p-4 sm:p-6 mb-8 bg-background/60">
        <h2 className="font-serif text-xl mb-4">Adicionar colaborador</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="uemail">Email</Label>
            <Input id="uemail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="upass">Palavra-passe temporária</Label>
            <div className="flex gap-2">
              <Input id="upass" type="text" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="min-w-0 flex-1" />
              <Button type="button" variant="outline" onClick={suggestPassword} className="shrink-0">Gerar</Button>
            </div>
          </div>
          <div>
            <Label htmlFor="urole">Papel</Label>
            <select
              id="urole"
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "editor")}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <Label htmlFor="usec">Secção (opcional para editor)</Label>
            <Input id="usec" value={sectionSlug} onChange={(e) => setSectionSlug(e.target.value)} placeholder="ex.: circo" disabled={role !== "editor"} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          A conta é criada imediatamente. Partilha o email e a palavra-passe temporária com o colaborador; ele poderá alterá-la depois.
        </p>
        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        {notice && <p className="text-sm text-emerald-500 mt-3 break-all">{notice}</p>}
        <Button type="submit" disabled={busy} className="mt-4 w-full sm:w-auto">{busy ? "…" : "Criar conta"}</Button>
      </form>

      <div className="border border-hairline overflow-x-auto -mx-4 sm:mx-0" data-lenis-prevent>
        <table className="w-full text-sm min-w-[520px]">
          <thead className="bg-foreground/5 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-normal">Email</th>
              <th className="px-4 py-3 font-normal">Papel</th>
              <th className="px-4 py-3 font-normal">Secção</th>
              <th className="px-4 py-3 text-right font-normal">Acções</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-6 text-muted-foreground">A carregar…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-muted-foreground">Nenhum utilizador.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t border-hairline hover:bg-foreground/5">
                  <td className="px-4 py-3 break-all">{u.email}{u.id === session?.user.id && <span className="ml-2 text-xs text-muted-foreground">(tu)</span>}</td>
                  <td className="px-4 py-3">{u.roles.map((r) => r.role).join(", ") || <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-4 py-3">{u.roles.map((r) => r.section_slug).filter(Boolean).join(", ") || <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-4 py-3 text-right">
                    {u.id !== session?.user.id && (
                      <button onClick={() => remove(u)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500">
                        <Trash2 size={12} /> Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
