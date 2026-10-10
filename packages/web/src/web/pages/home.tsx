import { useState } from "react";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Eye,
  Users,
  Clock3,
  ChartNoAxesCombined,
  BriefcaseBusiness,
  PanelsTopLeft,
  Store,
  House,
  Component,
  UserRoundCog,
  Globe,
  Zap,
  ChevronRight,
  Plus,
  Minus,
  ShieldCheck,
  Target,
  ArrowUpRight,
} from "lucide-react";
import { Header } from "../components/header";
import { Brand } from "../components/brand";
import { PreviewDashboard } from "../components/preview-dashboard";
import { AuditForm } from "../components/audit";
import { Pricing } from "../components/pricing";
import { EnquiryDialog } from "../components/enquiry";
import { Dialog } from "../components/dialog";
import { useLanguage } from "../lib/i18n";
export default function Home() {
  const { t } = useLanguage();
  const [enquiry, setEnquiry] = useState<"contact" | "demo" | "website" | null>(null);
  const [demo, setDemo] = useState(false);
  const [legal, setLegal] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const sectors = [
    { Icon: BriefcaseBusiness, fr: "Entreprises locales", pt: "Empresas locais" },
    { Icon: Component, fr: "Startups", pt: "Startups" },
    { Icon: PanelsTopLeft, fr: "PME", pt: "PME" },
    { Icon: House, fr: "Artisans", pt: "Artesãos" },
    { Icon: Store, fr: "Commerçants", pt: "Comerciantes" },
    { Icon: UserRoundCog, fr: "Indépendants", pt: "Profissionais liberais" },
  ];
  const problems = [
    {
      Icon: Eye,
      title: t("Manque de visibilité", "Falta de visibilidade"),
      body: t(
        "Votre entreprise existe, mais on ne vous trouve pas.",
        "A sua empresa existe, mas ninguém a encontra.",
      ),
    },
    {
      Icon: Users,
      title: t("Peu de clients", "Poucos clientes"),
      body: t(
        "Vous recevez trop peu de demandes qualifiées.",
        "Recebe poucos pedidos qualificados.",
      ),
    },
    {
      Icon: Clock3,
      title: t("Perte de temps", "Perda de tempo"),
      body: t(
        "Les tâches répétitives vous prennent du temps.",
        "As tarefas repetitivas roubam-lhe tempo.",
      ),
    },
    {
      Icon: ChartNoAxesCombined,
      title: t("Croissance limitée", "Crescimento limitado"),
      body: t(
        "Vous voulez développer votre activité plus rapidement.",
        "Quer fazer crescer o seu negócio mais depressa.",
      ),
    },
  ];
  const faqs = [
    [
      t("Que comprend mon abonnement ?", "O que inclui a minha assinatura?"),
      t(
        "Votre abonnement inclut les fonctionnalités de la plateforme selon votre plan : analyses techniques, CRM et suivi de vos demandes. Le site web inclus fait l’objet d’un cadrage avec notre équipe et d’un engagement de 12 mois.",
        "A assinatura inclui as funcionalidades da plataforma consoante o plano: análises técnicas, CRM e acompanhamento de pedidos. O site incluído exige definição de âmbito com a equipa e compromisso de 12 meses.",
      ),
    ],
    [
      t("Comment fonctionne l’analyse gratuite ?", "Como funciona a análise gratuita?"),
      t(
        "Nous récupérons le HTML public de votre page et vérifions dix critères : HTTPS, titre, description, H1, mobile, images, URL canonique, temps de réponse, Open Graph et langue. Ce n’est pas un outil de mesure de trafic.",
        "Obtemos o HTML público da sua página e verificamos dez critérios: HTTPS, título, descrição, H1, adaptação móvel, imagens, URL canónico, tempo de resposta, Open Graph e idioma. Não é uma ferramenta de medição de tráfego.",
      ),
    ],
    [
      t("Puis-je changer de plan ?", "Posso mudar de plano?"),
      t(
        "Oui. Depuis votre espace, choisissez un autre plan ou accédez au portail de facturation pour gérer votre abonnement. Le checkout est actuellement en environnement de test.",
        "Sim. No painel, escolha outro plano ou aceda ao portal de faturação para gerir a assinatura. O checkout está atualmente em ambiente de teste.",
      ),
    ],
    [
      t(
        "La plateforme est-elle disponible en portugais ?",
        "A plataforma está disponível em francês?",
      ),
      t(
        "Oui, l’ensemble du site et de votre espace est disponible en français et en portugais. Changez de langue à tout moment dans le menu.",
        "Sim, todo o site e o seu painel estão disponíveis em francês e português. Mude o idioma a qualquer momento no menu.",
      ),
    ],
  ];
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="hero-ambient" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">
                {t("UNE PLATEFORME. DES RÉSULTATS.", "UMA PLATAFORMA. RESULTADOS.")}
              </span>
              <h1>
                {t("Plus de visibilité.", "Mais visibilidade.")}
                <br />
                <span>{t("Plus de clients.", "Mais clientes.")}</span>
              </h1>
              <p>
                {t(
                  "Sites web, CRM, automatisation et marketing digital pour les entreprises au Luxembourg et en Europe.",
                  "Sites, CRM, automação e marketing digital para empresas no Luxemburgo e na Europa.",
                )}
              </p>
              <div className="hero-buttons">
                <button className="button" onClick={() => setEnquiry("website")}>
                  {t("Obtenir mon site web", "Quero o meu site")}
                  <ArrowRight size={17} />
                </button>
                <button className="button outline" onClick={() => setDemo(true)}>
                  <Play size={14} />
                  {t("Voir la démo", "Ver demonstração")}
                </button>
              </div>
              <div className="hero-assurances">
                {[
                  t("Mise en place rapide", "Configuração rápida"),
                  t("Sans engagement long*", "Sem compromisso longo*"),
                  t("Accompagnement inclus", "Acompanhamento incluído"),
                ].map((s) => (
                  <span key={s}>
                    <CheckCircle2 size={14} />
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-photo" />
              <div className="hero-monitor">
                <PreviewDashboard />
              </div>
              <div className="new-lead">
                <span>
                  <Users size={21} />
                </span>
                <div>
                  <strong>{t("Nouveau lead", "Novo lead")}</strong>
                  <p>{t("Demande de devis", "Pedido de orçamento")}</p>
                  <small>{t("Il y a 2 min · exemple", "Há 2 min · exemplo")}</small>
                </div>
                <span className="lead-notification" />
              </div>
              <div className="hero-glow" />
            </div>
          </div>
        </section>
        <div className="container top-content">
          <AuditForm />
          <div className="trust-strip">
            <span className="eyebrow">
              {t("PENSÉ POUR VOTRE", "PENSADO PARA O SEU")}
              <br />
              {t("ACTIVITÉ", "NEGÓCIO")}
            </span>
            {sectors.map(({ Icon, fr, pt }) => (
              <a href="#secteurs" key={fr}>
                <Icon size={18} />
                <span>{t(fr, pt)}</span>
              </a>
            ))}
          </div>
          <section id="solutions" className="problems-section">
            <span className="eyebrow">
              {t(
                "DES PROBLÈMES CONCRETS. UNE SOLUTION CLAIRE.",
                "PROBLEMAS CONCRETOS. UMA SOLUÇÃO CLARA.",
              )}
            </span>
            <div className="problem-grid">
              {problems.map(({ Icon, title, body }) => (
                <div className="problem-card" key={title}>
                  <div className="problem-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </section>
          <Pricing onWebsite={() => setEnquiry("website")} />
        </div>
        <section className="platform-section section-space">
          <div className="container platform-grid">
            <div className="platform-art">
              <PreviewDashboard large />
              <div className="platform-chip">
                <ShieldCheck size={18} />
                {t("Tout votre business. Un seul espace.", "Todo o seu negócio. Um só espaço.")}
              </div>
            </div>
            <div>
              <span className="eyebrow gold">
                {t("MOINS D’OUTILS. PLUS D’IMPACT.", "MENOS FERRAMENTAS. MAIS IMPACTO.")}
              </span>
              <h2>
                {t("Votre croissance,", "O seu crescimento,")}
                <br />
                {t("enfin connectée.", "finalmente conectado.")}
              </h2>
              <p className="section-description">
                {t(
                  "Un beau site ne suffit pas. Connectez votre présence en ligne à votre activité, pour transformer chaque opportunité en prochain client.",
                  "Um bom site não basta. Ligue a sua presença online ao seu negócio e transforme cada oportunidade no próximo cliente.",
                )}
              </p>
              <div className="feature-list">
                {[
                  {
                    Icon: Globe,
                    title: t("Un site qui vous ressemble", "Um site à sua imagem"),
                    body: t(
                      "Professionnel, responsive et pensé pour convertir.",
                      "Profissional, responsivo e pensado para converter.",
                    ),
                  },
                  {
                    Icon: Users,
                    title: t("Un CRM pour ne rien laisser passer", "Um CRM para não perder nada"),
                    body: t(
                      "Centralisez vos contacts et suivez chaque opportunité.",
                      "Centralize contactos e acompanhe cada oportunidade.",
                    ),
                  },
                  {
                    Icon: Zap,
                    title: t("Du temps pour ce qui compte", "Tempo para o que importa"),
                    body: t(
                      "Une vision claire de vos actions et de vos priorités.",
                      "Uma visão clara das suas ações e prioridades.",
                    ),
                  },
                ].map(({ Icon, title, body }) => (
                  <div key={title}>
                    <span>
                      <Icon size={21} />
                    </span>
                    <div>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a className="text-link" href="/connexion?mode=signup">
                {t("Découvrir mon espace", "Descobrir o meu painel")}
                <ArrowUpRight size={19} />
              </a>
            </div>
          </div>
        </section>
        <section id="secteurs" className="container section-space">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {t("VOTRE MÉTIER. VOS AMBITIONS.", "A SUA PROFISSÃO. AS SUAS AMBIÇÕES.")}
              </span>
              <h2>{t("Le digital, à votre échelle.", "O digital, à sua medida.")}</h2>
            </div>
            <p className="muted sector-intro">
              {t(
                "Des solutions concrètes pour les entreprises qui font vivre notre économie.",
                "Soluções concretas para as empresas que fazem a nossa economia crescer.",
              )}
            </p>
          </div>
          <div className="sector-grid">
            {sectors.map(({ Icon, fr, pt }, i) => (
              <button key={fr} onClick={() => setEnquiry("contact")}>
                <Icon size={27} />
                <h3>{t(fr, pt)}</h3>
                <p>
                  {
                    [
                      t(
                        "Devenez le premier choix dans votre région.",
                        "Seja a primeira escolha na sua região.",
                      ),
                      t(
                        "Lancez votre activité sur des bases solides.",
                        "Lance o negócio com uma base sólida.",
                      ),
                      t(
                        "Structurez votre croissance, simplement.",
                        "Estruture o crescimento, sem complicações.",
                      ),
                      t(
                        "Votre savoir-faire mérite d’être visible.",
                        "O seu saber-fazer merece ser visto.",
                      ),
                      t(
                        "Transformez les visiteurs en clients.",
                        "Transforme visitantes em clientes.",
                      ),
                      t(
                        "Votre activité, votre image, votre rythme.",
                        "O seu negócio, a sua imagem, o seu ritmo.",
                      ),
                    ][i]
                  }
                </p>
                <span>
                  {t("Découvrir ma solution", "Descobrir a minha solução")}
                  <ChevronRight size={15} />
                </span>
              </button>
            ))}
          </div>
        </section>
        <section id="apropos" className="about-section">
          <div className="container about-grid">
            <div>
              <span className="eyebrow gold">
                {t(
                  "LE DIGITAL AVEC UN PARTENAIRE, PAS UN PROBLÈME.",
                  "O DIGITAL COM UM PARCEIRO, NÃO UM PROBLEMA.",
                )}
              </span>
              <h2>
                {t("Une ambition simple.", "Uma ambição simples.")}
                <br />
                {t("Faire grandir la vôtre.", "Fazer crescer a sua.")}
              </h2>
            </div>
            <div>
              <p>
                {t(
                  "LuxGrowth AI rassemble les essentiels de votre croissance digitale en une plateforme claire. Notre mission : rendre les outils professionnels accessibles aux entreprises locales, aux indépendants et aux PME.",
                  "A LuxGrowth AI reúne as ferramentas essenciais de crescimento digital numa plataforma clara. A nossa missão: tornar ferramentas profissionais acessíveis a empresas locais, profissionais liberais e PME.",
                )}
              </p>
              <div className="about-values">
                <span>
                  <Target size={19} />
                  {t("Orienté résultats", "Orientado a resultados")}
                </span>
                <span>
                  <ShieldCheck size={19} />
                  {t("Simple & transparent", "Simples e transparente")}
                </span>
              </div>
              <button className="text-link" onClick={() => setEnquiry("contact")}>
                {t("Parlons de votre projet", "Vamos falar do seu projeto")}
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </section>
        <section id="ressources" className="container section-space faq-section">
          <div>
            <span className="eyebrow">
              {t("DES RÉPONSES, SANS JARGON.", "RESPOSTAS, SEM COMPLICAÇÕES.")}
            </span>
            <h2>{t("Tout simplement.", "Simples assim.")}</h2>
            <p className="muted">
              {t(
                "Les réponses à vos questions, pour avancer sereinement.",
                "As respostas às suas perguntas, para avançar com confiança.",
              )}
            </p>
            <button className="text-link" onClick={() => setEnquiry("contact")}>
              {t("Une autre question ? Contactez-nous", "Outra questão? Contacte-nos")}
              <ArrowRight size={17} />
            </button>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a], i) => (
              <div className="faq-item" key={q}>
                <button aria-expanded={faq === i} onClick={() => setFaq(faq === i ? null : i)}>
                  {q}
                  {faq === i ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {faq === i && <p>{a}</p>}
              </div>
            ))}
          </div>
        </section>
        <section className="container final-cta">
          <span className="eyebrow">
            {t("VOTRE PROCHAINE ÉTAPE COMMENCE ICI.", "O SEU PRÓXIMO PASSO COMEÇA AQUI.")}
          </span>
          <h2>
            {t("Plus de possibilités.", "Mais possibilidades.")}
            <br />
            <span>{t("Moins de complications.", "Menos complicações.")}</span>
          </h2>
          <p>
            {t(
              "Prêt à donner une nouvelle dimension à votre activité ?",
              "Pronto para dar uma nova dimensão ao seu negócio?",
            )}
          </p>
          <button className="button" onClick={() => setEnquiry("demo")}>
            {t("Parlons de votre croissance", "Vamos falar do seu crescimento")}
            <ArrowRight size={18} />
          </button>
        </section>
      </main>
      <footer className="container">
        <div className="footer-top">
          <div>
            <Brand />
            <p>{t("Une plateforme. Des résultats.", "Uma plataforma. Resultados.")}</p>
          </div>
          <div>
            <a href="#solutions">{t("Solutions", "Soluções")}</a>
            <a href="#tarifs">{t("Tarifs", "Preços")}</a>
            <button onClick={() => setEnquiry("contact")}>Contact</button>
            <a href="/connexion">{t("Mon espace", "Meu painel")}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} LuxGrowth AI.{" "}
            {t("Tous droits réservés.", "Todos os direitos reservados.")}
          </span>
          <button onClick={() => setLegal(true)}>
            {t("Confidentialité & informations", "Privacidade e informações")}
          </button>
          <span>Luxembourg · Europe</span>
        </div>
        <p className="footer-note">
          {t(
            "* L’offre site web inclus nécessite un engagement de 12 mois. Les autres conditions sont précisées avant souscription.",
            "* A oferta de site incluído exige compromisso de 12 meses. As restantes condições são indicadas antes da assinatura.",
          )}
        </p>
      </footer>
      {enquiry && <EnquiryDialog type={enquiry} onClose={() => setEnquiry(null)} />}{" "}
      {demo && (
        <Dialog
          title={t("Découvrez votre futur espace", "Descubra o seu futuro painel")}
          onClose={() => setDemo(false)}
          wide
        >
          <PreviewDashboard large />
          <p className="muted demo-disclaimer">
            {t(
              "Cet aperçu utilise des données illustratives. Votre espace réel démarre vide et se remplit avec vos analyses et vos contacts.",
              "Esta pré-visualização usa dados ilustrativos. O seu painel real começa vazio e é preenchido com as suas análises e contactos.",
            )}
          </p>
          <div className="demo-features">
            <span>
              <Globe size={18} />
              {t("Analyses réelles", "Análises reais")}
            </span>
            <span>
              <Users size={18} />
              CRM
            </span>
            <span>
              <ChartNoAxesCombined size={18} />
              {t("Suivi centralisé", "Gestão centralizada")}
            </span>
          </div>
          <a className="button full" href="/connexion?mode=signup">
            {t("Créer mon espace", "Criar o meu painel")}
            <ArrowRight size={17} />
          </a>
        </Dialog>
      )}
      {legal && (
        <Dialog
          title={t("Confidentialité & informations", "Privacidade e informações")}
          onClose={() => setLegal(false)}
        >
          <div className="legal-copy">
            <p>
              {t(
                "Les données de compte, contacts CRM et analyses sont enregistrées pour fournir les fonctionnalités de la plateforme. Les contacts et analyses de votre espace ne sont accessibles qu’à votre compte.",
                "Os dados de conta, contactos CRM e análises são guardados para fornecer as funcionalidades da plataforma. Os contactos e análises do painel só são acessíveis à sua conta.",
              )}
            </p>
            <p>
              {t(
                "Les demandes de contact sont stockées pour traitement par l’équipe. La plateforme utilise des sessions d’authentification et des statistiques de navigation. Aucun paiement réel n’est effectué en mode Sandbox.",
                "Os pedidos de contacto são guardados para tratamento pela equipa. A plataforma usa sessões de autenticação e estatísticas de navegação. Nenhum pagamento real é feito em modo Sandbox.",
              )}
            </p>
            <p>
              {t(
                "Avant une mise en production commerciale, le propriétaire doit compléter l’identité légale de l’entreprise, les conditions générales et la politique de protection des données.",
                "Antes do lançamento comercial, o proprietário deve completar a identificação legal da empresa, os termos e a política de proteção de dados.",
              )}
            </p>
            <button
              className="button"
              onClick={() => {
                setLegal(false);
                setEnquiry("contact");
              }}
            >
              {t("Demande concernant mes données", "Pedido relativo aos meus dados")}
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
