import { Alert } from "./feedback";
import { Breadcrumbs, SecondaryNav } from "./layout";
import { Card, Container } from "./ui";

export function PagePlaceholder({ title, route, description, isolated = false }: { title: string; route: string; description: string; isolated?: boolean }) {
  return <><SecondaryNav title={title} /><main><Container className="grid gap-6 py-10"><Breadcrumbs items={["Início", title]} /><Alert title="Fundação técnica concluída" variant={isolated ? "warning" : "info"}>{isolated ? "Esta jornada foi isolada do fluxo principal e usa somente fixtures locais." : "A implementação visual detalhada será feita nas próximas fases."}</Alert><Card><p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">{route}</p><h1 className="mt-2 text-2xl font-bold text-[var(--color-primary-dark)]">{title}</h1><p className="mt-3 max-w-2xl text-[var(--color-muted)]">{description}</p></Card></Container></main></>;
}
