document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api-produto-41km.onrender.com/produtoMongo'; // A API será servida no mesmo host
 
    const formAdicionar = document.getElementById('form-adicionar');
    const tabelaprodutosBody = document.querySelector('#tabela-produtos tbody');
 
    // Modal de edição
    const modalEditar = document.getElementById('modal-editar');
    const formEditar = document.getElementById('form-editar');
    const closeModalButton = document.querySelector('.close-button');
    const idEditInput = document.getElementById('id-edit');
    const nomeEditInput = document.getElementById('nome-edit');
    const precoEditInput = document.getElementById('preco-edit');
    const cprecoEditInput = document.getElementById('cpreco-edit');
 
    // Função para buscar e renderizar as produtos
    async function fetchAndRenderprodutos() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos');
            }
            const produtos = await response.json();
            renderprodutos(produtos);
        } catch (error) {
            console.error('Erro:', error);
            tabelaprodutosBody.innerHTML = `<tr><td colspan="5">Erro ao carregar dados. Verifique se o servidor está rodando.</td></tr>`;
        }
    }
 
    // Função para renderizar a tabela de produtos
    function renderprodutos(produtos) {
        tabelaprodutosBody.innerHTML = ''; // Limpa a tabela antes de renderizar
        if (produtos.length === 0) {
            tabelaprodutosBody.innerHTML = `<tr><td colspan="5">Nenhuma produto cadastrada.</td></tr>`;
            return;
        }
 
        produtos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto._id}</td>
                <td>${produto.nome}</td>
                <td>${produto.preco}</td>
                <td>${produto.cpreco}</td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id=´${produto._id}´>Editar</button>
                    <button class="delete-btn" data-id=´${produto._id}´>Excluir</button>
                </td>
            `;
            tabelaprodutosBody.appendChild(tr);
        });
    }
 
    // Event listener para o formulário de adicionar
    formAdicionar.addEventListener('submit', async (event) => {
        event.preventDefault();
 
        const nome = document.getElementById('nome-add').value;
        const preco = document.getElementById('preco-add').value;
        const cpreco = document.getElementById('cpreco-add').value;
 
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, preco, cpreco }),
            });
 
            if (!response.ok) {
                throw new Error('Erro ao cadastrar produto');
            }
 
            formAdicionar.reset(); // Limpa o formulário
            fetchAndRenderprodutos(); // Atualiza a tabela
        } catch (error) {
            console.error('Erro ao adicionar:', error);
            alert('Não foi possível cadastrar a produto.');
        }
    });
 
    // Event listener para os botões de editar e excluir (usando delegação de eventos)
    tabelaprodutosBody.addEventListener('click', async (event) => {
        const target = event.target;
 
        // Botão de Excluir
        if (target.classList.contains('delete-btn')) {
            const id = target.dataset.id;
            if (confirm(`Tem certeza que deseja excluir a produto com ID ${id}?`)) {
                try {
                    const response = await fetch(`${apiUrl}/${id}`, {
                        method: 'DELETE',
                    });
                    if (response.status !== 204) { // DELETE bem-sucedido retorna 204
                        throw new Error('Erro ao excluir produto');
                    }
                    fetchAndRenderprodutos(); // Atualiza a tabela
                } catch (error) {
                    console.error('Erro ao excluir:', error);
                    alert('Não foi possível excluir a produto.');
                }
            }
        }
 
        // Botão de Editar
        if (target.classList.contains('edit-btn')) {
            const id = target.dataset.id;
            try {
                const response = await fetch(`${apiUrl}/${id}`);
                if (!response.ok) throw new Error('produto não encontrada');
                const produto = await response.json();
                
                // Preenche o modal com os dados da produto
                idEditInput.value = produto._id;
                nomeEditInput.value = produto.nome;
                precoEditInput.value = produto.preco;
                cprecoEditInput.value = produto.cpreco;
 
                // Exibe o modal
                modalEditar.style.display = 'block';
            } catch (error) {
                console.error('Erro ao buscar para editar:', error);
                alert('Não foi possível carregar os dados para edição.');
            }
        }
    });
 
    // Event listener para o formulário de edição
    formEditar.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = idEditInput.value;
        const produtoAtualizada = {
            nome: nomeEditInput.value,
            preco: parseInt(precoEditInput.value, 10),
            cpreco: cprecoEditInput.value,
        };
 
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produtoAtualizada),
            });
            if (!response.ok) throw new Error('Erro ao atualizar produto');
            
            modalEditar.style.display = 'none'; // Esconde o modal
            fetchAndRenderprodutos(); // Atualiza a tabela
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            alert('Não foi possível atualizar os dados da produto.');
        }
    });
 
    // Fechar o modal
    closeModalButton.onclick = () => {
        modalEditar.style.display = 'none';
    };
    window.onclick = (event) => {
        if (event.target == modalEditar) {
            modalEditar.style.display = 'none';
        }
    };
 
    // Carrega os dados iniciais
    fetchAndRenderprodutos();
});