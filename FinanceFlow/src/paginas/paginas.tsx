import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const dadosLinha = [
  { mes: 'Nov', receitas: 8700, despesas: 7200 },
  { mes: 'Dez', receitas: 9200, despesas: 7600 },
  { mes: 'Jan', receitas: 9400, despesas: 7800 },
  { mes: 'Fev', receitas: 9700, despesas: 8150 },
  { mes: 'Mar', receitas: 9900, despesas: 8000 },
  { mes: 'Abr', receitas: 10200, despesas: 8600 }
];

const dadosRosca = [
  { name: 'Moradia', value: 38 },
  { name: 'Alimentação', value: 21 },
  { name: 'Transporte', value: 14 },
  { name: 'Saúde', value: 12 },
  { name: 'Lazer', value: 15 }
];

export function paginaPadrao(titulo: string, descricao: string) {
  return <section><h2>{titulo}</h2><p>{descricao}</p></section>;
}

export function paginaPainel() {
  return (
    <section>
      <h2>Painel principal</h2>
      <div className="grade-cards">
        {['Receita Total: R$ 10.200,00', 'Despesas Totais: R$ 8.600,00', 'Saldo Líquido: R$ 1.600,00', 'Taxa de Economia: 15,7%'].map((item) => <article key={item} className="card">{item}</article>)}
      </div>
      <div className="grade-graficos">
        <article className="card"><h3>Receitas vs despesas (6 meses)</h3><ResponsiveContainer width="100%" height={240}><LineChart data={dadosLinha}><XAxis dataKey="mes" /><YAxis /><Tooltip /><Line dataKey="receitas" stroke="#0ea5e9" /><Line dataKey="despesas" stroke="#ef4444" /></LineChart></ResponsiveContainer></article>
        <article className="card"><h3>Despesas por categoria</h3><ResponsiveContainer width="100%" height={240}><PieChart><Pie data={dadosRosca} dataKey="value" nameKey="name" outerRadius={85}>{['#8b5cf6','#06b6d4','#f59e0b','#f43f5e','#10b981'].map((c)=> <Cell key={c} fill={c} />)}</Pie></PieChart></ResponsiveContainer></article>
      </div>
      <article className="card"><h3>Últimas 10 transações</h3><p>Sem transações recentes. Clique em “+ Nova transação” para começar.</p></article>
    </section>
  );
}
