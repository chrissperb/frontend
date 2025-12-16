Feature: Gestão de Estoque Borbolelala
  Como gestor da loja
  Quero controlar produtos e vendas
  Para manter o inventário organizado

  Background:
    Given que acesso o sistema Borbolelala

  @estoque @smoke
  Scenario: CT01 - Adicionar Novo Produto
    When clico no botão "Adicionar Produto"
    And preencho o cadastro do produto:
      | nome       | Vestido de Seda |
      | categoria  | Vestuário       |
      | quantidade | 10              |
      | preco      | 150.00          |
    And salvo o novo produto
    Then o produto "Vestido de Seda" deve estar visível na tabela

  @estoque
  Scenario: CT02 - Buscar Produto Existente
    Given que existe um produto "Vestido de Seda" cadastrado
    When pesquiso por "Vestido"
    Then devo ver apenas produtos contendo "Vestido" na listagem

  @estoque
  Scenario: CT03 - Registrar Entrada de Estoque
    Given que existe um produto "Bermuda Masculina tamanho 8" com 8 unidades
    When clico no botão de estoque do produto "Bermuda Masculina tamanho 8"
    And informo a quantidade 5 para entrada
    Then a quantidade atualizada na tabela deve ser 13

  @estoque
  Scenario: CT04 - Validar Relatório de Estoque Baixo
    Given que existe um produto "Vestido Florido M" com 3 unidades
    When acesso o menu de Relatórios
    And seleciono a opção "Estoque Baixo"
    Then devo visualizar a tela de relatórios com o título "Relatório: Produtos com Estoque Baixo"
    And o produto "Vestido Florido M" deve aparecer no relatório

  @estoque
  Scenario: CT05 - Registrar Venda Completa
    Given que existe um produto "Saia Azul" com estoque 39
    When clico no botão "Registrar Venda"
    And busco e adiciono o produto "Saia Azul" na venda
    And finalizo a venda
    Then devo ver uma mensagem de sucesso "Venda registrada com sucesso!"