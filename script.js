const API_URL = 'https://dummyjson.com/products?limit=9';

const listaProdutos = document.querySelector('#listaProdutos');
const statusApi = document.querySelector('#statusApi');
const busca = document.querySelector('#busca');
const contadorCarrinho = document.querySelector('#contadorCarrinho');
const listaCarrinho = document.querySelector('#listaCarrinho');
const totalCarrinho = document.querySelector('#totalCarrinho');
const btnAtualizar = document.querySelector('#btnAtualizar');
const btnFinalizar = document.querySelector('#btnFinalizar');
const btnMenu = document.querySelector('#btnMenu');
const navPrincipal = document.querySelector('#main-nav');
const mensagemCompra = document.querySelector('#mensagemCompra');
const formContato = document.querySelector('#formContato');
const mensagemFormulario = document.querySelector('#mensagemFormulario');

let produtos = [];
let carrinho = [];

async function carregarProdutos() {
  statusApi.textContent = 'Carregando produtos...';
  listaProdutos.innerHTML = '';

  statusApi.classList.remove('erro');

  try {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status}`);
    }
    const dados = await resposta.json();

    produtos = dados.products;
    renderizarProdutos(produtos);
    statusApi.textContent = 'Produtos carregados com sucesso.';
  } catch (erro) {
    statusApi.textContent = 'Falha ao carregar produtos. Tente novamente.';
    statusApi.classList.add('erro');
    console.error('Erro ao carregar produtos:', erro);
  }
}

function renderizarProdutos(lista) {
  listaProdutos.innerHTML = '';

  if (lista.length === 0) {
    listaProdutos.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }

  lista.forEach((produto) => {
    const card = document.createElement('article');
    card.className = 'produto-card';

    card.innerHTML = `
      <img src="${produto.thumbnail}" alt="${produto.title}" />
      <h3>${produto.title}</h3>
      <p class="descricao">${produto.description}</p>
      <p class="preco">R$ ${produto.price}</p>
      <button class="botao-secundario" onclick="adicionarCarrinho(${produto.id})">Adicionar ao carrinho</button>
    `;

    listaProdutos.appendChild(card);
  });
}

function adicionarCarrinho(idProduto) {
  const produto = produtos.find((item) => item.id === idProduto);

  if (!produto) {
    mensagemCompra.textContent = 'Produto não encontrado.';
    mensagemCompra.classList.add('erro');
    return;
  }

  carrinho.push(produto);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  listaCarrinho.innerHTML = '';

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = '<li>O carrinho está vazio.</li>';
  }

  carrinho.forEach((produto) => {
    const item = document.createElement('li');
    item.textContent = `${produto.title} - R$ ${produto.price}`;
    listaCarrinho.appendChild(item);
  });

  contadorCarrinho.textContent = carrinho.length;

  const total = carrinho.reduce((soma, produto) => soma + produto.price, 0);
  totalCarrinho.textContent = total.toFixed(2).replace('.', ',');
}

busca.addEventListener('input', () => {
  const termo = busca.value;
  const filtrados = produtos.filter((produto) =>
    produto.title.toLowerCase().includes(termo.toLowerCase())
  );
  renderizarProdutos(filtrados);
});

btnAtualizar.addEventListener('click', carregarProdutos);

btnMenu.addEventListener('click', () => {
  const ativo = navPrincipal.classList.toggle('ativo');
  btnMenu.setAttribute('aria-expanded', ativo.toString());
});

btnFinalizar.addEventListener('click', () => {
  if (carrinho.length === 0) {
    mensagemCompra.textContent = 'Não há itens no carrinho.';
    mensagemCompra.classList.remove('erro');
    return;
  }

  mensagemCompra.textContent = 'Compra finalizada com sucesso!';
  mensagemCompra.classList.remove('erro');
  carrinho = [];
  atualizarCarrinho();
});

formContato.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const nome = document.querySelector('#nome').value;
  const email = document.querySelector('#email').value;
  const curso = document.querySelector('#curso').value;
  const termos = document.querySelector('#termos').checked;

  mensagemFormulario.classList.remove('erro');

  if (nome.length < 3) {
    mensagemFormulario.textContent = 'Informe um nome com pelo menos 3 caracteres.';
    mensagemFormulario.classList.add('erro');
    return;
  }

  if (!termos) {
    mensagemFormulario.textContent = 'Você precisa aceitar os termos de contato.';
    mensagemFormulario.classList.add('erro');
    return;
  }

  if (!email.includes('@')) {
    mensagemFormulario.textContent = 'Informe um e-mail válido.';
    mensagemFormulario.classList.add('erro');
    return;
  }

  if (curso === '') {
    mensagemFormulario.textContent = 'Selecione um curso.';
    mensagemFormulario.classList.add('erro');
    return;
  }

  mensagemFormulario.textContent = 'Solicitação enviada com sucesso.';
  formContato.reset();
});

carregarProdutos();
