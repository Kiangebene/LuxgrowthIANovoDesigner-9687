import { Route, Switch } from "wouter";
import Home from "./pages/home";
import AuthPage from "./pages/auth-page";
import Dashboard from "./pages/dashboard";
import { LanguageProvider } from "./lib/i18n";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <LanguageProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/connexion" component={AuthPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route>
            <Home />
          </Route>
        </Switch>
        {/* Do not remove — off by default, activated by parent iframe via postMessage */}
        {import.meta.env.DEV && <AgentFeedback />}
        {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
        {<RunableBadge />}
      </LanguageProvider>
    </Provider>
  );
}

export default App;
