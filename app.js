document.addEventListener('DOMContentLoaded', () => {

    // ===========================================================
    // API ESTOQUE (Conectado ao Backend Spring Boot com MongoDB)
    // ===========================================================
    const API_BASE_URL = 'https://borbolelala-estoque-api-backend.azurewebsites.net/api/produtos';
    const LOW_STOCK_THRESHOLD = 5;

    const api = (() => {
        const handleResponse = async (response) => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor.' }));
                throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
            }
            return response.status === 204 ? { success: true } : response.json();
        };

        const getProducts = () => fetch(API_BASE_URL).then(handleResponse);
        const addProduct = (productData) => fetch(API_BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) }).then(handleResponse);
        const updateProduct = (productId, productData) => fetch(`${API_BASE_URL}/${productId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) }).then(handleResponse);
        const deleteProduct = (productId) => fetch(`${API_BASE_URL}/${productId}`, { method: 'DELETE' }).then(handleResponse);

        const updateStock = async (productId, quantityChange) => {
            const response = await fetch(`${API_BASE_URL}/${productId}/movimentar`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidade: quantityChange })
            });
            return handleResponse(response);
        };
        
        const processSale = async (saleItems) => {
            // A implementação ideal seria um único endpoint no backend.
            // Esta simulação fará uma chamada para cada item.
            for (const item of saleItems) {
                await updateStock(item.id, -item.quantity);
            }
            return { success: true, message: "Venda registrada com sucesso!" };
        };

        return { getProducts, addProduct, updateProduct, deleteProduct, processSale, updateStock };
    })();

    // =======================================================
    // LÓGICA DA APLICAÇÃO (Frontend)
    // =======================================================

    // Elementos do DOM
    const mainView = document.getElementById('main-view');
    const tableBody = document.getElementById('products-table-body');
    const searchInput = document.getElementById('searchInput');
    const addProductBtn = document.getElementById('addProductBtn');
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    const cancelBtn = document.getElementById('cancelBtn');
    const stockModal = document.getElementById('stock-modal');
    const cancelStockBtn = document.getElementById('cancelStockBtn');
    const stockInBtn = document.getElementById('stockInBtn');
    const stockOutBtn = document.getElementById('stockOutBtn');
    const reportView = document.getElementById('report-view');
    const reportTitle = document.getElementById('report-title');
    const reportContent = document.getElementById('report-content');
    const lowStockReportBtn = document.getElementById('lowStockReportBtn');
    const categoryReportBtn = document.getElementById('categoryReportBtn');
    const backToMainViewBtn = document.getElementById('backToMainViewBtn');
    const saleBtn = document.getElementById('saleBtn');
    const saleModal = document.getElementById('sale-modal');
    const cancelSaleBtn = document.getElementById('cancelSaleBtn');
    const finalizeSaleBtn = document.getElementById('finalizeSaleBtn');
    const saleProductSearch = document.getElementById('saleProductSearch');
    const saleSearchResults = document.getElementById('sale-search-results');
    const saleItemsBody = document.getElementById('sale-items-body');
    const summaryTotalItems = document.getElementById('summary-total-items');
    const summaryTotalPrice = document.getElementById('summary-total-price');
    
    let currentProducts = [];
    let editingProductId = null;
    let stockProductId = null;
    let currentSale = [];

    const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const renderTable = (products) => {
        tableBody.innerHTML = '';
        if (products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum produto cadastrado.</td></tr>';
            return;
        }

        products.forEach(product => {
            const isLowStock = product.quantidade <= LOW_STOCK_THRESHOLD;
            const row = document.createElement('tr');
            row.className = isLowStock ? 'low-stock' : '';

            row.innerHTML = `
                <td>${product.id.slice(-6)}...</td>
                <td>${product.nome}</td>
                <td>${product.categoria}</td>
                <td>${product.quantidade} ${isLowStock ? ' ⚠️' : ''}</td>
                <td>${formatCurrency(product.preco)}</td>
                <td class="actions-cell">
                    <button class="edit-btn" data-id="${product.id}" title="Editar">✏️</button>
                    <button class="delete-btn" data-id="${product.id}" title="Remover">🗑️</button>
                    <button class="stock-btn" data-id="${product.id}" title="Movimentar Estoque">📦</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    const loadProducts = async () => {
        try {
            currentProducts = await api.getProducts();
            renderTable(currentProducts);
        } catch (error) {
            alert(`Erro ao carregar produtos: ${error.message}`);
        }
    };

    const openModalForEdit = (productId) => {
        const product = currentProducts.find(p => p.id === productId);
        if (!product) return;
        editingProductId = productId;
        modalTitle.textContent = 'Editar Produto';
        document.getElementById('productQuantity').disabled = true;
        form.elements.productId.value = product.id;
        form.elements.productName.value = product.nome;
        form.elements.productCategory.value = product.categoria;
        form.elements.productQuantity.value = product.quantidade;
        form.elements.productPrice.value = product.preco;
        modal.style.display = 'flex';
    };

    const openModalForAdd = () => {
        editingProductId = null;
        modalTitle.textContent = 'Adicionar Novo Produto';
        form.reset();
        document.getElementById('productQuantity').disabled = false;
        modal.style.display = 'flex';
    };

    const openStockModal = (productId) => {
        const product = currentProducts.find(p => p.id === productId);
        if (!product) return;
        stockProductId = productId;
        document.getElementById('stock-product-name').textContent = product.nome;
        document.getElementById('stock-product-quantity').textContent = product.quantidade;
        document.getElementById('stockQuantity').value = '';
        stockModal.style.display = 'flex';
    };

        const openSaleModal = () => {
        currentSale = [];
        renderSaleItems();
        saleProductSearch.value = '';
        saleSearchResults.innerHTML = '';
        saleModal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
        stockModal.style.display = 'none';
        saleModal.style.display = 'none';
    };

    // Funções de Relatórios
    const showMainView = () => { reportView.style.display = 'none'; mainView.style.display = 'block'; };
    const showReportView = (title, contentHTML) => { reportTitle.textContent = title; reportContent.innerHTML = contentHTML; mainView.style.display = 'none'; reportView.style.display = 'block'; };
    const generateLowStockReport = () => {
        const lowStockProducts = currentProducts.filter(p => p.quantidade <= LOW_STOCK_THRESHOLD);
        let reportHTML = `<table><thead><tr><th>ID</th><th>Nome</th><th>Categoria</th><th>Qtd.</th><th>Recomendação</th></tr></thead><tbody>`;
        if (lowStockProducts.length > 0) { lowStockProducts.forEach(p => { reportHTML += `<tr class="low-stock"><td>${p.id.slice(-6)}...</td><td>${p.nome}</td><td>${p.categoria}</td><td>${p.quantidade}</td><td>Repor estoque</td></tr>`; }); } else { reportHTML += '<tr><td colspan="5" style="text-align:center;">Nenhum produto com estoque baixo.</td></tr>'; }
        reportHTML += '</tbody></table>'; showReportView('Relatório: Produtos com Estoque Baixo', reportHTML);
    };
    const generateCategoryReport = () => {
        const productsByCategory = currentProducts.reduce((acc, product) => { (acc[product.categoria] = acc[product.categoria] || []).push(product); return acc; }, {});
        let reportHTML = ''; const sortedCategories = Object.keys(productsByCategory).sort();
        if (sortedCategories.length > 0) { sortedCategories.forEach(category => { reportHTML += `<h3 class="category-title">${category}</h3><table><thead><tr><th>ID</th><th>Nome</th><th>Qtd.</th><th>Preço</th></tr></thead><tbody>`; productsByCategory[category].forEach(p => { reportHTML += `<tr><td>${p.id.slice(-6)}...</td><td>${p.nome}</td><td>${p.quantidade}</td><td>${formatCurrency(p.preco)}</td></tr>`; }); reportHTML += '</tbody></table>'; }); } else { reportHTML += '<p style="text-align:center; padding: 2rem;">Nenhum produto para exibir.</p>';}
        showReportView('Relatório: Produtos por Categoria', reportHTML);
    };
   
    const updateSaleSummary = () => { 
        const totalItems = currentSale.reduce((sum, item) => sum + item.quantity, 0); const totalPrice = currentSale.reduce((sum, item) => sum + (item.price * item.quantity), 0); 
        summaryTotalItems.textContent = totalItems; summaryTotalPrice.textContent = formatCurrency(totalPrice); 
    };

    const renderSaleItems = () => { 
        saleItemsBody.innerHTML = ''; currentSale.forEach(item => { const row = document.createElement('tr'); row.innerHTML = `<td>${item.nome}</td><td><input type="number" class="sale-item-quantity" data-id="${item.id}" value="${item.quantity}" min="1" max="${item.stock}"></td><td>${formatCurrency(item.price * item.quantity)}</td><td><button class="delete-sale-item-btn" data-id="${item.id}" title="Remover item">🗑️</button></td>`; saleItemsBody.appendChild(row); }); updateSaleSummary(); 
    };

    const addProductToSale = (productId) => { 
        const product = currentProducts.find(p => p.id === productId); if (product && !currentSale.some(item => item.id === productId)) { currentSale.push({ id: product.id, nome: product.nome, price: product.preco, quantity: 1, stock: product.quantidade }); renderSaleItems(); saleProductSearch.value = ''; saleSearchResults.innerHTML = ''; } 
    };

    // =======================================================
    // EVENT LISTENERS
    // =======================================================

    addProductBtn.addEventListener('click', openModalForAdd);
    saleBtn.addEventListener('click', openSaleModal);
    searchInput.addEventListener('input', (e) => { const searchTerm = e.target.value.toLowerCase(); const filteredProducts = currentProducts.filter(p => p.nome.toLowerCase().includes(searchTerm) || p.categoria.toLowerCase().includes(searchTerm)); renderTable(filteredProducts); });
        
    // *** LISTENER DO BOTÃO CANCELAR ADICIONADO AQUI ***
    cancelBtn.addEventListener('click', closeModal);
    cancelStockBtn.addEventListener('click', closeModal);
    cancelSaleBtn.addEventListener('click', closeModal);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productData = {
            nome: form.elements.productName.value,
            categoria: form.elements.productCategory.value,
            quantidade: parseInt(form.elements.productQuantity.value),
            preco: parseFloat(form.elements.productPrice.value)
        };
        try {
            if (editingProductId) {
                await api.updateProduct(editingProductId, productData);
            } else {
                await api.addProduct(productData);
            }
            closeModal();
            await loadProducts();
        } catch (error) {
            alert(`Erro ao salvar produto: ${error.message}`);
        }
    });
    
    tableBody.addEventListener('click', async (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const productId = button.dataset.id;
        if (button.classList.contains('edit-btn')) {
            openModalForEdit(productId);
        }
        if (button.classList.contains('delete-btn')) {
            if (confirm('Tem certeza que deseja remover este produto?')) {
                try {
                    await api.deleteProduct(productId);
                    await loadProducts();
                } catch (error) {
                    alert(`Erro ao deletar produto: ${error.message}`);
                }
            }
        }
        if (button.classList.contains('stock-btn')) {
            openStockModal(productId);
        }
    });

    stockInBtn.addEventListener('click', async () => {
        const quantity = parseInt(document.getElementById('stockQuantity').value);
        if (isNaN(quantity) || quantity <= 0) return alert('Por favor, insira uma quantidade válida.');
        try {
            await api.updateStock(stockProductId, quantity);
            closeModal();
            await loadProducts();
        } catch (error) {
            alert(`Erro ao registrar entrada: ${error.message}`);
        }
    });

    stockOutBtn.addEventListener('click', async () => {
        const quantity = parseInt(document.getElementById('stockQuantity').value);
        if (isNaN(quantity) || quantity <= 0) return alert('Por favor, insira uma quantidade válida.');
        try {
            await api.updateStock(stockProductId, -quantity);
            closeModal();
            await loadProducts();
        } catch (error) {
            alert(`Erro ao registrar saída: ${error.message}`);
        }
    });
    
    finalizeSaleBtn.addEventListener('click', async () => {
        if (currentSale.length === 0) {
            return alert('Adicione pelo menos um produto à venda.');
        }
        try {
            await api.processSale(currentSale);
            alert("Venda registrada com sucesso!");
            closeModal();
            await loadProducts();
        } catch (error) {
            alert(`Erro ao finalizar venda: ${error.message}`);
        }
    });

    lowStockReportBtn.addEventListener('click', (e) => { e.preventDefault(); generateLowStockReport(); });
    categoryReportBtn.addEventListener('click', (e) => { e.preventDefault(); generateCategoryReport(); });
    backToMainViewBtn.addEventListener('click', showMainView);

        // Lógica completa da busca de produtos da Venda
    saleProductSearch.addEventListener('input', () => {
        const searchTerm = saleProductSearch.value.toLowerCase();
        saleSearchResults.innerHTML = '';
        if (searchTerm.length < 2) return;
        const results = currentProducts.filter(p => p.nome.toLowerCase().includes(searchTerm) && p.quantidade > 0);
        results.forEach(product => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.textContent = `${product.nome} (Estoque: ${product.quantidade})`;
            div.dataset.id = product.id;
            saleSearchResults.appendChild(div);
        });
    });
    saleSearchResults.addEventListener('click', (e) => { if (e.target.classList.contains('search-result-item')) { addProductToSale(e.target.dataset.id); }});
    
    saleItemsBody.addEventListener('change', (e) => { if (e.target.classList.contains('sale-item-quantity')) { const productId = e.target.dataset.id; const newQuantity = parseInt(e.target.value); const item = currentSale.find(i => i.id === productId); if (item && newQuantity > 0 && newQuantity <= item.stock) { item.quantity = newQuantity; renderSaleItems(); } else { alert(`Quantidade inválida. O estoque para "${item.nome}" é ${item.stock}.`); e.target.value = item.quantity; } } });
    saleItemsBody.addEventListener('click', (e) => { if (e.target.closest('.delete-sale-item-btn')) { const productId = e.target.closest('.delete-sale-item-btn').dataset.id; currentSale = currentSale.filter(item => item.id !== productId); renderSaleItems(); } });
    
    loadProducts();
});
