function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

// Calcular Urgência
function calcularUrgencia(dueDate, status) {
  if (status === "Concluído") return "concluido";

  if (!dueDate) return "sem-prazo";

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const prazo = new Date(dueDate + "T00:00:00");

  const diffMs = prazo - hoje;

  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias <= 3) return "critico";
  if (diffDias <= 10) return "atencao";
  return "tranquilo";
}

// Campo para validar numeros e letras
const REGEX_APENAS_LETRAS = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/;
const REGEX_NUMERO_PROCESSO = /^[0-9./-]*$/;

// Serviço de persistência: encapsula a busca e o salvamento para facilitar a migração para uma API real/banco de dados depois
const ProcessoService = {
  async getAll() {
    const data = localStorage.getItem("jurisflow_processos");
    if (!data) return [];

    try {
      const processos = JSON.parse(data);
      return Array.isArray(processos) ? processos : [];
    } catch (error) {
      console.error("Erro ao ler dados do localStorage", error);
      return [];
    }
  },

  // Salva todos os processos
  async saveAll(processos) {
    try {
      localStorage.setItem("jurisflow_processos", JSON.stringify(processos));
      return true;
    } catch (error) {
      console.error("Erro ao salvar no localStorage", error);
      return false;
    }
  },
};
// Mapeamento Visual das etapas do fluxo
const colunas = ["A Fazer", "Em Andamento", "Concluído"];

// Mapeamento dos elementos da interface (DOM)
const boardContainer = document.getElementById("boardContainer");
const cardModal = document.getElementById("cardModal");
const cardForm = document.getElementById("cardForm");
const btnNewCard = document.getElementById("btnNewCard");
const btnCancelModal = document.getElementById("btnCancelModal");

// Campo do fomulário
const inputNumero = document.getElementById("inputNumero");
const inputCliente = document.getElementById("inputCliente");
const inputArea = document.getElementById("inputArea");
const inputPrazo = document.getElementById("inputPrazo");
const inputAdvogado = document.getElementById("inputAdvogado");

// Não permite datas anteriores no formulário
if (inputPrazo) {
  inputPrazo.min = new Date().toISOString().split("T")[0];
}

function bloquearNumeros(event) {
  const valor = event.target.value;
  if (!REGEX_APENAS_LETRAS.test(valor)) {
    event.target.value = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
  }
}

function bloquearLetras(event) {
  const valor = event.target.value;
  if (!REGEX_NUMERO_PROCESSO.test(valor)) {
    event.target.value = valor.replace(/[^0-9./-]/g, "");
  }
}

if (inputCliente) inputCliente.addEventListener("input", bloquearNumeros);
if (inputAdvogado) inputAdvogado.addEventListener("input", bloquearNumeros);
if (inputNumero) inputNumero.addEventListener("input", bloquearLetras);

// Renderização do quadro
async function renderBoard() {
  const processos = await ProcessoService.getAll();
  boardContainer.innerHTML = "";

  colunas.forEach((statusColuna) => {
    const processosDaColuna = processos.filter(
      (p) => p.status === statusColuna,
    );

    const colunaDiv = document.createElement("div");
    colunaDiv.className = "kanban-column";

    const colunaSlug = statusColuna
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

    colunaDiv.classList.add(`kanban-column--${colunaSlug}`);

    colunaDiv.innerHTML = `
    <div class="column-header">
        <h3>${escapeHTML(statusColuna)}</h3>
        <span class="column-count">${processosDaColuna.length} </span>
    </div>
    <div class="cards-container"></div>`;

    const cardsContainer = colunaDiv.querySelector(".cards-container");

    if (processosDaColuna.length === 0) {
      cardsContainer.innerHTML = `
    <div class="empty-state">
      <span class="empty-state-icon">📭</span>
      <p>Nenhum processo aqui ainda</p>
    </div>`;
    } else {
      processosDaColuna.forEach((processo) => {
        const cardElement = createCardElement(processo);
        cardsContainer.appendChild(cardElement);
      });
    }

    boardContainer.appendChild(colunaDiv);
  });
}
// Monta a estrutura HTML de cada card indicidual
function createCardElement(processo) {
  const card = document.createElement("div");
  card.className = "process-card";

  const urgencia = calcularUrgencia(processo.due_date, processo.status);
  card.classList.add(`process-card--${urgencia}`);

  //   Trata formato da data e fallback de número opcional
  const dataFormatada = processo.due_date
    ? processo.due_date.split("-").reverse().join("/")
    : "Sem prazo";

  const numeroExibicao =
    processo.court_number &&
    typeof processo.court_number === "string" &&
    processo.court_number.trim() !== ""
      ? processo.court_number
      : "Aguardando Protocolo";

  // Reservado para renderizar o insight da IA, caso exista no objeto
  const aiInsightBlock = processo.ai_summary
    ? `<div class="ai-summary-box"> 🤖 <strong>IA insight: </strong> ${escapeHTML(processo.ai_summary)}
</div>`
    : "";

  card.innerHTML = `
<span class="card-tag">${escapeHTML(processo.legal_area)}</span>
<h4 class="card-title">${escapeHTML(processo.client_name)}</h4>
<p class="card-info"><strong>Proc:</strong> ${escapeHTML(numeroExibicao)}</p>
<p class="card-info"><strong>Adv:</strong> ${escapeHTML(processo.lawyer_assigned)}</p>
<p class="card-info"><strong>Prazo:</strong> ${escapeHTML(dataFormatada)}</p>

${aiInsightBlock}

<div class="card-actions">
${
  processo.status !== "A Fazer"
    ? `<button class="btn-card-action btn-move" data-action="voltar" data-id="${processo.id}">← Voltar</button>`
    : ""
}
<button class="btn-card-action btn-delete" data-id="${processo.id}">Excluir</button>
${
  processo.status !== "Concluído"
    ? `<button class="btn-card-action btn-move" data-action="avancar" data-id="${processo.id}">Avançar →</button>`
    : ""
}
</div>
 `;
  return card;
}

// Mover card no fluxo (recalcula o índice da coluna e atualiza o estado)
async function moverProcesso(id, direcao) {
  let processos = await ProcessoService.getAll();

  processos = processos.map((p) => {
    if (String(p.id) === String(id)) {
      const indexAtual = colunas.indexOf(p.status);
      let novoIndex = direcao === "avancar" ? indexAtual + 1 : indexAtual - 1;

      if (novoIndex >= 0 && novoIndex < colunas.length) {
        p.status = colunas[novoIndex];
        p.updated_at = new Date().toISOString();
      }
    }
    return p;
  });
  await ProcessoService.saveAll(processos);
  renderBoard();
}

// Remover um processo do Fluxo com confirmação
async function excluirProcesso(id) {
  if (confirm("Tem certeza que deseja excluir este processo?")) {
    let processos = await ProcessoService.getAll();
    processos = processos.filter((p) => String(p.id) !== String(id));
    await ProcessoService.saveAll(processos);
    renderBoard();
  }
}
// Container dos cards listener único
boardContainer.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-id]");
  if (!botao) return;

  const id = botao.dataset.id;

  if (botao.classList.contains("btn-delete")) {
    excluirProcesso(id);
  } else if (botao.classList.contains("btn-move")) {
    moverProcesso(id, botao.dataset.action);
  }
});

//  Manupulação da Ações do Modal
btnNewCard.addEventListener("click", () => cardModal.showModal());

btnCancelModal.addEventListener("click", () => {
  cardModal.close();
  cardForm.reset();
});

// Captura do envia do formulário para salvar novo card
cardForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const numeroDigitado = inputNumero.value.trim();
  const clienteDigitado = inputCliente.value.trim();
  const advogadoDigitado = inputAdvogado.value.trim();
  const areaDigitada = inputArea.value;
  const prazoDigitado = inputPrazo.value;

  if (
    !clienteDigitado ||
    !areaDigitada ||
    !advogadoDigitado ||
    !prazoDigitado
  ) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  if (!REGEX_APENAS_LETRAS.test(clienteDigitado)) {
    alert("O nome do cliente deve conter apenas letras.");
    return;
  }
  if (!REGEX_APENAS_LETRAS.test(advogadoDigitado)) {
    alert("O nome do advogado deve conter apenas letras.");
    return;
  }

  //Validação final do número do processo (somente números)
  if (numeroDigitado !== "" && !REGEX_NUMERO_PROCESSO.test(numeroDigitado)) {
    alert("O número do processo deve conter apenas números (e / . -).");
    return;
  }

  const hojeISO = new Date().toISOString().split("T")[0];
  if (prazoDigitado < hojeISO) {
    alert("O prazo não pode ser uma data no passado.");
    return;
  }

  const processosAtuais = await ProcessoService.getAll();

  if (numeroDigitado !== "") {
    const jaExiste = processosAtuais.some(
      (p) => p.court_number && p.court_number.trim() === numeroDigitado,
    );

    if (jaExiste) {
      alert("Já existe um processo cadastrado com esse número.");
      return;
    }
  }

  const novoProcesso = {
    id:
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : Date.now().toString(),
    court_number: numeroDigitado,
    client_name: clienteDigitado,
    legal_area: areaDigitada,
    due_date: prazoDigitado,
    lawyer_assigned: advogadoDigitado,
    status: "A Fazer",
    ai_summary: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  processosAtuais.push(novoProcesso);

  await ProcessoService.saveAll(processosAtuais);
  renderBoard();

  cardModal.close();
  cardForm.reset();
});

//Carregamento do quadro de abertura da página
document.addEventListener("DOMContentLoaded", renderBoard);
