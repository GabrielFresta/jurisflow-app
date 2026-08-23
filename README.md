# ⚖️ JurisFlow

Sistema de gestão visual de processos jurídicos, no formato Kanban, desenvolvido para ajudar escritórios de advocacia a acompanhar o andamento de cada caso de forma simples e rápida.

🔗 **[Ver projeto ao vivo](#)** &nbsp;|&nbsp; 📂 **[Ver código-fonte](#)**

---

## 📌 Sobre o projeto

O JurisFlow nasceu da ideia de aplicar o conceito de Kanban (usado em gestão de projetos) para a rotina de um escritório de advocacia. Cada processo judicial vira um "card" que passa por 3 etapas — **A Fazer → Em Andamento → Concluído** — permitindo que a equipe visualize rapidamente o status de todos os casos em andamento.

O projeto foi construído com **JavaScript puro (Vanilla JS)**, sem frameworks, com foco em fixar conceitos fundamentais: manipulação de DOM, persistência de dados, validação de formulários e boas práticas de segurança no front-end.

---

## ✨ Funcionalidades

- 📋 Cadastro de processos com número, cliente, área do direito, prazo e advogado responsável
- 🔄 Fluxo Kanban: mover processos entre as etapas (Voltar / Avançar)
- 🗑️ Exclusão de processos com confirmação
- ✅ Validação de formulário em tempo real (letras e números nos campos corretos)
- ⏰ Indicador visual de urgência de prazo (borda colorida: crítico, atenção, tranquilo)
- 🎨 Identidade visual por coluna do fluxo
- 💾 Persistência local dos dados (localStorage)
- 📱 Layout responsivo

---

## 🛠️ Tecnologias e Ferramentas

<div>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" />
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" />
</div>

- **HTML5** — estrutura semântica, uso de `<dialog>` para o modal de cadastro
- **CSS3** — variáveis CSS, Flexbox, Grid, glassmorphism (`backdrop-filter`)
- **JavaScript (Vanilla)** — manipulação de DOM, `localStorage`, validação com regex, event delegation

---

## 🚀 Como rodar o projeto

```bash
# Clone o repositório
git clone https://github.com/GabrielFresta/jurisflow.git

# Entre na pasta do projeto
cd jurisflow

# Abra o index.html no navegador
# (ou use a extensão Live Server do VS Code)
```

Não é necessário instalar dependências — o projeto roda 100% no navegador.

---

## 📁 Estrutura do projeto

```
jurisflow/
├── index.html      # Estrutura da página e do formulário
├── style.css        # Estilos, variáveis de cor e responsividade
├── script.js         # Lógica do quadro, persistência e validações
└── README.md
```

---

## 🗺️ Próximos passos

- 🔌 Migrar a persistência do `localStorage` para uma API/banco de dados real
- 🤖 Integrar IA para gerar resumos automáticos de cada processo (`ai_summary`)
- 🧲 Drag and drop dos cards entre colunas
- 🔍 Filtro e busca por cliente/advogado

---

## 👨‍💻 Autor

Feito por **Gabriel Fresta**
Estudante de Análise e Desenvolvimento de Sistemas (UCAM) | Em formação FullStack JS

📫 Vamos nos conectar? [LinkedIn](#) &nbsp;|&nbsp; [GitHub](https://github.com/GabrielFresta)
