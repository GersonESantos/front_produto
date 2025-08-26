// const API_URL = 'https://front-pessoa-et5n.onrender.com/';
const API_URL = 'https://api-pessoa-1.onrender.com/pessoaMongo';
// Carrega as pessoas automaticamente ao iniciar
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('listarBtn').addEventListener('click', carregarPessoas);
});

async function carregarPessoas() {
  try {
    const res = await fetch(API_URL);
    const pessoas = await res.json();
    const tbody = document.querySelector('#tabelaPessoas tbody');
    tbody.innerHTML = '';

    if (pessoas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Nenhuma pessoa encontrada.</td></tr>';
      return;
    }

    pessoas.forEach(p => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${p._id}</td>
        <td>${p.nome}</td>
        <td>${p.idade}</td>
        <td>${p.cidade}</td>
        <td>
          <button onclick="editarPessoa('${p._id}')">Editar</button>
          <button onclick="excluirPessoa('${p._id}')">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    alert('Erro ao carregar pessoas.');
    console.error(err);
  }
}

async function editarPessoa(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const pessoa = await res.json();

    document.getElementById('id').value = pessoa._id;
    document.getElementById('nome').value = pessoa.nome;
    document.getElementById('idade').value = pessoa.idade;
    document.getElementById('cidade').value = pessoa.cidade;
  } catch (err) {
    alert('Erro ao carregar dados da pessoa.');
    console.error(err);
  }
}

async function excluirPessoa(id) {
  if (!confirm('Tem certeza que deseja excluir esta pessoa?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      carregarPessoas();
    } else {
      alert('Erro ao excluir pessoa.');
    }
  } catch (err) {
    alert('Erro ao excluir pessoa.');
    console.error(err);
  }
}

document.getElementById('pessoaForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('id').value;
  const nome = document.getElementById('nome').value.trim();
  const idade = parseInt(document.getElementById('idade').value.trim());
  const cidade = document.getElementById('cidade').value.trim();

  const pessoa = { nome, idade, cidade };

  try {
    let res;

    if (id) {
      // Atualizar
      res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pessoa)
      });
    } else {
      // Criar
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pessoa)
      });
    }

    if (res.ok) {
      document.getElementById('pessoaForm').reset();
      document.getElementById('id').value = '';
      carregarPessoas(); // Atualiza a tabela após salvar
    } else {
      alert('Erro ao salvar pessoa.');
    }
  } catch (err) {
    alert('Erro ao salvar pessoa.');
    console.error(err);
  }
});