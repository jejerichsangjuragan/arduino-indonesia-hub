// Full-stack feature: client sends validated base64 payload to a protected tRPC mutation; bytes are stored in S3 and only metadata is persisted in MySQL.
import { useRef, useState } from "react";
import { Check, Download, FileUp, Loader2, LockKeyhole, UploadCloud } from "lucide-react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const accepted = ".png,.jpg,.jpeg,.webp,.pdf,.txt,.ino,.h,.cpp";

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileStorageUploader({ projectId }: { projectId?: number }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated, loading } = useAuth();
  const [context, setContext] = useState<"project" | "schematic" | "sketch" | "build-log">("build-log");
  const [uploading, setUploading] = useState(false);
  const filesQuery = trpc.files.listMine.useQuery(undefined, { enabled: isAuthenticated, staleTime: 15_000 });
  const upload = trpc.files.upload.useMutation({ onSuccess: async () => { await filesQuery.refetch(); toast.success("File tersimpan di File Storage."); }, onError: (error) => toast.error(error.message) });

  const onPick = async (file?: File) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) { toast.error("Ukuran file maksimal 10 MB."); return; }
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onerror = () => reject(new Error("File tidak dapat dibaca.")); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file); });
      const dataBase64 = dataUrl.split(",")[1] ?? "";
      await upload.mutateAsync({ fileName: file.name, mimeType: file.type || "application/octet-stream", sizeBytes: file.size, context, projectId, dataBase64 });
    } catch (error) { toast.error(error instanceof Error ? error.message : "Upload gagal."); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ""; }
  };

  if (loading) return <div className="file-dropzone"><Loader2 className="mx-auto size-5 animate-spin text-primary" /><p className="mt-3 text-sm text-muted-foreground">Memeriksa akses builder...</p></div>;
  if (!isAuthenticated) return <div className="file-dropzone"><LockKeyhole className="mx-auto size-7 text-primary" /><h3 className="mt-4 font-extrabold">Login untuk mengunggah build log</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">File disimpan atas nama akunmu, sehingga sketch dan skematik tetap mudah kamu temukan.</p><Button onClick={() => startLogin()} className="mt-5 rounded-full">Masuk sebagai builder</Button></div>;

  return <div className="file-storage-panel"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="eyebrow text-primary">File Storage / private workspace</p><h3 className="mt-3 text-2xl font-extrabold tracking-tight">Lampirkan file ke build-mu.</h3><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Upload foto rangkaian, PDF skematik, atau sketch Arduino. Batas 10 MB per file.{projectId ? " File akan terhubung ke proyek ini." : " Buat draft proyek terlebih dahulu untuk mengaitkan evidence."}</p></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><UploadCloud className="size-4 text-primary" /> S3-backed</div></div><div className="mt-7 flex flex-wrap gap-2"><select value={context} onChange={(e) => setContext(e.target.value as typeof context)} className="select-control"><option value="build-log">Build log</option><option value="project">Project code</option><option value="schematic">Schematic</option><option value="sketch">Arduino sketch</option></select><input ref={inputRef} type="file" accept={accepted} className="hidden" onChange={(e) => onPick(e.target.files?.[0])} /><Button onClick={() => inputRef.current?.click()} disabled={uploading} className="rounded-full">{uploading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <FileUp className="mr-2 size-4" />}{uploading ? "Mengunggah..." : "Pilih file"}</Button></div>{filesQuery.data && filesQuery.data.length > 0 && <div className="mt-7 divide-y divide-border rounded-2xl border border-border bg-background">{filesQuery.data.map((file) => <div key={file.id} className="flex items-center gap-3 p-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Check className="size-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{file.originalName}</p><p className="text-[11px] text-muted-foreground">{file.context} · {formatBytes(file.sizeBytes)}</p></div><a href={file.url} target="_blank" rel="noreferrer" className="rounded-full p-2 text-primary hover:bg-secondary" aria-label={`Unduh ${file.originalName}`}><Download className="size-4" /></a></div>)}</div>}</div>;
}
