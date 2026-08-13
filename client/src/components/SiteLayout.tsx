// Design note: Sirkuit Editorial — asymmetric navigation, technical labels, cyan signal accents, and warm paper-like surfaces.
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Moon, Search, Sun, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tutorials, projects, products } from "@/lib/content";
import { useTheme } from "@/contexts/ThemeContext";

const navItems = [{ href: "/", label: "Beranda" }, { href: "/tutorials", label: "Tutorial" }, { href: "/projects", label: "Proyek" }, { href: "/shop", label: "Toko Kit" }];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return [...tutorials.map((x) => ({ ...x, kind: "Tutorial", href: "/tutorials" })), ...projects.map((x) => ({ ...x, kind: "Proyek", href: "/projects" })), ...products.map((x) => ({ ...x, kind: "Produk", href: "/shop" }))].filter((x) => `${(x as any).title || (x as any).name} ${(x as any).category || (x as any).description || ""}`.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  useEffect(() => setMenuOpen(false), [location]);

  return <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="container flex h-[76px] items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Arduino Indonesia beranda">
          <span className="brand-mark"><img src="/manus-storage/arduino-signal-mark_b16626aa.png" alt="" /></span>
          <span className="hidden text-[13px] font-extrabold tracking-[-0.04em] sm:block">arduino<span className="text-primary">.co.id</span></span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigasi utama">
          {navItems.map((item) => <Link key={item.href} href={item.href} className={`nav-link ${location === item.href ? "nav-link-active" : ""}`}>{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari tutorial, proyek..." className="h-10 w-[210px] rounded-full border-border bg-muted/50 pl-9 text-xs" aria-label="Cari konten" />
            {results.length > 0 && <div className="absolute right-0 top-12 w-[310px] overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-xl">
              {results.map((result: any) => <Link key={`${result.kind}-${result.id}`} href={result.href} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm hover:bg-muted"><span className="min-w-0 truncate font-semibold">{result.title || result.name}</span><span className="ml-3 shrink-0 text-[10px] uppercase tracking-[.12em] text-primary">{result.kind}</span></Link>)}
            </div>}
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSearchOpen(!searchOpen)} aria-label="Buka pencarian"><Search className="size-4" /></Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme} aria-label="Ganti tema">{theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}</Button>
          <Link href="/shop" className="hidden rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 active:scale-95 sm:block">Mulai Build <ArrowUpRight className="ml-1 inline size-3.5" /></Link>
          <Button variant="ghost" size="icon" className="rounded-full lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Buka menu">{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {searchOpen && <div className="border-t border-border p-3 md:hidden"><Input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari tutorial, proyek, produk..." className="rounded-xl" />{results.length > 0 && <div className="mt-2 rounded-xl border border-border bg-card p-2">{results.map((result: any) => <Link key={`${result.kind}-${result.id}`} href={result.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-muted">{result.title || result.name}</Link>)}</div>}</div>}
      {menuOpen && <nav className="border-t border-border bg-background p-4 lg:hidden">{navItems.map((item) => <Link key={item.href} href={item.href} className="block border-b border-border py-3 text-sm font-bold">{item.label}</Link>)}<Link href="/shop" className="mt-4 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground">Mulai Build</Link></nav>}
    </header>
    <main>{children}</main>
    <footer className="border-t border-border bg-card">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div><div className="mb-4 flex items-center gap-3"><span className="brand-mark brand-mark-sm"><img src="/manus-storage/arduino-signal-mark_b16626aa.png" alt="" /></span><strong>arduino<span className="text-primary">.co.id</span></strong></div><p className="max-w-xs text-sm leading-7 text-muted-foreground">Ruang belajar dan bengkel digital untuk siapa pun yang ingin mengubah ide menjadi robot nyata.</p></div>
        <div><p className="eyebrow mb-4">Explore</p><div className="space-y-3 text-sm text-muted-foreground"><Link href="/tutorials" className="block hover:text-primary">Tutorial & Edukasi</Link><Link href="/projects" className="block hover:text-primary">Showcase Proyek</Link><Link href="/shop" className="block hover:text-primary">Katalog Komponen</Link></div></div>
        <div><p className="eyebrow mb-4">Community</p><div className="space-y-3 text-sm text-muted-foreground"><a href="#" className="block hover:text-primary">Forum Diskusi</a><a href="#" className="block hover:text-primary">Instagram</a><a href="#" className="block hover:text-primary">YouTube</a></div></div>
        <div><p className="eyebrow mb-4">Tetap terhubung</p><p className="mb-4 text-sm leading-6 text-muted-foreground">Dapatkan build log, tutorial baru, dan drop kit langsung di inbox.</p><div className="flex gap-2"><Input placeholder="email@kamu.id" className="h-10 rounded-xl bg-background text-xs" /><Button className="h-10 rounded-xl px-4">Kirim</Button></div></div>
      </div>
      <div className="container flex flex-col justify-between gap-3 border-t border-border py-5 text-xs text-muted-foreground sm:flex-row"><span>© 2026 Arduino Indonesia Hub. Dibuat untuk para builder.</span><span>Belajar · Merakit · Berbagi</span></div>
    </footer>
  </div>;
}
