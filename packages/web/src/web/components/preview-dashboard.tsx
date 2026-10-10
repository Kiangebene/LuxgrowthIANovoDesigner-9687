import {
  LayoutDashboard,
  Globe,
  Users,
  ChartNoAxesCombined,
  Mail,
  Settings,
  ArrowUpRight,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "../lib/i18n";
export function PreviewDashboard({ large = false }: { large?: boolean }) {
  const { t } = useLanguage();
  return (
    <div className={`preview-dashboard ${large ? "large" : ""}`}>
      <div className="preview-head">
        <span className="mini-brand">◉ LuxGrowth AI</span>
        <span>{t("Votre espace de croissance", "O seu espaço de crescimento")}</span>
        <Bell size={10} />
      </div>
      <div className="preview-content">
        <div className="preview-sidebar">
          {[LayoutDashboard, Globe, Users, Mail, ChartNoAxesCombined, Settings].map((Icon, i) => (
            <div key={i}>
              <Icon size={12} />
              <span>
                {
                  [
                    t("Tableau de bord", "Painel"),
                    t("Sites web", "Sites web"),
                    "CRM",
                    "Leads",
                    t("Campagnes", "Campanhas"),
                    t("Stratégies", "Estratégias"),
                  ][i]
                }
              </span>
            </div>
          ))}
        </div>
        <div className="preview-body">
          <div className="preview-greeting">
            {t("Votre croissance, en un coup d’œil.", "O seu crescimento, num relance.")}
            <ChevronDown size={10} />
          </div>
          <div className="preview-stats">
            <div>
              <small>{t("Leads ce mois", "Leads este mês")}</small>
              <strong>
                248{" "}
                <em>
                  +12% <ArrowUpRight size={10} />
                </em>
              </strong>
              <div className="bars">
                {[26, 40, 32, 52, 45, 67, 58, 78, 71, 94].map((h, i) => (
                  <i key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
              <span className="chart-months">SEP · OCT · NOV · DÉC</span>
            </div>
            <div className="preview-right">
              <div>
                <small>Clients</small>
                <strong>
                  36 <em>+28%</em>
                </strong>
              </div>
              <div>
                <small>{t("Demandes", "Pedidos")}</small>
                <strong>
                  89 <em>+58%</em>
                </strong>
              </div>
            </div>
          </div>
          <div className="preview-bottom">
            <span>
              <span className="gold-dot" />{" "}
              {t("Votre activité est en pleine croissance", "A sua atividade está a crescer")}
            </span>
            <ArrowUpRight size={13} />
          </div>
        </div>
      </div>
      <div className="sample-label">
        {t(
          "Aperçu illustratif · données de démonstration",
          "Exemplo ilustrativo · dados de demonstração",
        )}
      </div>
    </div>
  );
}
