import { useState } from "react";
import { Redirect } from "wouter";
import {
  LayoutDashboard,
  Globe,
  Users,
  CreditCard,
  LogOut,
  ArrowUpRight,
  Plus,
  Search,
  Trash2,
  LoaderCircle,
  Download,
  Clock3,
  CheckCircle2,
  X,
  Menu,
} from "lucide-react";
import { Brand } from "../components/brand";
import { useLanguage } from "../lib/i18n";
import { authClient } from "../lib/auth";
import {
  useHistory,
  useLeads,
  useCustomer,
  useCreateLead,
  useUpdateLead,
  useRemoveLead,
  usePortal,
} from "../queries/platform";
import { AuditForm, AuditReport, type AuditResult } from "../components/audit";
import { Pricing } from "../components/pricing";
import { Dialog } from "../components/dialog";
type Lead = {
  id: string;
  userId: string;
  name: string;
  email: string;
  company: string;
  status: string;
  note: string;
  createdAt: number;
};
function Loading() {
  return (
    <div className="loading-state">
      <LoaderCircle size={25} className="spin" />
    </div>
  );
}
function PrivateDashboard() {
  const { t, lang, setLang } = useLanguage();
  const { data: session } = authClient.useSession();
  const [tab, setTab] = useState(
    new URLSearchParams(window.location.search).get("tab") ?? "overview",
  );
  const [mobile, setMobile] = useState(false);
  const history = useHistory();
  const leads = useLeads();
  const customer = useCustomer();
  const [report, setReport] = useState<AuditResult | null>(null);
  const [edit, setEdit] = useState<Lead | null | undefined>(undefined);
  const [remove, setRemove] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const removeLead = useRemoveLead();
  const portal = usePortal();
  const [signingOut, setSigningOut] = useState(false);
  const tabs = [
    { id: "overview", Icon: LayoutDashboard, title: t("Tableau de bord", "Painel") },
    { id: "audits", Icon: Globe, title: t("Analyses de sites", "Análises de sites") },
    { id: "crm", Icon: Users, title: t("Contacts & CRM", "Contactos & CRM") },
    { id: "billing", Icon: CreditCard, title: t("Abonnement", "Assinatura") },
  ];
  const statuses = [
    ["new", t("Nouveau", "Novo")],
    ["contacted", t("Contacté", "Contactado")],
    ["qualified", t("Qualifié", "Qualificado")],
    ["won", t("Gagné", "Ganho")],
  ];
  const data = leads.data ?? [];
  const filtered = data.filter((l) =>
    `${l.name} ${l.email} ${l.company}`.toLowerCase().includes(search.toLowerCase()),
  );
  const results = history.data ?? [];
  const active = customer.data?.subscriptions?.find((s) => s.status === "active");
  const paid = !!customer.data?.balances?.lux_crm;
  const balance = customer.data?.balances?.lux_audits;
  const changeTab = (id: string) => {
    setTab(id);
    setMobile(false);
    window.history.replaceState(null, "", `/dashboard?tab=${id}`);
  };
  function exportCsv() {
    const rows = [
      ["Nom", "Email", "Entreprise", "Statut", "Note"],
      ...data.map((l) => [l.name, l.email, l.company, l.status, l.note]),
    ];
    const csv =
      "﻿" +
      rows
        .map((row) =>
          row
            .map((v) => '"' + (/^[=+@-]/.test(v) ? "'" + v : v).replaceAll('"', '""') + '"')
            .join(";"),
        )
        .join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = "luxgrowth-contacts.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  return (
    <div className="dashboard-shell">
      <aside className={`dashboard-sidebar ${mobile ? "visible" : ""}`}>
        <Brand />
        <span className="sidebar-caption">{t("VOTRE ESPACE", "O SEU PAINEL")}</span>
        <nav>
          {tabs.map(({ id, Icon, title }) => (
            <button key={id} className={tab === id ? "active" : ""} onClick={() => changeTab(id)}>
              <Icon size={19} />
              {title}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-upgrade">
            <span className="gold-dot" />
            <strong>{t("Votre prochain niveau", "O seu próximo nível")}</strong>
            <p>
              {t(
                "Les bons outils pour vos ambitions.",
                "As ferramentas certas para as suas ambições.",
              )}
            </p>
            <button onClick={() => changeTab("billing")}>
              {t("Voir les plans", "Ver planos")}
              <ArrowUpRight size={15} />
            </button>
          </div>
          <a href="/">
            {t("Retour au site", "Voltar ao site")}
            <ArrowUpRight size={15} />
          </a>
          <button
            disabled={signingOut}
            onClick={async () => {
              setSigningOut(true);
              await authClient.signOut();
              window.location.href = "/";
            }}
          >
            <LogOut size={17} />
            {t("Déconnexion", "Sair")}
          </button>
        </div>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <button className="mobile-menu" onClick={() => setMobile(!mobile)} aria-label="Menu">
            {mobile ? <X /> : <Menu />}
          </button>
          <span>{tabs.find((v) => v.id === tab)?.title}</span>
          <div>
            <span className="sandbox-tag">Sandbox</span>
            <button className="language" onClick={() => setLang(lang === "fr" ? "pt" : "fr")}>
              {lang.toUpperCase()} ⌄
            </button>
            <span className="avatar">{session?.user.name.slice(0, 2).toUpperCase()}</span>
          </div>
        </header>
        <main className="dashboard-content">
          <div className="dashboard-page-title">
            <div>
              <span className="eyebrow gold">
                {t("UNE PLATEFORME. VOTRE CROISSANCE.", "UMA PLATAFORMA. O SEU CRESCIMENTO.")}
              </span>
              <h1>
                {tab === "overview"
                  ? t(
                      `Bonjour, ${session?.user.name.split(" ")[0]}.`,
                      `Olá, ${session?.user.name.split(" ")[0]}.`,
                    )
                  : tabs.find((v) => v.id === tab)?.title}
              </h1>
              <p className="muted">
                {tab === "overview"
                  ? t(
                      "Une vision claire pour avancer, chaque jour.",
                      "Uma visão clara para avançar todos os dias.",
                    )
                  : tab === "crm"
                    ? t(
                        "Chaque contact est une nouvelle opportunité.",
                        "Cada contacto é uma nova oportunidade.",
                      )
                    : tab === "audits"
                      ? t(
                          "Comprenez votre site. Améliorez votre présence.",
                          "Compreenda o seu site. Melhore a sua presença.",
                        )
                      : t(
                          "Un plan à la mesure de vos ambitions.",
                          "Um plano à medida das suas ambições.",
                        )}
              </p>
            </div>
            {tab === "crm" && (
              <button
                className="button"
                onClick={() => {
                  createLead.reset();
                  updateLead.reset();
                  setEdit(null);
                }}
              >
                <Plus size={17} />
                {t("Nouveau contact", "Novo contacto")}
              </button>
            )}
          </div>
          {tab === "overview" && (
            <>
              <div className="dashboard-stats">
                {[
                  {
                    Icon: Globe,
                    label: t("Sites analysés", "Sites analisados"),
                    value: results.length,
                  },
                  { Icon: Users, label: t("Contacts CRM", "Contactos CRM"), value: data.length },
                  {
                    Icon: CheckCircle2,
                    label: t("Opportunités gagnées", "Oportunidades ganhas"),
                    value: data.filter((l) => l.status === "won").length,
                  },
                  {
                    Icon: Clock3,
                    label: t("Analyses restantes", "Análises restantes"),
                    value: balance?.remaining ?? "—",
                  },
                ].map(({ Icon, label, value }) => (
                  <div key={label}>
                    <span>
                      <Icon size={20} />
                      {label}
                    </span>
                    <strong>
                      {history.isLoading || leads.isLoading || customer.isLoading ? "…" : value}
                    </strong>
                    <small>
                      {t("Données réelles de votre espace", "Dados reais do seu painel")}
                    </small>
                  </div>
                ))}
              </div>
              <AuditForm
                onResult={(r) => {
                  setReport(r);
                  history.refetch();
                  customer.refetch();
                }}
              />
              <div className="dashboard-overview-grid">
                <section className="dashboard-card">
                  <div className="card-heading">
                    <h3>{t("Vos dernières analyses", "As últimas análises")}</h3>
                    <button onClick={() => changeTab("audits")}>
                      {t("Tout voir", "Ver tudo")}
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                  {history.isLoading ? (
                    <Loading />
                  ) : results.length ? (
                    <div className="history-list">
                      {results.slice(0, 4).map((r) => {
                        const a = JSON.parse(r.result) as AuditResult;
                        return (
                          <button key={r.id} onClick={() => setReport(a)}>
                            <Globe size={20} />
                            <div>
                              <strong>{new URL(r.url).hostname}</strong>
                              <small>{new Date(r.createdAt).toLocaleDateString(lang)}</small>
                            </div>
                            <span className="score-badge">{a.score}/100</span>
                            <ArrowUpRight size={16} />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <Globe size={30} />
                      <h3>
                        {t(
                          "Votre première analyse vous attend",
                          "A primeira análise espera por si",
                        )}
                      </h3>
                      <p>
                        {t(
                          "Entrez votre URL ci-dessus pour commencer.",
                          "Introduza o URL acima para começar.",
                        )}
                      </p>
                    </div>
                  )}
                  {history.isError && <p className="error">{history.error.message}</p>}
                </section>
                <section className="dashboard-card">
                  <div className="card-heading">
                    <h3>{t("Vos opportunités", "As suas oportunidades")}</h3>
                    <button onClick={() => changeTab("crm")}>
                      CRM
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                  {leads.isLoading ? (
                    <Loading />
                  ) : data.length ? (
                    <div className="pipeline">
                      {statuses.map(([id, name]) => (
                        <div key={id}>
                          <span>{name}</span>
                          <div>
                            <i
                              style={{
                                width: `${Math.max(3, (data.filter((l) => l.status === id).length / data.length) * 100)}%`,
                              }}
                            />
                          </div>
                          <strong>{data.filter((l) => l.status === id).length}</strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <Users size={30} />
                      <h3>{t("Votre réseau commence ici", "A sua rede começa aqui")}</h3>
                      <p>
                        {t(
                          "Ajoutez vos contacts pour suivre votre activité.",
                          "Adicione contactos para acompanhar o seu negócio.",
                        )}
                      </p>
                      <button className="text-link" onClick={() => changeTab("crm")}>
                        {t("Ouvrir le CRM", "Abrir CRM")}
                        <ArrowRightIcon />
                      </button>
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
          {tab === "audits" && (
            <>
              <AuditForm
                onResult={(r) => {
                  setReport(r);
                  history.refetch();
                  customer.refetch();
                }}
              />
              <section className="dashboard-card audit-history">
                <div className="card-heading">
                  <h3>{t("Historique des analyses", "Histórico de análises")}</h3>
                  <span className="muted">
                    {results.length} {t("analyses", "análises")}
                  </span>
                </div>
                {history.isLoading ? (
                  <Loading />
                ) : history.isError ? (
                  <div className="error">{history.error.message}</div>
                ) : results.length ? (
                  <div className="history-list">
                    {results.map((r) => {
                      const a = JSON.parse(r.result) as AuditResult;
                      return (
                        <button key={r.id} onClick={() => setReport(a)}>
                          <Globe size={22} />
                          <div>
                            <strong>{a.title || r.url}</strong>
                            <small>
                              {r.url} · {new Date(r.createdAt).toLocaleString(lang)}
                            </small>
                          </div>
                          <span className="score-badge">{a.score}/100</span>
                          <ArrowUpRight size={16} />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Search size={32} />
                    <h3>{t("Aucune analyse pour le moment", "Ainda sem análises")}</h3>
                    <p>{t("Commencez avec votre site web.", "Comece pelo seu site web.")}</p>
                  </div>
                )}
              </section>
            </>
          )}
          {tab === "crm" && (
            <>
              {!paid && !customer.isLoading && (
                <div className="upgrade-banner">
                  <CreditCard size={20} />
                  <div>
                    <strong>
                      {t(
                        "Le CRM est inclus dans les plans payants",
                        "O CRM está incluído nos planos pagos",
                      )}
                    </strong>
                    <p>
                      {t(
                        "Choisissez un plan pour ajouter et gérer vos contacts.",
                        "Escolha um plano para adicionar e gerir contactos.",
                      )}
                    </p>
                  </div>
                  <button className="button small" onClick={() => changeTab("billing")}>
                    {t("Voir les plans", "Ver planos")}
                  </button>
                </div>
              )}
              <section className="dashboard-card">
                <div className="crm-toolbar">
                  <label className="url-input">
                    <Search size={17} />
                    <input aria-label={t("Rechercher un contact", "Pesquisar contacto")}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t("Rechercher un contact…", "Pesquisar contacto…")}
                    />
                  </label>
                  <button
                    className="button outline small"
                    disabled={!data.length}
                    onClick={exportCsv}
                  >
                    <Download size={15} />
                    {t("Exporter", "Exportar")} CSV
                  </button>
                </div>
                {leads.isLoading ? (
                  <Loading />
                ) : leads.isError ? (
                  <div className="error">{leads.error.message}</div>
                ) : !filtered.length ? (
                  <div className="empty-state">
                    <Users size={35} />
                    <h3>
                      {search
                        ? t("Aucun résultat", "Sem resultados")
                        : t("Faites grandir votre réseau", "Faça crescer a sua rede")}
                    </h3>
                    <p>
                      {t(
                        "Retrouvez ici tous vos contacts et leur progression.",
                        "Encontre aqui os contactos e o seu progresso.",
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>{t("Contact", "Contacto")}</th>
                          <th>{t("Entreprise", "Empresa")}</th>
                          <th>{t("Statut", "Estado")}</th>
                          <th>{t("Créé le", "Criado em")}</th>
                          <th aria-label="Actions" />
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((l) => (
                          <tr key={l.id}>
                            <td aria-label={l.name}>
                              <button
                                className="contact-name"
                                onClick={() => {
                                  createLead.reset();
                                  updateLead.reset();
                                  setEdit(l);
                                }}
                              >
                                <span className="avatar">{l.name.slice(0, 2).toUpperCase()}</span>
                                <div>
                                  <strong>{l.name}</strong>
                                  <small>{l.email}</small>
                                </div>
                              </button>
                            </td>
                            <td>{l.company || "—"}</td>
                            <td>
                              <span className={`status ${l.status}`}>
                                {statuses.find((v) => v[0] === l.status)?.[1]}
                              </span>
                            </td>
                            <td>{new Date(l.createdAt).toLocaleDateString(lang)}</td>
                            <td aria-label={l.name}>
                              <button
                                className="icon-button"
                                onClick={() => setRemove(l)}
                                aria-label={t("Supprimer le contact", "Eliminar contacto")}
                              >
                                <Trash2 size={17} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
          {tab === "billing" && (
            <>
              {customer.isLoading ? (
                <Loading />
              ) : customer.isError ? (
                <div className="error">{customer.error.message}</div>
              ) : (
                <div className="billing-current dashboard-card">
                  <div>
                    <span className="eyebrow">{t("VOTRE PLAN ACTUEL", "O SEU PLANO ATUAL")}</span>
                    <h3>
                      {active?.planId
                        .replace("lux_", "")
                        .replace("_annual", t(" annuel", " anual")) ??
                        t("Découverte gratuite", "Descoberta gratuita")}
                    </h3>
                    <p>
                      {t("Analyses restantes ce mois : ", "Análises restantes este mês: ")}
                      {balance?.remaining ?? 3}
                    </p>
                  </div>
                  <button
                    className="button outline"
                    disabled={portal.isPending}
                    onClick={async () => {
                      try {
                        const r = await portal.mutateAsync();
                        if (r.url) window.location.assign(r.url);
                      } catch {}
                    }}
                  >
                    {portal.isPending ? (
                      <LoaderCircle className="spin" size={16} />
                    ) : (
                      <CreditCard size={17} />
                    )}{" "}
                    {t("Gérer la facturation", "Gerir faturação")}
                  </button>
                </div>
              )}
              {portal.isError && <div className="error">{portal.error.message}</div>}
              <div className="sandbox-notice">
                {t(
                  "Environnement de test en USD : aucune facturation réelle. Activez EUR dans Autumn avant lancement. Le CRM s’active avec un abonnement de test.",
                  "Ambiente de teste em USD: sem cobranças reais. Ative EUR no Autumn antes do lançamento. O CRM é ativado com uma assinatura de teste.",
                )}
              </div>
              <Pricing dashboard />
            </>
          )}
        </main>
      </div>
      {report && (
        <Dialog
          title={t("Rapport d’analyse", "Relatório de análise")}
          wide
          onClose={() => setReport(null)}
        >
          <AuditReport result={report} />
        </Dialog>
      )}
      {edit !== undefined && (
        <Dialog
          title={
            edit
              ? t("Modifier le contact", "Editar contacto")
              : t("Nouveau contact", "Novo contacto")
          }
          onClose={() => setEdit(undefined)}
        >
          <form
            className="stack-form"
            onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const payload = {
                name: String(f.get("name")),
                email: String(f.get("email")),
                company: String(f.get("company")),
                status: String(f.get("status")) as "new",
                note: String(f.get("note")),
              };
              try {
                if (edit) await updateLead.mutateAsync({ ...payload, id: edit.id });
                else await createLead.mutateAsync(payload);
                setEdit(undefined);
              } catch {}
            }}
          >
            <label>
              {t("Nom complet", "Nome completo")}
              <input aria-label={t("Nom complet", "Nome completo")} name="name" defaultValue={edit?.name} required minLength={2} />
            </label>
            <label>
              Email
              <input aria-label="Email" name="email" type="email" defaultValue={edit?.email} required />
            </label>
            <label>
              {t("Entreprise", "Empresa")}
              <input aria-label={t("Entreprise", "Empresa")} name="company" defaultValue={edit?.company} />
            </label>
            <label>
              {t("Statut", "Estado")}
              <select aria-label={t("Statut", "Estado")} name="status" defaultValue={edit?.status ?? "new"}>
                {statuses.map(([id, name]) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Notes
              <textarea aria-label="Notes" rows={3} name="note" defaultValue={edit?.note} />
            </label>
            {(createLead.isError || updateLead.isError) && (
              <div className="error">{createLead.error?.message || updateLead.error?.message}</div>
            )}
            <button className="button full" disabled={createLead.isPending || updateLead.isPending}>
              {createLead.isPending || updateLead.isPending ? (
                <LoaderCircle size={18} className="spin" />
              ) : (
                <CheckCircle2 size={18} />
              )}{" "}
              {t("Enregistrer", "Guardar")}
            </button>
          </form>
        </Dialog>
      )}
      {remove && (
        <Dialog
          title={t("Supprimer ce contact ?", "Eliminar este contacto?")}
          onClose={() => setRemove(null)}
        >
          <p className="muted">
            {t(
              `Le contact ${remove.name} sera définitivement supprimé.`,
              `O contacto ${remove.name} será eliminado definitivamente.`,
            )}
          </p>
          {removeLead.isError && <p className="error">{removeLead.error.message}</p>}
          <div className="dialog-actions">
            <button className="button outline" onClick={() => setRemove(null)}>
              {t("Annuler", "Cancelar")}
            </button>
            <button
              className="button danger"
              disabled={removeLead.isPending}
              onClick={async () => {
                try {
                  await removeLead.mutateAsync({ id: remove.id });
                  setRemove(null);
                } catch {}
              }}
            >
              {t("Supprimer", "Eliminar")}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
function ArrowRightIcon() {
  return <ArrowUpRight size={16} />;
}
export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <Loading />;
  if (!session) return <Redirect to="/connexion" />;
  return <PrivateDashboard />;
}
