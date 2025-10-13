# Estoque UI - Borbolêlalá

Interface de usuário (Frontend) para o sistema de gerenciamento de estoque da Borbolêlalá. Este projeto fornece uma interface web rica, amigável e responsiva para interagir com a [API de Estoque](https://github.com/SEU_USUARIO/borbolelala-backend).

A aplicação foi desenvolvida com foco na simplicidade e eficiência, utilizando HTML, CSS e JavaScript puro (Vanilla JS) para garantir performance e fácil manutenção.

## ✨ Funcionalidades

* **Dashboard Intuitivo:** Visualização de todos os produtos em uma tabela clara, com busca e filtros dinâmicos.
* **Gestão Completa de Produtos:** Interface baseada em modais para adicionar, editar e remover produtos de forma simples.
* **Ponto de Venda (PDV):** Um fluxo de "Registrar Venda" que permite adicionar múltiplos produtos a um carrinho e dar baixa no estoque de todos os itens de uma só vez.
* **Movimentação de Estoque:** Ferramenta para ajustes manuais rápidos de entrada e saída de itens específicos.
* **Relatórios Gerenciais:** Geração de relatórios de "Estoque Baixo" e "Produtos por Categoria" para auxiliar na tomada de decisões.
* **Design Temático:** A interface utiliza as cores e a identidade visual da marca Borbolêlalá.

## 🚀 Tecnologias Utilizadas

* **HTML5:** Para a estrutura semântica da aplicação.
* **CSS3:** Para a estilização, utilizando variáveis CSS para um design coeso e temático.
* **JavaScript (ES6+):** Lógica da aplicação, manipulação do DOM e comunicação com a API, utilizando `async/await` e `fetch`.
* **Google Fonts:** Para a tipografia da aplicação, alinhada com a marca.

## 📋 Pré-requisitos

Para que este frontend funcione, é **essencial** que a [API de Estoque (Backend)](https://github.com/SEU_USUARIO/borbolelala-backend) esteja em execução, pois é ela quem fornece todos os dados.

## ▶️ Como Executar

Não há necessidade de compilação ou instalação de dependências.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/borbolelala-frontend.git](https://github.com/SEU_USUARIO/borbolelala-frontend.git)
    cd borbolelala-frontend
    ```

2.  **Execute o backend:** Certifique-se de que a API de Estoque esteja rodando (geralmente em `http://localhost:8080`).

3.  **Abra o arquivo `index.html`:**
    A maneira mais fácil é usar uma extensão como o **Live Server** no VS Code, que recarrega a página automaticamente após as alterações.
    * Clique com o botão direito no arquivo `index.html` e selecione "Open with Live Server".

    Alternativamente, você pode abrir o arquivo `index.html` diretamente no seu navegador.

## ⚙️ Configuração da API

Caso o seu backend esteja rodando em um endereço ou porta diferente do padrão, você pode alterar a URL da API no arquivo `app.js`:

```javascript
// Dentro de app.js
const API_BASE_URL = 'http://localhost:8080/api/produtos';
```

## 🖼️ Estrutura do Projeto

* **`index.html`**: Arquivo principal com a estrutura de toda a aplicação.
* **`style.css`**: Contém todos os estilos da interface.
* **`app.js`**: O cérebro da aplicação, responsável por toda a lógica, manipulação de eventos e chamadas para a API.

---