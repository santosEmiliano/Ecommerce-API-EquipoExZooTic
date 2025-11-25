import servicios from "./servicios.js";

document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.getElementById("products-grid"); 
    const storeWrapper = document.getElementById("store-wrapper");
    const biomeBtns = document.querySelectorAll(".biome-btn");
    const searchInput = document.getElementById("search-input");
    const resetBtn = document.getElementById("reset-filters-btn");

    let allProducts = [];
    
    const categoryMap = {
        'patrimoniales': { css: 'card-selva', biome: 'selva', icon: '🌿' },
        'megafaunas': { css: 'card-acuatico', biome: 'oceano', icon: '🌊' },
        'superpredadores': { css: 'card-desierto', biome: 'desierto', icon: '🦁' }
    };

    initStore();

    async function initStore() {
        try {
            allProducts = await servicios.getProd(); 
            renderProducts(allProducts);
        } catch (error) {
            console.error("Error cargando tienda:", error);
            if(productsContainer) {
                productsContainer.innerHTML = '<div class="error-msg"><h3>No pudimos conectar con la naturaleza :(</h3></div>';
            }
        }
    }

    function renderProducts(products) {
        if(!productsContainer) return;
        productsContainer.innerHTML = "";

        if (!products || products.length === 0) {
            productsContainer.innerHTML = '<div class="empty-msg"><h3>No hay especies en esta zona.</h3></div>';
            return;
        }

        products.forEach(product => {
            const config = categoryMap[product.categoria] || { css: 'card-selva', icon: '🐾' };
            
            const imgPath = product.imagen ? `http://localhost:3000${product.imagen}` : 'media/logo.png';

            const randomRotate = Math.floor(Math.random() * 6) - 3; 

            const cardHTML = `
                <div class="product-card ${config.css}" style="--texture-rotate: ${randomRotate}deg;" onclick="addToCart(${product.id})">
                    <div class="card-tape"></div>
                    
                    <div class="card-image-wrapper">
                        <img src="${imgPath}" alt="${product.nombre}" class="animal-img" loading="lazy" onerror="this.src='media/logo.png'">
                        <div class="biome-badge">${config.icon}</div>
                    </div>

                    <div class="card-info">
                        <h3 class="animal-name">${product.nombre}</h3>
                        <div class="price-tag"><span>$${product.precio}</span></div>
                        <button class="btn-feed">
                            🍎 <span class="btn-text">Adoptar</span>
                        </button>
                    </div>
                </div>
            `;
            
            productsContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    biomeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            biomeBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if(resetBtn) resetBtn.style.display = "flex";

            const selectedBiome = btn.dataset.biome;
            
            storeWrapper.className = `store-wrapper bg-${selectedBiome}`;

            const filtered = allProducts.filter(p => {
                const catConfig = categoryMap[p.categoria];
                return catConfig && catConfig.biome === selectedBiome;
            });
            
            renderProducts(filtered);
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            biomeBtns.forEach(b => b.classList.remove("active"));
            document.querySelector('.biome-btn[data-biome="selva"]')?.classList.add("active");

            storeWrapper.className = "store-wrapper bg-selva"; 
            
            resetBtn.style.display = "none";
            
            if(searchInput) searchInput.value = "";

            renderProducts(allProducts);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allProducts.filter(p => p.nombre.toLowerCase().includes(term));
            renderProducts(filtered);
            
            if(resetBtn) {
                resetBtn.style.display = term.length > 0 ? "flex" : "none";
            }
        });
    }

    window.addToCart = (id) => {
        console.log("Añadiendo al carrito ID:", id);
        if(typeof Toastify === 'function') {
            Toastify({
                text: "¡Añadido al carrito!",
                duration: 3000,
                gravity: "bottom", 
                position: "right", 
                style: { background: "#7ab24e" }
            }).showToast();
        } else {
            alert("¡Añadido al carrito!");
        }
    };
});