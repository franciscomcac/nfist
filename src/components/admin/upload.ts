import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

function sanitize(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export async function uploadToBucket(
  bucket: "media" | "repository",
  folder: string,
  file: File,
): Promise<string> {
  const path = `${folder}/${Date.now()}-${sanitize(file.name)}`;
  const { error: upErr } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (upErr) throw upErr;
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, TEN_YEARS);
  if (error || !data) throw error ?? new Error("Não foi possível gerar link");
  return data.signedUrl;
}
