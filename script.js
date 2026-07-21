const PROCESS_STATUSES = ['Em elaboração', 'Enviado para aprovação', 'Em aprovação', 'Aprovado', 'Com Time de CNR', 'Em processamento', 'Finalizado', 'Cancelado'];
const INVOICE_STATUSES = ['Ainda não lançada', 'Aguardando lançamento', 'Em lançamento', 'Lançada'];
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

let processes = JSON.parse(localStorage.getItem('sapProcesses') || '[]');
let invoices = JSON.parse(localStorage.getItem('sapInvoices') || '[]');
let sortDesc = true;

const money = value => (Number(value) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const uid = () => crypto.randomUUID?.() || Date.now().toString();

function save() {
  localStorage.setItem('sapProcesses', JSON.stringify(processes));
  localStorage.setItem('sapInvoices', JSON.stringify(invoices));
  renderAll();
}

function statusClass(status) {
  if (['Aprovado', 'Finalizado', 'Lançada'].includes(status)) return 'green';
  if (['Enviado para aprovação', 'Em aprovação', 'Em processamento', 'Aguardando lançamento', 'Em lançamento'].includes(status)) return 'blue';
  if (status === 'Com Time de CNR' || status === 'Ainda não lançada') return 'orange';
  if (status === 'Cancelado') return 'red';
  return 'gray';
}

function populateSelects() {
  PROCESS_STATUSES.forEach(status => {
    $('#status').add(new Option(status));
    $('#processStatusFilter').add(new Option(status, status));
  });
}

function navigate(sectionId) {
  $$('.view').forEach(view => view.classList.toggle('active', view.id === sectionId));
  $$('.menu-item').forEach(item => item.classList.toggle('active', item.dataset.section === sectionId));
  $('#menuPanel').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderCharts();
}

function openProcessModal(type = '') {
  $('#processForm').reset();
  $('#processId').value = '';
  $('#processModalTitle').textContent = type ? `Nova ${type}` : 'Nova demanda';
  if (type) $('#processType').value = type;
  $('#createdAt').valueAsDate = new Date();
  processModal.showModal();
}

function openInvoiceModal() {
  $('#invoiceForm').reset();
  $('#invoiceId').value = '';
  invoiceModal.showModal();
}

function renderSummary() {
  const open = type => processes.filter(process => process.type === type && !['Finalizado', 'Cancelado'].includes(process.status)).length;
  const items = [
    ['Requisições abertas', open('Requisição')],
    ['Pedidos abertos', open('Pedido')],
    ['Folhas abertas', open('Folha de Serviço')],
    ['Notas pendentes', invoices.filter(invoice => invoice.status !== 'Lançada').length]
  ];
  $('#microSummary').innerHTML = items.map(item => `<div class="summary-pill"><span>${item[0]}</span><strong>${item[1]}</strong></div>`).join('');
}

function renderProcesses() {
  const term = $('#processSearch').value.toLowerCase();
  const statusFilter = $('#processStatusFilter').value;
  const typeFilter = $('#processTypeFilter').value;
  const supplierFilter = $('#supplierFilter').value.toLowerCase();

  const rows = processes
    .filter(process => (!statusFilter || process.status === statusFilter))
    .filter(process => (!typeFilter || process.type === typeFilter))
    .filter(process => !supplierFilter || process.supplier.toLowerCase().includes(supplierFilter))
    .filter(process => Object.values(process).join(' ').toLowerCase().includes(term))
    .sort((a, b) => sortDesc ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt));

  $('#processCards').innerHTML = rows.map((process, index) => `
    <article class="process-card" style="animation-delay:${index * 35}ms">
      <div class="card-top">
        <div><span class="type-chip">${process.type}</span><div class="sap-number">${process.sapNumber}</div></div>
        <span class="badge ${statusClass(process.status)}">${process.status}</span>
      </div>
      <div class="meta">
        <span>Fornecedor <b>${process.supplier}</b></span>
        <span>Responsável <b>${process.owner}</b></span>
        <span>Valor <b>${money(process.value)}</b></span>
        <span>Data <b>${process.createdAt}</b></span>
      </div>
      <div class="actions"><button onclick="detailProcess('${process.id}')">Ver</button><button onclick="editProcess('${process.id}')">Editar</button><button onclick="deleteProcess('${process.id}')">Excluir</button></div>
    </article>`).join('') || '<div class="empty-state">Nenhum processo encontrado.</div>';
}

function renderInvoices() {
  const term = $('#invoiceSearch').value.toLowerCase();
  const statusFilter = $('#invoiceStatusFilter').value;
  const rows = invoices
    .filter(invoice => !statusFilter || invoice.status === statusFilter)
    .filter(invoice => Object.values(invoice).join(' ').toLowerCase().includes(term));

  $('#invoiceCards').innerHTML = rows.map((invoice, index) => `
    <article class="invoice-card" onclick="detailInvoice('${invoice.id}')" style="animation-delay:${index * 35}ms">
      ${invoice.image ? `<img src="${invoice.image}" class="thumb" alt="Miniatura da nota fiscal">` : '<div class="thumb"></div>'}
      <div class="card-top"><div><span class="type-chip">Nota Fiscal</span><div class="sap-number">${invoice.number}</div></div><span class="badge ${statusClass(invoice.status)}">${invoice.status}</span></div>
      <div class="meta">
        <span>Pedido <b>${invoice.order}</b></span>
        <span>Fornecedor <b>${invoice.supplier}</b></span>
        <span>Valor <b>${money(invoice.value)}</b></span>
        <span>Data <b>${invoice.issueDate}</b></span>
      </div>
      <div class="actions" onclick="event.stopPropagation()"><button onclick="openImage('${invoice.id}')">Imagem</button><button onclick="editInvoice('${invoice.id}')">Editar</button><button onclick="deleteInvoice('${invoice.id}')">Excluir</button></div>
    </article>`).join('') || '<div class="empty-state">Nenhuma nota fiscal encontrada.</div>';
}

function drawBar(canvas, labels, values, colors) {
  const context = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 150;
  context.clearRect(0, 0, width, height);
  const max = Math.max(1, ...values);
  const barWidth = Math.max(24, (width - 42) / Math.max(labels.length, 1));
  labels.forEach((label, index) => {
    const barHeight = (height - 48) * (values[index] / max);
    const x = 20 + index * barWidth;
    const y = height - 28 - barHeight;
    context.fillStyle = colors[index % colors.length];
    context.beginPath();
    context.roundRect(x, y, barWidth * .42, barHeight || 3, 8);
    context.fill();
    context.fillStyle = getComputedStyle(document.body).getPropertyValue('--muted');
    context.font = '11px Inter';
    context.fillText(label.slice(0, 10), x, height - 8);
    context.fillStyle = getComputedStyle(document.body).getPropertyValue('--ink');
    context.fillText(values[index], x + 4, y - 6);
  });
}

function renderCharts() {
  if (!$('#typeChart').offsetWidth) return;
  drawBar($('#typeChart'), ['Req.', 'Pedidos', 'Folhas'], ['Requisição', 'Pedido', 'Folha de Serviço'].map(type => processes.filter(process => process.type === type).length), ['#C8102E', '#006B3F', '#161616']);
  drawBar($('#statusChart'), PROCESS_STATUSES.map(status => status.split(' ')[0]), PROCESS_STATUSES.map(status => processes.filter(process => process.status === status).length), ['#C8102E', '#006B3F', '#8f8f8f']);
  drawBar($('#invoiceChart'), ['Não', 'Aguard.', 'Em lanç.', 'Lançada'], INVOICE_STATUSES.map(status => invoices.filter(invoice => invoice.status === status).length), ['#C8102E', '#C8102E', '#161616', '#006B3F']);
  const months = [...new Set([...processes.map(process => process.createdAt?.slice(0, 7)), ...invoices.map(invoice => invoice.issueDate?.slice(0, 7))].filter(Boolean))].sort().slice(-6);
  drawBar($('#monthlyChart'), months.length ? months : ['Mês'], months.length ? months.map(month => processes.filter(process => process.createdAt?.startsWith(month)).length + invoices.filter(invoice => invoice.issueDate?.startsWith(month)).length) : [0], ['#C8102E']);
}

function renderReports() {
  const sum = (arr, callback) => arr.reduce((total, item) => total + (callback(item) || 0), 0);
  const by = (arr, key) => arr.reduce((acc, item) => (acc[item[key]] = (acc[item[key]] || 0) + 1, acc), {});
  const cards = [
    ['Processos por status', Object.entries(by(processes, 'status')).map(item => item.join(': ')).join('<br>') || 'Sem dados'],
    ['Por fornecedor', Object.entries(by(processes, 'supplier')).map(item => item.join(': ')).join('<br>') || 'Sem dados'],
    ['Por responsável', Object.entries(by(processes, 'owner')).map(item => item.join(': ')).join('<br>') || 'Sem dados'],
    ['Valor total dos pedidos', money(sum(processes.filter(process => process.type === 'Pedido'), process => +process.value))],
    ['Valor total das folhas', money(sum(processes.filter(process => process.type === 'Folha de Serviço'), process => +process.value))],
    ['Valor total das notas fiscais', money(sum(invoices, invoice => +invoice.value))]
  ];
  $('#reportGrid').innerHTML = cards.map(card => `<article class="report-card"><p>${card[0]}</p><strong>${card[1]}</strong></article>`).join('');
}

function renderAll() {
  renderSummary();
  renderProcesses();
  renderInvoices();
  renderReports();
  renderCharts();
}

$('#processForm').addEventListener('submit', event => {
  event.preventDefault();
  const process = { id: $('#processId').value || uid(), type: $('#processType').value, sapNumber: $('#sapNumber').value, description: $('#description').value, supplier: $('#supplier').value, costCenter: $('#costCenter').value, value: $('#value').value, createdAt: $('#createdAt').value, owner: $('#owner').value, status: $('#status').value, notes: $('#notes').value };
  processes = processes.filter(item => item.id !== process.id).concat(process);
  event.target.reset();
  $('#processId').value = '';
  processModal.close();
  save();
});

$('#invoiceForm').addEventListener('submit', async event => {
  event.preventDefault();
  const file = $('#invoiceImage').files[0];
  const oldInvoice = invoices.find(invoice => invoice.id === $('#invoiceId').value);
  const image = file ? await new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); }) : oldInvoice?.image;
  const invoice = { id: $('#invoiceId').value || uid(), image, number: $('#invoiceNumber').value, order: $('#orderNumber').value, supplier: $('#invoiceSupplier').value, value: $('#invoiceValue').value, issueDate: $('#issueDate').value, receiveDate: $('#receiveDate').value, status: $('#invoiceStatus').value, owner: $('#invoiceOwner').value, notes: $('#invoiceNotes').value };
  invoices = invoices.filter(item => item.id !== invoice.id).concat(invoice);
  event.target.reset();
  $('#invoiceId').value = '';
  invoiceModal.close();
  save();
});

function editProcess(id) {
  const process = processes.find(item => item.id === id);
  Object.entries({ processId: process.id, processType: process.type, sapNumber: process.sapNumber, description: process.description, supplier: process.supplier, costCenter: process.costCenter, value: process.value, createdAt: process.createdAt, owner: process.owner, status: process.status, notes: process.notes }).forEach(([key, value]) => $('#' + key).value = value || '');
  $('#processModalTitle').textContent = `Editar ${process.type}`;
  processModal.showModal();
}
function deleteProcess(id) { if (confirm('Excluir processo?')) { processes = processes.filter(process => process.id !== id); save(); } }
function detailProcess(id) {
  const process = processes.find(item => item.id === id);
  $('#modalContent').innerHTML = `<button class="close-detail" onclick="detailModal.close()">Fechar</button><p class="kicker">${process.type}</p><h2>${process.sapNumber}</h2><p><span class="badge ${statusClass(process.status)}">${process.status}</span></p><p><b>Descrição:</b> ${process.description}</p><p><b>Fornecedor:</b> ${process.supplier}</p><p><b>Centro de custo:</b> ${process.costCenter || '-'}</p><p><b>Valor:</b> ${money(process.value)}</p><p><b>Responsável:</b> ${process.owner}</p><p><b>Data:</b> ${process.createdAt}</p><p><b>Observações:</b> ${process.notes || '-'}</p>`;
  detailModal.showModal();
}

function detailInvoice(id) {
  const invoice = invoices.find(item => item.id === id);
  $('#modalContent').innerHTML = `<button class="close-detail" onclick="detailModal.close()">Fechar</button><p class="kicker">Nota Fiscal</p><h2>${invoice.number}</h2>${invoice.image ? `<img src="${invoice.image}" class="thumb" onclick="openImage('${invoice.id}')">` : ''}<p><span class="badge ${statusClass(invoice.status)}">${invoice.status}</span></p><p><b>Pedido:</b> ${invoice.order}</p><p><b>Fornecedor:</b> ${invoice.supplier}</p><p><b>Valor:</b> ${money(invoice.value)}</p><p><b>Emissão:</b> ${invoice.issueDate}</p><p><b>Recebimento:</b> ${invoice.receiveDate}</p><p><b>Responsável:</b> ${invoice.owner}</p><p><b>Observações:</b> ${invoice.notes || '-'}</p>`;
  detailModal.showModal();
}
function editInvoice(id) {
  const invoice = invoices.find(item => item.id === id);
  Object.entries({ invoiceId: invoice.id, invoiceNumber: invoice.number, orderNumber: invoice.order, invoiceSupplier: invoice.supplier, invoiceValue: invoice.value, issueDate: invoice.issueDate, receiveDate: invoice.receiveDate, invoiceStatus: invoice.status, invoiceOwner: invoice.owner, invoiceNotes: invoice.notes }).forEach(([key, value]) => $('#' + key).value = value || '');
  invoiceModal.showModal();
}
function deleteInvoice(id) { if (confirm('Excluir nota fiscal?')) { invoices = invoices.filter(invoice => invoice.id !== id); save(); } }
function openImage(id) { const invoice = invoices.find(item => item.id === id); $('#imageLightbox img').src = invoice.image; $('#imageLightbox').classList.remove('hidden'); }

function exportCsv() {
  const rows = [['Tipo', 'Número', 'Fornecedor', 'Valor', 'Status'], ...processes.map(process => [process.type, process.sapNumber, process.supplier, process.value, process.status]), ...invoices.map(invoice => ['Nota Fiscal', invoice.number, invoice.supplier, invoice.value, invoice.status])];
  download('relatorio-sap.csv', rows.map(row => row.join(';')).join('\n'));
}
function download(name, text) { const anchor = document.createElement('a'); anchor.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); anchor.download = name; anchor.click(); }
function seed() {
  processes = [
    { id: uid(), type: 'Requisição', sapNumber: '1000123', description: 'Compra de notebooks', supplier: 'Tech Supply', costCenter: 'TI-001', value: 42000, createdAt: '2026-07-02', owner: 'Ana Souza', status: 'Em aprovação', notes: 'Prioridade alta' },
    { id: uid(), type: 'Pedido', sapNumber: '4500789', description: 'Contrato manutenção', supplier: 'Service Pro', costCenter: 'MAN-020', value: 18500, createdAt: '2026-07-08', owner: 'Bruno Lima', status: 'Aprovado', notes: '' },
    { id: uid(), type: 'Folha de Serviço', sapNumber: '8000456', description: 'Medição julho', supplier: 'Obras Prime', costCenter: 'ENG-900', value: 65000, createdAt: '2026-07-15', owner: 'Carla Nunes', status: 'Com Time de CNR', notes: 'Validar impostos' }
  ];
  invoices = [{ id: uid(), number: 'NF-9981', order: '4500789', supplier: 'Service Pro', value: 18500, issueDate: '2026-07-10', receiveDate: '2026-07-11', status: 'Aguardando lançamento', owner: 'Diego Fiscal', notes: '' }];
  save();
}

$$('[data-section]').forEach(button => button.onclick = () => navigate(button.dataset.section));
$('#menuButton').onclick = () => $('#menuPanel').classList.toggle('open');
$('#newDemandBtn').onclick = () => demandModal.showModal();
$('#newProcessBtn').onclick = () => openProcessModal();
$('#newInvoiceBtn').onclick = openInvoiceModal;
$$('[data-demand]').forEach(button => button.onclick = () => { demandModal.close(); button.dataset.demand === 'Nota Fiscal' ? openInvoiceModal() : openProcessModal(button.dataset.demand); });
['processSearch', 'processStatusFilter', 'processTypeFilter', 'supplierFilter', 'invoiceSearch', 'invoiceStatusFilter'].forEach(id => $('#' + id).addEventListener('input', renderAll));
$('#sortProcesses').onclick = () => { sortDesc = !sortDesc; renderProcesses(); };
$('#seedData').onclick = seed;
$('#clearData').onclick = () => confirm('Limpar todos os dados?') && (processes = [], invoices = [], save());
$('#themeToggle').onclick = () => { document.body.classList.toggle('dark'); localStorage.setItem('sapTheme', document.body.classList.contains('dark') ? 'dark' : 'light'); renderCharts(); };
$('#exportExcel').onclick = exportCsv;
$('#exportPdf').onclick = () => window.print();
$('#imageLightbox button').onclick = () => $('#imageLightbox').classList.add('hidden');
$('#backTop').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
addEventListener('scroll', () => $('#backTop').classList.toggle('show', scrollY > 350));
addEventListener('resize', renderCharts);
addEventListener('click', event => { if (!event.target.closest('.menu-panel') && !event.target.closest('#menuButton')) $('#menuPanel').classList.remove('open'); });
if (localStorage.getItem('sapTheme') === 'dark') document.body.classList.add('dark');
populateSelects();
renderAll();
