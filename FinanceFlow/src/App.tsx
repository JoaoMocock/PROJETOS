import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { paginaPainel, paginaPadrao } from './paginas/paginas';

const links = [
  ['/', 'Painel'],
  ['/autenticacao/login', 'Login'],
  ['/modulo/transacoes', 'Transações'],
  ['/modulo/cartoes', 'Cartões'],
  ['/modulo/orcamento', 'Orçamento'],
  ['/modulo/despesas-fixas', 'Despesas Fixas'],
  ['/modulo/metas', 'Metas'],
  ['/modulo/investimentos', 'Investimentos'],
  ['/modulo/relatorios', 'Relatórios'],
  ['/modulo/notificacoes', 'Notificações']
] as const;

export function App() {
  return (
    <div className="app">
      <aside className="menu-lateral" aria-label="Menu principal">
        <h1>FinanceFlow</h1>
        <p>Controle financeiro pessoal</p>
        <nav>
          {links.map(([url, titulo]) => (
            <Link key={url} to={url}>{titulo}</Link>
          ))}
        </nav>
      </aside>
      <main className="conteudo">
        <Routes>
          <Route path="/" element={paginaPainel()} />
          <Route path="/autenticacao/login" element={paginaPadrao('Login seguro', 'Entre com seu e-mail e senha para acessar o FinanceFlow.')} />
          <Route path="/autenticacao/cadastro" element={paginaPadrao('Criar conta', 'Cadastre-se com nome completo, e-mail e senha com confirmação por e-mail.')} />
          <Route path="/autenticacao/recuperar-senha" element={paginaPadrao('Recuperar senha', 'Informe seu e-mail para receber o link de recuperação de senha.')} />
          <Route path="/perfil" element={paginaPadrao('Meu perfil', 'Edite nome, foto de perfil, moeda preferida e meta mensal de economia.')} />
          <Route path="/modulo/transacoes" element={paginaPadrao('Módulo de transações', 'Lance receitas e despesas, configure recorrência, filtre, busque e exporte em CSV/PDF.')} />
          <Route path="/modulo/cartoes" element={paginaPadrao('Módulo de cartão de crédito', 'Gerencie cartões, faturas, alertas de limite e comparativos mensais.')} />
          <Route path="/modulo/orcamento" element={paginaPadrao('Módulo de orçamento', 'Defina orçamento por categoria e acompanhe barras de progresso com alertas.')} />
          <Route path="/modulo/despesas-fixas" element={paginaPadrao('Módulo de despesas fixas', 'Cadastre despesas recorrentes, calendário mensal e projeção anual.')} />
          <Route path="/modulo/metas" element={paginaPadrao('Módulo de metas financeiras', 'Acompanhe metas com progresso, aporte necessário e marcos motivacionais.')} />
          <Route path="/modulo/investimentos" element={paginaPadrao('Módulo de investimentos', 'Registre aportes, acompanhe evolução e alocação da carteira.')} />
          <Route path="/modulo/relatorios" element={paginaPadrao('Relatórios e análises', 'Veja relatórios mensais, heatmap de gastos e previsão de fluxo de caixa.')} />
          <Route path="/modulo/notificacoes" element={paginaPadrao('Central de notificações', 'Receba alertas de vencimento, orçamento e marcos de metas.')} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
