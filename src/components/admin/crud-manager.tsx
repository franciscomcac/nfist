import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2, Pencil, Plus, ChevronDown, ChevronRight, Info } from "lucide-react";
import {
  ImageField,
  GalleryField,
  FileField,
  ParagraphsField,
  TitleBodyField,
  KeyValueField,
  TagsField,
} from "./field-editors";

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "url"
  | "date"
  | "image"
  | "gallery"
  | "file"
  | "paragraphs"
  | "titlebody"
  | "keyvalue"
  | "tags"
  | "section";

export type FieldDef = {
  key: string;
  label: string;
  kind: FieldKind;
  help?: string;
  placeholder?: string;
  advanced?: boolean;
  // for titlebody/keyvalue subfield labels
  labels?: { a?: string; b?: string };
};

export type Row = Record<string, any>;

type Props = {
  title: string;
  intro?: string;
  table: string;
  pk: string;
  uploadFolder: string;
  fields: FieldDef[];
  listColumns: { key: string; label: string }[];
  orderBy?: { column: string; ascending?: boolean };
  emptyRow: () => Row;
  canDelete?: boolean;
  canCreate?: boolean;
};

function asArray<T>(v: unknown, fallback: T[] = []): T[] {
  return Array.isArray(v) ? (v as T[]) : fallback;
}

export function CrudManager({
  title,
  intro,
  table,
  pk,
  uploadFolder,
  fields,
  listColumns,
  orderBy,
  emptyRow,
  canDelete = true,
  canCreate = true,
}: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [values, setValues] = useState<Row>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sections, setSections] = useState<{ slug: string; name: string }[]>([]);

  async function load() {
    setLoading(true);
    let q = (supabase as any).from(table).select("*");
    if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? true });
    const { data, error } = await q;
    if (error) setError(error.message);
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    if (fields.some((f) => f.kind === "section")) {
      void supabase
        .from("sections")
        .select("slug, name")
        .order("sort_order")
        .then(({ data }) => setSections((data as any) ?? []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  function openEdit(row: Row) {
    setIsNew(false);
    setEditing(row);
    setValues({ ...row });
    setShowAdvanced(false);
    setError(null);
  }

  function openNew() {
    setIsNew(true);
    const row = emptyRow();
    setEditing(row);
    setValues({ ...row });
    setShowAdvanced(false);
    setError(null);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const payload: Row = {};
      for (const f of fields) {
        const v = values[f.key];
        if (f.kind === "number") payload[f.key] = v === "" || v == null ? null : Number(v);
        else if (f.kind === "boolean") payload[f.key] = !!v;
        else if (["gallery", "paragraphs", "titlebody", "keyvalue", "tags"].includes(f.kind)) {
          payload[f.key] = asArray(v);
        } else {
          payload[f.key] = v === "" ? null : v;
        }
      }
      if (isNew) {
        const { error } = await (supabase as any).from(table).insert(payload);
        if (error) throw error;
      } else {
        const id = editing[pk];
        const { error } = await (supabase as any).from(table).update(payload).eq(pk, id as string);
        if (error) throw error;
      }
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao guardar");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: Row) {
    if (!confirm("Eliminar este registo? Esta acção não pode ser desfeita.")) return;
    const { error } = await (supabase as any).from(table).delete().eq(pk, row[pk] as string);
    if (error) {
      alert(error.message);
      return;
    }
    await load();
  }

  const set = (key: string, v: unknown) => setValues((prev) => ({ ...prev, [key]: v }));

  function renderField(f: FieldDef) {
    const v = values[f.key];
    switch (f.kind) {
      case "textarea":
        return (
          <Textarea
            id={f.key}
            value={v ?? ""}
            placeholder={f.placeholder}
            onChange={(e) => set(f.key, e.target.value)}
            rows={4}
          />
        );
      case "boolean":
        return (
          <div className="flex items-center gap-3 pt-1">
            <Switch checked={!!v} onCheckedChange={(c) => set(f.key, c)} id={f.key} />
            <span className="text-sm text-muted-foreground">{v ? "Sim" : "Não"}</span>
          </div>
        );
      case "number":
        return (
          <Input
            id={f.key}
            type="number"
            value={v ?? ""}
            placeholder={f.placeholder}
            onChange={(e) => set(f.key, e.target.value)}
          />
        );
      case "date":
        return (
          <Input
            id={f.key}
            type="date"
            value={v ?? ""}
            onChange={(e) => set(f.key, e.target.value)}
          />
        );
      case "url":
        return (
          <Input
            id={f.key}
            type="url"
            value={v ?? ""}
            placeholder={f.placeholder ?? "https://…"}
            onChange={(e) => set(f.key, e.target.value)}
          />
        );
      case "image":
        return <ImageField value={v ?? null} onChange={(u) => set(f.key, u)} folder={uploadFolder} />;
      case "gallery":
        return <GalleryField value={asArray<string>(v)} onChange={(u) => set(f.key, u)} folder={uploadFolder} />;
      case "file":
        return <FileField value={v ?? null} onChange={(u) => set(f.key, u)} folder={uploadFolder} />;
      case "paragraphs":
        return <ParagraphsField value={asArray<string>(v)} onChange={(u) => set(f.key, u)} placeholder={f.placeholder} />;
      case "titlebody":
        return (
          <TitleBodyField
            value={asArray<{ title: string; body: string }>(v)}
            onChange={(u) => set(f.key, u)}
            titleLabel={f.labels?.a}
            bodyLabel={f.labels?.b}
          />
        );
      case "keyvalue":
        return (
          <KeyValueField
            value={asArray<{ label: string; value: string }>(v)}
            onChange={(u) => set(f.key, u)}
            keyLabel={f.labels?.a}
            valueLabel={f.labels?.b}
          />
        );
      case "tags":
        return <TagsField value={asArray<string>(v)} onChange={(u) => set(f.key, u)} placeholder={f.placeholder} />;
      case "section":
        return (
          <select
            id={f.key}
            value={v ?? ""}
            onChange={(e) => set(f.key, e.target.value || null)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">— Nenhuma —</option>
            {sections.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        );
      case "text":
      default:
        return (
          <Input
            id={f.key}
            value={v ?? ""}
            placeholder={f.placeholder}
            onChange={(e) => set(f.key, e.target.value)}
          />
        );
    }
  }

  const basicFields = fields.filter((f) => !f.advanced);
  const advancedFields = fields.filter((f) => f.advanced);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
          <h1 className="font-serif text-3xl sm:text-4xl mt-2">{title}</h1>
        </div>
        {canCreate && (
          <Button onClick={openNew} className="self-start sm:self-auto">
            <Plus size={14} className="mr-1" /> Novo
          </Button>
        )}
      </div>

      {intro && (
        <div className="mb-6 flex gap-2 items-start text-xs text-muted-foreground border border-hairline rounded-md p-3 bg-foreground/5">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>{intro}</p>
        </div>
      )}

      {error && !editing && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <div className="border border-hairline overflow-x-auto -mx-4 sm:mx-0" data-lenis-prevent>
        <table className="w-full text-sm min-w-[520px]">
          <thead className="bg-foreground/5 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {listColumns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-normal">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-normal">Acções</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={listColumns.length + 1} className="p-6 text-muted-foreground">
                  A carregar…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={listColumns.length + 1} className="p-6 text-muted-foreground">
                  Nenhum registo.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={String(r[pk])} className="border-t border-hairline hover:bg-foreground/5">
                  {listColumns.map((c) => (
                    <td key={c.key} className="px-4 py-3 align-top max-w-[280px] truncate">
                      {typeof r[c.key] === "boolean" ? (r[c.key] ? "Sim" : "Não") : String(r[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(r)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mr-4">
                      <Pencil size={12} /> Editar
                    </button>
                    {canDelete && (
                      <button onClick={() => remove(r)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500">
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

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent data-lenis-prevent className="max-w-3xl w-[calc(100vw-1.5rem)] max-h-[90vh] overflow-y-auto overscroll-contain p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>{isNew ? `Novo — ${title}` : `Editar — ${title}`}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {basicFields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key} className="text-sm font-medium">
                  {f.label}
                </Label>
                {f.help && <p className="text-xs text-muted-foreground leading-relaxed">{f.help}</p>}
                {renderField(f)}
              </div>
            ))}

            {advancedFields.length > 0 && (
              <div className="border-t border-hairline pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdvanced((s) => !s)}
                  className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  {showAdvanced ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  Opções avançadas
                </button>
                {showAdvanced && (
                  <div className="mt-4 space-y-5">
                    {advancedFields.map((f) => (
                      <div key={f.key} className="space-y-1.5">
                        <Label htmlFor={f.key} className="text-sm font-medium">
                          {f.label}
                        </Label>
                        {f.help && <p className="text-xs text-muted-foreground leading-relaxed">{f.help}</p>}
                        {renderField(f)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "A guardar…" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
