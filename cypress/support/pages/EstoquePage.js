class EstoquePage {
    API_URL = 'http://localhost:8080/api/produtos';

    elements = {
        btnAddProduct: () => cy.get('#addProductBtn'),
        tableBody: () => cy.get('#products-table-body'),
        modalProduct: () => cy.get('#product-modal'),
        inputName: () => cy.get('#product-modal').find('#productName'),
        inputCategory: () => cy.get('#product-modal').find('#productCategory'),
        inputQtd: () => cy.get('#product-modal').find('#productQuantity'),
        inputPrice: () => cy.get('#product-modal').find('#productPrice'),  
        btnSave: () => cy.get('#product-form').contains('button', 'Salvar'),    
        searchInput: () => cy.get('#searchInput'),
        btnSale: () => cy.get('#saleBtn'),
        btnReports: () => cy.get('#reportsBtn'),
        btnLowStock: () => cy.get('#lowStockReportBtn'),
        reportView: () => cy.get('#report-view'),
        reportTitle: () => cy.get('#report-title'),
        modalStock: () => cy.get('#stock-modal'),
        inputStockQtd: () => cy.get('#stockQuantity'),
        btnStockIn: () => cy.get('#stockInBtn'),
        modalSale: () => cy.get('#sale-modal'),
        inputSaleSearch: () => cy.get('#saleProductSearch'),
        saleResults: () => cy.get('#sale-search-results'),
        btnFinalizeSale: () => cy.get('#finalizeSaleBtn')
    }

    visit() {
        cy.intercept('GET', '**/api/produtos').as('getProdutos');
        cy.visit('/'); 
        cy.wait('@getProdutos');
    }

    clicarBotaoAdicionar() {
        this.elements.btnAddProduct().should('be.visible').click();
        this.elements.modalProduct().should('be.visible');
    }

    preencherCadastroProduto(dados) {
        cy.intercept('POST', '**/api/produtos').as('createProduct');
        cy.intercept('GET', '**/api/produtos').as('reloadTable');

        this.elements.inputName().should('be.visible').clear({ force: true }).type(dados.nome);
        this.elements.inputCategory().should('be.visible').clear({ force: true }).type(dados.categoria);
        this.elements.inputQtd().should('be.visible').clear({ force: true }).type(dados.quantidade);
        this.elements.inputPrice().should('be.visible').clear({ force: true }).type(dados.preco);
        
        this.elements.btnSave().should('be.visible').click();
        
        cy.wait('@createProduct').its('response.statusCode').should('be.oneOf', [200, 201]);        
        cy.wait('@reloadTable');
    }

    // --- MÉTODOS DE APOIO (BACKEND DIRECT) ---
    garantirProdutoNoBanco(nome, qtd = 10) {
        cy.request('GET', this.API_URL).then((response) => {
            const produtos = response.body;
            const produtoExistente = produtos.find(p => p.nome === nome);
            if (produtoExistente) {
                cy.request('DELETE', `${this.API_URL}/${produtoExistente.id}`);
            }
            cy.request('POST', this.API_URL, {
                nome: nome,
                categoria: 'Teste Automatizado',
                quantidade: qtd,
                preco: 50.00
            });
        });
        this.visit();
    }

    movimentarEstoque(nomeProduto, qtd) {
        cy.intercept('PATCH', '**/movimentar').as('updateStock');
        cy.intercept('GET', '**/api/produtos').as('reloadTable');
        
        cy.contains('tr', nomeProduto).find('.stock-btn').click();
        this.elements.modalStock().should('be.visible');
        this.elements.inputStockQtd().type(qtd);
        this.elements.btnStockIn().click();
        
        cy.wait('@updateStock').its('response.statusCode').should('eq', 200);
        cy.wait('@reloadTable');
    }

    realizarVenda(nomeProduto) {
        cy.intercept('PATCH', '**/movimentar').as('vendaItem'); 
        this.elements.btnSale().click();
        this.elements.inputSaleSearch().type(nomeProduto);
        cy.wait(500);
        this.elements.saleResults().find('.search-result-item').first().click();
        this.elements.btnFinalizeSale().click();
        cy.wait('@vendaItem');
    }

    acessarRelatorioEstoqueBaixo() {
        this.elements.btnLowStock().click({ force: true });
    }
}

export default new EstoquePage();