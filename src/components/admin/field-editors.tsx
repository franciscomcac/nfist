import { useRef, useState, type DragEvent } from "react";
import { Upload, X, Plus, ArrowUp, ArrowDown, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadToBucket } from "./upload";

type Bucket = "media" | "repository";

function DropZone({
  onFiles,
  hint,
  accept,
  multiple,
}: {
  onFiles: (files: File[]) => void | Promise<void>;
  hint: string;
  accept?: string;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handle(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      await onFiles(Array.from(files));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      onDragOver={(e: DragEvent) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e: DragEvent) => {
        e.preventDefault();
        setOver(false);
        void handle(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer border border-dashed rounded-md px-4 py-6 text-center text-sm transition-colors ${
        over ? "border-foreground bg-foreground/5" : "border-hairline hover:bg-foreground/5"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={(e) => void handle(e.target.files)}
      />
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        {busy ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
        <p className="text-xs">
          {busy ? "A carregar…" : hint}
        </p>
      </div>
    </div>
  );
}

/* -------------------------- Single image -------------------------- */
export function ImageField({
  value,
  onChange,
  folder,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  folder: string;
}) {
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full max-w-sm">
          <img src={value} alt="" className="w-full h-40 object-cover rounded-md border border-hairline" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-background/90 border border-hairline rounded-full p-1 hover:bg-background"
            aria-label="Remover imagem"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <DropZone
          hint="Arraste uma imagem ou clique para escolher (JPG, PNG, WebP)"
          accept="image/*"
          onFiles={async (files) => {
            setError(null);
            try {
              const url = await uploadToBucket("media", folder, files[0]);
              onChange(url);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Erro no upload");
            }
          }}
        />
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* -------------------------- Gallery -------------------------- */
export function GalleryField({
  value,
  onChange,
  folder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  folder: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const items = value ?? [];

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {items.map((url, i) => (
            <div key={`${url}-${i}`} className="relative group border border-hairline rounded-md overflow-hidden">
              <img src={url} alt="" className="w-full h-24 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                <button type="button" onClick={() => move(i, -1)} className="bg-background/90 border border-hairline rounded p-1" aria-label="Mover para cima"><ArrowUp size={12} /></button>
                <button type="button" onClick={() => move(i, 1)} className="bg-background/90 border border-hairline rounded p-1" aria-label="Mover para baixo"><ArrowDown size={12} /></button>
                <button type="button" onClick={() => onChange(items.filter((_, k) => k !== i))} className="bg-background/90 border border-hairline rounded p-1" aria-label="Remover"><X size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <DropZone
        hint="Arraste várias imagens ou clique para escolher"
        accept="image/*"
        multiple
        onFiles={async (files) => {
          setError(null);
          try {
            const uploaded: string[] = [];
            for (const f of files) uploaded.push(await uploadToBucket("media", folder, f));
            onChange([...items, ...uploaded]);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Erro no upload");
          }
        }}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* -------------------------- Single file (repository) -------------------------- */
export function FileField({
  value,
  onChange,
  folder,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  folder: string;
}) {
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex items-center gap-3 border border-hairline rounded-md p-3">
          <FileText size={16} className="text-muted-foreground shrink-0" />
          <a href={value} target="_blank" rel="noreferrer" className="text-xs underline truncate flex-1">
            Ver ficheiro carregado
          </a>
          <button type="button" onClick={() => onChange(null)} className="text-muted-foreground hover:text-red-500" aria-label="Remover ficheiro">
            <X size={14} />
          </button>
        </div>
      ) : (
        <DropZone
          hint="Arraste um ficheiro (PDF, DOCX, imagem, etc.) ou clique para escolher"
          onFiles={async (files) => {
            setError(null);
            try {
              const url = await uploadToBucket("repository", folder, files[0]);
              onChange(url);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Erro no upload");
            }
          }}
        />
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* -------------------------- Paragraphs list -------------------------- */
export function ParagraphsField({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const items = value ?? [];
  return (
    <div className="space-y-2">
      {items.map((p, i) => (
        <div key={i} className="flex gap-2 items-start">
          <span className="text-xs text-muted-foreground pt-3 w-6 shrink-0 text-right">{i + 1}.</span>
          <Textarea
            value={p}
            placeholder={placeholder}
            onChange={(e) => {
              const next = items.slice();
              next[i] = e.target.value;
              onChange(next);
            }}
            rows={3}
            className="flex-1"
          />
          <button type="button" onClick={() => onChange(items.filter((_, k) => k !== i))} className="text-muted-foreground hover:text-red-500 mt-3" aria-label="Remover"><X size={14} /></button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ""])}>
        <Plus size={14} className="mr-1" /> Adicionar parágrafo
      </Button>
    </div>
  );
}

/* -------------------------- Title + body list -------------------------- */
export function TitleBodyField({
  value,
  onChange,
  titleLabel = "Título",
  bodyLabel = "Descrição",
}: {
  value: { title: string; body: string }[];
  onChange: (v: { title: string; body: string }[]) => void;
  titleLabel?: string;
  bodyLabel?: string;
}) {
  const items = value ?? [];
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-hairline rounded-md p-3 space-y-2 relative">
          <button type="button" onClick={() => onChange(items.filter((_, k) => k !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-red-500" aria-label="Remover"><X size={14} /></button>
          <div>
            <label className="text-xs text-muted-foreground">{titleLabel}</label>
            <Input
              value={item.title ?? ""}
              onChange={(e) => {
                const next = items.slice();
                next[i] = { ...item, title: e.target.value };
                onChange(next);
              }}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">{bodyLabel}</label>
            <Textarea
              value={item.body ?? ""}
              rows={2}
              onChange={(e) => {
                const next = items.slice();
                next[i] = { ...item, body: e.target.value };
                onChange(next);
              }}
            />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, { title: "", body: "" }])}>
        <Plus size={14} className="mr-1" /> Adicionar item
      </Button>
    </div>
  );
}

/* -------------------------- Key/value list -------------------------- */
export function KeyValueField({
  value,
  onChange,
  keyLabel = "Etiqueta",
  valueLabel = "Valor",
}: {
  value: { label: string; value: string }[];
  onChange: (v: { label: string; value: string }[]) => void;
  keyLabel?: string;
  valueLabel?: string;
}) {
  const items = value ?? [];
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
          <Input
            placeholder={keyLabel}
            value={item.label ?? ""}
            onChange={(e) => {
              const next = items.slice();
              next[i] = { ...item, label: e.target.value };
              onChange(next);
            }}
          />
          <Input
            placeholder={valueLabel}
            value={item.value ?? ""}
            onChange={(e) => {
              const next = items.slice();
              next[i] = { ...item, value: e.target.value };
              onChange(next);
            }}
          />
          <button type="button" onClick={() => onChange(items.filter((_, k) => k !== i))} className="text-muted-foreground hover:text-red-500" aria-label="Remover"><X size={14} /></button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, { label: "", value: "" }])}>
        <Plus size={14} className="mr-1" /> Adicionar linha
      </Button>
    </div>
  );
}

/* -------------------------- Tags (list of short strings) -------------------------- */
export function TagsField({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const items = value ?? [];
  const [draft, setDraft] = useState("");
  function add() {
    const t = draft.trim();
    if (!t) return;
    onChange([...items, t]);
    setDraft("");
  }
  return (
    <div className="space-y-2">
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-foreground/10 rounded-full px-3 py-1 text-xs">
              {t}
              <button type="button" onClick={() => onChange(items.filter((_, k) => k !== i))} className="hover:text-red-500" aria-label="Remover">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder ?? "Escreva e prima Enter"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={add}>Adicionar</Button>
      </div>
    </div>
  );
}
