import Link from "next/link";
import { Accessibility, ChevronRight, Home, Languages, Menu, MoreVertical, Search } from "lucide-react";
import { Container } from "./ui";
import { DemoLoginModal } from "./demo-login-modal";

export function DemoBanner() {
  return <p className="sr-only">Demonstração acadêmica com dados exclusivamente fictícios.</p>;
}

export function AppHeader() {
  return <header className="site-header">
    <div className="header-top-row">
      <div className="header-brand-group">
        <Link href="/" aria-label="GOV.BR — início" className="header-logo"><span className="header-wordmark">
  <strong className="brand-demo">
  <span className="brand-blue">g</span>
  <span className="brand-yellow">o</span>
  <span className="brand-green">v</span>
  <span className="brand-blue"></span>
  <span className="brand-yellow">.</span>
  <span>br</span>
</strong>
  <small></small>
</span></Link>
        <MoreVertical aria-hidden="true" className="header-dots" /><span aria-hidden="true" className="header-divider" />
      </div>
      <div className="header-actions"><button type="button" aria-label="Acessibilidade" className="header-icon"><Accessibility /></button><button type="button" aria-label="Idioma" className="header-icon"><Languages /></button><DemoLoginModal /></div>
    </div>
    <div className="header-nav-row"><div className="header-section-name"><Menu aria-hidden="true" /><span>Ministério da Fazenda</span></div><button type="button" aria-label="Pesquisar" className="header-search"><Search /></button></div>
  </header>;
}

export function SecondaryNav({ title }: { title: string }) { return <nav aria-label="Seção" className="border-b border-[var(--color-border)] bg-white"><Container className="py-3 text-sm text-[var(--color-muted)]">{title}</Container></nav>; }
export function Breadcrumbs({ items }: { items: readonly string[] }) { return <nav aria-label="Navegação estrutural" className="text-[12px] leading-[18px] text-[#3665a8]"><ol className="flex flex-wrap items-center gap-x-2 gap-y-1"><li aria-hidden="true"><Home className="size-3.5 fill-current" /></li>{items.slice(1).map((item, index) => <li className="flex items-center gap-2" key={`${item}-${index}`}><ChevronRight aria-hidden="true" className="size-3.5 text-[#8a939e]" /><span className={index === items.length - 2 ? "font-semibold text-[#20252b]" : ""}>{item}</span></li>)}</ol></nav>; }

const footerLinks = ["Novo Desenrola Brasil", "Renegociação de Dívidas", "Ministério da Fazenda"];
export function Footer() {
  return <footer className="mt-auto bg-[#102f60] text-white"><div className="px-6 py-9">
    <div className="font-[Arial,sans-serif] text-[30px] leading-9 font-bold italic tracking-[-0.04em]">gov.br</div>
    <div className="mt-7 border-t border-white/30 pt-7">
  <h2 className="text-[16px] leading-5 font-bold uppercase tracking-[-0.02em] text-white">
    ASSUNTOS
  </h2>

  <div className="mt-5 border-t border-white/25">
    {footerLinks.map((label) => (
      <div
        key={label}
        className="flex min-h-[57px] items-center border-b border-white/25 text-[16px] leading-6"
      >
        <span>{label}</span>
      </div>
    ))}
  </div>
</div>
    
  </div></footer>;
}
