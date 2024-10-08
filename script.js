// Verificar se já existem produtos salvos no LocalStorage
const savedProducts = JSON.parse(localStorage.getItem('products')) || [];

// Função para exibir os produtos salvos na página de visualização
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Limpa a lista antes de adicionar os produtos

    if (savedProducts.length === 0) {
        productList.innerHTML = '<li>Nenhum produto anunciado.</li>'; // Mensagem caso não haja produtos
    } else {
        savedProducts.forEach((product, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>Preço:</strong> R$ ${product.price}</p>
                <p><strong>Contato:</strong> ${product.contact}</p>
                ${product.image ? `<img src="${product.image}" alt="Imagem do produto" style="max-width: 200px;"/>` : ''}
                <button onclick="editProduct(${index})">Editar</button>
                <button onclick="deleteProduct(${index})">Deletar</button>
            `;
            productList.appendChild(li);
        });
    }
}

// Função para adicionar ou editar um produto
function addOrEditProduct(event) {
    event.preventDefault();

    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const contact = document.getElementById('product-contact').value;
    const imageInput = document.getElementById('product-image');
    const editIndex = document.getElementById('edit-index') ? document.getElementById('edit-index').value : '';

    // Verifica se uma imagem foi selecionada
    if (imageInput.files.length > 0) {
        const reader = new FileReader();
        reader.readAsDataURL(imageInput.files[0]);
        reader.onload = function () {
            const newProduct = {
                name, 
                description, 
                price,
                contact,  
                image: reader.result, // Armazena a imagem como base64
                creationDate: new Date() 
            };

            if (editIndex === '') {
                // Adicionar novo produto
                savedProducts.push(newProduct);
            } else {
                // Editar produto existente
                savedProducts[editIndex] = newProduct;
                document.getElementById('edit-index').value = ''; // Limpar campo de edição
            }

            // Atualizar o LocalStorage
            localStorage.setItem('products', JSON.stringify(savedProducts));

            // Limpar o formulário
            if (document.getElementById('ad-form')) {
                document.getElementById('ad-form').reset();
            }

            // Se estivermos na página de visualização, chamamos displayProducts()
            if (window.location.pathname.endsWith('view.html')) {
                displayProducts();
            }
        };
        // Necessário para garantir que o restante da função não é executado antes de carregar a imagem
        return;
    } else {
        // Caso não haja imagem, ainda assim cria o produto
        const newProduct = {
            name, 
            description, 
            price,
            contact,  
            image: null, // Se não houver imagem, armazena como null
            creationDate: new Date() 
        };

        if (editIndex === '') {
            // Adicionar novo produto
            savedProducts.push(newProduct);
        } else {
            // Editar produto existente
            savedProducts[editIndex] = newProduct;
            document.getElementById('edit-index').value = ''; // Limpar campo de edição
        }

        // Atualizar o LocalStorage
        localStorage.setItem('products', JSON.stringify(savedProducts));

        // Limpar o formulário
        if (document.getElementById('ad-form')) {
            document.getElementById('ad-form').reset();
        }

        // Se estivermos na página de visualização, chamamos displayProducts()
        if (window.location.pathname.endsWith('view.html')) {
            displayProducts();
        }
    }
}

// Função para editar um produto
function editProduct(index) {
    const product = savedProducts[index];
    
    // Redirecionar para a página de adicionar anúncio com os dados do produto
    window.location.href = `index.html?edit=${index}`;
}

// Função para deletar um produto
function deleteProduct(index) {
    savedProducts.splice(index, 1); // Remove o produto pelo índice
    localStorage.setItem('products', JSON.stringify(savedProducts)); // Atualiza o LocalStorage
    displayProducts(); // Atualiza a lista de produtos
}

// Verificar se estamos na página de adicionar anúncio
if (window.location.pathname.endsWith('index.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const editIndex = urlParams.get('edit');

    if (editIndex) {
        const productToEdit = savedProducts[editIndex];
        document.getElementById('product-name').value = productToEdit.name;
        document.getElementById('product-description').value = productToEdit.description;
        document.getElementById('product-price').value = productToEdit.price;
        document.getElementById('product-contact').value = productToEdit.contact;
        document.getElementById('edit-index').value = editIndex;
    }

    // Adicionar evento ao formulário
    document.getElementById('ad-form').addEventListener('submit', addOrEditProduct);
}

// Verificar se estamos na página de visualização e exibir os produtos
if (window.location.pathname.endsWith('view.html')) {
    displayProducts();
}

// Função para alternar entre modo claro e escuro
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    // Armazenar o tema atual no LocalStorage
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
}

// Verificar se há um tema salvo no LocalStorage e aplicar
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Adicionar botão de alternância de tema
const themeToggleButton = document.createElement('button');
themeToggleButton.textContent = 'Alternar Tema';
themeToggleButton.classList.add('toggle-theme');
themeToggleButton.onclick = toggleTheme;
document.body.appendChild(themeToggleButton);
