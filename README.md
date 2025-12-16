# Estoque UI - Borbolêlalá

Interface de usuário (Frontend) para o sistema de gerenciamento de estoque da Borbolêlalá. Este projeto fornece uma interface web rica, amigável e responsiva para interagir com a [API de Estoque](https://github.com/SEU_USUARIO/borbolelala-backend).

A aplicação foi desenvolvida com foco na simplicidade e eficiência, utilizando HTML, CSS e JavaScript puro (Vanilla JS), garantindo alta performance. Além disso, o projeto conta com uma **suíte robusta de testes automatizados E2E**.

## ✨ Funcionalidades

* **Dashboard Intuitivo:** Visualização de todos os produtos em uma tabela clara, com busca e filtros dinâmicos.
* **Gestão Completa de Produtos:** Interface baseada em modais para adicionar, editar e remover produtos de forma simples.
* **Ponto de Venda (PDV):** Fluxo de "Registrar Venda" que permite adicionar múltiplos produtos ao carrinho e dar baixa no estoque automaticamente.
* **Movimentação de Estoque:** Ferramenta para ajustes manuais rápidos de entrada e saída de itens.
* **Relatórios Gerenciais:** Geração de relatórios de "Estoque Baixo" e "Produtos por Categoria".
* **Design Temático:** Identidade visual alinhada com a marca Borbolêlalá.

## 🚀 Tecnologias

### Frontend
* **HTML5 & CSS3:** Estrutura semântica e estilização com variáveis CSS.
* **JavaScript (ES6+):** Lógica da aplicação e consumo de REST API (`fetch`, `async/await`).

### Quality Assurance (QA)
* **Cypress:** Framework de automação de testes End-to-End.
* **Cucumber (BDD):** Escrita de cenários em linguagem natural (Gherkin).
* **Testomat.io:** Gestão, relatórios e visibilidade dos testes na nuvem.

## 📋 Pré-requisitos

1.  **API Backend:** A [API de Estoque](https://github.com/SEU_USUARIO/borbolelala-backend) deve estar rodando (`http://localhost:8080`) e conectada ao MongoDB.
2.  **Node.js:** Necessário apenas se você deseja executar os testes automatizados (versão 16 ou superior).

## ▶️ Como Executar a Aplicação

Não há necessidade de instalação para rodar apenas o site.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/borbolelala-frontend.git](https://github.com/SEU_USUARIO/borbolelala-frontend.git)
    cd borbolelala-frontend
    ```

2.  **Abra o Frontend:**
    * Utilize a extensão **Live Server** no VS Code.
    * Ou abra o arquivo `index.html` diretamente no navegador.

## ⚙️ Configuração da API

Caso o seu backend esteja rodando em um endereço ou porta diferente do padrão, você pode alterar a URL da API no arquivo `app.js`:

```javascript
// Dentro de app.js
const API_BASE_URL = 'http://localhost:8080/api/produtos';
```
## 🧪 Testes Automatizados

Este projeto segue a metodologia *BDD (Behavior Driven Development)*. Os testes simulam o comportamento real do usuário, validando a integração entre Frontend, Backend e Banco de Dados.

### Cenários Cobertos
Os testes estão localizados em `cypress/e2e/features` e cobrem os seguintes fluxos críticos:

|ID | Cenário | Descrição |
|---|---------|-----------|
|CT01| Adicionar Produto | Valida o cadastro via modal e a persistência no banco.|
|CT02 | Busca de Produtos | Valida o filtro da tabela em tempo real.
|CT03 | Entrada de Estoque | Verifica o cálculo de soma ao adicionar itens ao inventário.
CT04 | Relatórios | Garante a geração da lista de produtos com estoque baixo.
CT05 | Venda (PDV)| Simula o fluxo completo de venda e baixa de múltiplos itens.

## ⚙️ Executando os Testes
1. **Instale as dependências de teste:**
```Bash
npm install
```
2. **Abra a interface do Cypress (Modo Interativo):**
Visualiza os testes rodando passo a passo no navegador.
```Bash
npx cypress open
```
*Selecione "E2E Testing" > Escolha o navegador > Clique em estoque.feature.*
3. **Rodar em modo Headless (Terminal):**
Ideal para CI/CD, roda todos os testes em background e gera vídeo.
```Bash
npx cypress run
```
4. **Integração com Testomat.io:**
Para sincronizar os resultados com o dashboard na nuvem:
```Bash
npx check-tests  # Importa os cenários novos
TESTOMATIO="SUA_API_KEY" npx cypress run  # Executa e envia o relatório
```
## 🖼️ Estrutura do Projeto

- `index.html`: Estrutura principal.
- `styles/`: Arquivos CSS.
- `app.js`: Lógica do Frontend.
- `cypress/`:
  - `e2e/features/`: Arquivos .feature (Gherkin).
  - `e2e/step_definitions/`: Implementação dos passos dos testes.
  - `support/pages/`: Padrão Page Objects (Mapeamento de elementos).
---

### 🎁 Bônus: `.gitignore` Essencial

Como agora você tem a pasta `node_modules` (que é gigante e não deve ir para o GitHub), crie um arquivo chamado `.gitignore` na raiz do projeto e cole isso:

```text
node_modules/
cypress/videos/
cypress/screenshots/
.env
```
Isso vai manter seu repositório limpo e leve! 🧹