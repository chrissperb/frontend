import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import EstoquePage from "../../support/pages/EstoquePage";

Given("que acesso o sistema Borbolelala", () => {
    EstoquePage.visit();
});

// --- CT01 ---
When("clico no botão {string}", (botao) => {
    if(botao === "Adicionar Produto") { EstoquePage.clicarBotaoAdicionar(); }
    if(botao === "Registrar Venda") { EstoquePage.elements.btnSale().click(); }
});

When("preencho o cadastro do produto:", (dataTable) => {
    const dados = dataTable.rowsHash();
    EstoquePage.preencherCadastroProduto(dados);
});

When("salvo o novo produto", () => {
   // Já feito no passo anterior
});

Then("o produto {string} deve estar visível na tabela", (nome) => {
    EstoquePage.elements.tableBody().contains(nome).should('be.visible');
});

Given("que existe um produto {string} cadastrado", (nome) => {
    EstoquePage.garantirProdutoNoBanco(nome);
});

Given("que existe um produto {string} com {int} unidades", (nome, qtd) => {
    EstoquePage.garantirProdutoNoBanco(nome, qtd);
});

Given("que existe um produto {string} com estoque {int}", (nome, qtd) => {
    EstoquePage.garantirProdutoNoBanco(nome, qtd);
});


When("pesquiso por {string}", (termo) => {
    EstoquePage.elements.searchInput().type(termo);
});

Then("devo ver apenas produtos contendo {string} na listagem", (termo) => {
    EstoquePage.elements.tableBody().contains(termo);
});

When("clico no botão de estoque do produto {string}", (nome) => {
    // Apenas armazena o nome para o próximo passo ou clica direto
});

When("informo a quantidade {int} para entrada", (qtd) => {
    cy.get('body').then(($body) => {
        const nomeProduto = $body.find('td').first().next().text(); 
        EstoquePage.movimentarEstoque(nomeProduto, qtd);
    });
});

Then("a quantidade atualizada na tabela deve ser {int}", (qtd) => {
    EstoquePage.elements.modalStock().should('not.be.visible');
});

When("acesso o menu de Relatórios", () => {
    EstoquePage.elements.btnReports().click();
});

When("seleciono a opção {string}", (opcao) => {
    if(opcao === "Estoque Baixo") EstoquePage.elements.btnLowStock().click({force: true});
});

Then("devo visualizar a tela de relatórios com o título {string}", (titulo) => {
    EstoquePage.elements.reportView().should('be.visible');
    EstoquePage.elements.reportTitle().should('have.text', titulo);
});

Then("o produto {string} deve aparecer no relatório", (nome) => {
    EstoquePage.elements.reportView().contains(nome).should('be.visible');
});

When("busco e adiciono o produto {string} na venda", (nome) => {
    EstoquePage.elements.inputSaleSearch().type(nome);
    EstoquePage.elements.saleResults().find('.search-result-item').should('be.visible').first().click();
});

When("finalizo a venda", () => {
    cy.intercept('PATCH', '**/api/produtos/*/movimentar', { statusCode: 200 }).as('vendaItem');
    EstoquePage.elements.btnFinalizeSale().click();
});

Then("devo ver uma mensagem de sucesso {string}", (msg) => {
    cy.on('window:alert', (str) => {
        expect(str).to.equal(msg);
    });
});