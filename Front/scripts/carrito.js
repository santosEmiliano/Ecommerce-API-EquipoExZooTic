import servicios from "./servicios.js";

// NOTA: Este es solo un ejemplo, cuando este lista la API del carrito aquí se reemplazará el código por
// el fetch a los endpoints.

document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-items-container");
    const subtotalEl = document.getElementById("summary-subtotal");
    const taxEl = document.getElementById("summary-tax");
    const totalEl = document.getElementById("summary-total");
    const shippingEl = document.getElementById("summary-shipping");

    const TAX_RATE = 0.16; // Impuesto fijo
    const SHIPPING_COST = 150; // Costo fijo por ahora

    initCart();

    async function initCart() {
        try {
            //const items = await servicios.getCarrito();
            // Por ahora, usamos datos de prueba si el fetch falla o está vacío
            let items = await fetchCartItems();
            
            renderCart(items);
            calculateTotals(items);

        } catch (error) {
            console.error("Error cargando carrito:", error);
            cartContainer.innerHTML = '<div class="error-msg">No pudimos abrir la mochila :(</div>';
        }
    }

    async function fetchCartItems() {
        // TODO: Hacer fetch('http://localhost:3000/carrito', { headers: { Authorization: token } })
        
        // REETORNO DE INFORMACIÓN FALSA
        return [
            { id: 1, nombre: "Panda Gigante", precio: 5000, imagen: "/images/panda.jpg", cantidad: 1, categoria: "patrimoniales" },
            { id: 2, nombre: "Cubo 3x3", precio: 200, imagen: "/images/cubo.jpg", cantidad: 2, categoria: "megafaunas" }
        ];
    }

    function renderCart(items) {
        cartContainer.innerHTML = "";

        if (items.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart" style="text-align:center; padding: 40px; color:white;">
                    <i class="fa-solid fa-feather" style="font-size: 60px; margin-bottom: 20px; opacity:0.8;"></i>
                    <h2>Tu mochila está muy ligera...</h2>
                    <p>¡Ve a la tienda y adopta un compañero!</p>
                </div>
            `;
            document.getElementById("checkout-btn").style.opacity = "0.5";
            document.getElementById("checkout-btn").style.pointerEvents = "none";
            return;
        }

        items.forEach(item => {
            const imgPath = item.imagen.startsWith('http') ? item.imagen : `http://localhost:3000${item.imagen}`;
            
            const itemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-img-box">
                        <img src="${imgPath}" alt="${item.nombre}" onerror="this.src='media/logo.png'">
                    </div>
                    
                    <div class="item-details">
                        <h3 class="item-name">${item.nombre}</h3>
                        <span class="item-cat">${item.categoria}</span>
                        
                        <div class="item-controls">
                            <div class="qty-selector">
                                <button class="qty-btn btn-minus" onclick="updateQty(${item.id}, -1)">-</button>
                                <input type="text" class="qty-input" value="${item.cantidad}" readonly>
                                <button class="qty-btn btn-plus" onclick="updateQty(${item.id}, 1)">+</button>
                            </div>
                            <div class="item-price">$${(item.precio * item.cantidad).toFixed(2)}</div>
                        </div>
                    </div>

                    <button class="btn-remove" onclick="removeItem(${item.id})" title="Sacar de la mochila">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            cartContainer.insertAdjacentHTML('beforeend', itemHTML);
        });
    }

    function calculateTotals(items) {
        let subtotal = 0;
        items.forEach(item => subtotal += item.precio * item.cantidad);

        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax + SHIPPING_COST;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxEl.textContent = `$${tax.toFixed(2)}`;
        shippingEl.textContent = `$${SHIPPING_COST.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    window.updateQty = async (id, change) => {
        const card = document.querySelector(`.cart-item[data-id="${id}"]`);
        const input = card.querySelector('.qty-input');
        const priceDisplay = card.querySelector('.item-price');
        
        let newQty = parseInt(input.value) + change;
        if (newQty < 1) return;

        input.value = newQty;
        
        try {
            // await servicios.updateCartItem(id, newQty);
            console.log(`Actualizando ID ${id} a cantidad ${newQty} en BD...`);
            
            // Recalcular totales mediante el endpoint del back
            // Por ahora recargamos todo para simular
            initCart(); 

        } catch (error) {
            alert("Error de conexión");
            input.value = newQty - change; // Revertir si falla
        }
    };

    window.removeItem = async (id) => {
        const card = document.querySelector(`.cart-item[data-id="${id}"]`);
        
        card.classList.add("falling");

        // Esperar a que termine la animación para llamar al back
        setTimeout(async () => {
            try {
                // await servicios.deleteCartItem(id);
                console.log(`Eliminando ID ${id} de la BD...`);
                
                // Recargar
                initCart();
            } catch (error) {
                card.classList.remove("falling");
                alert("No se pudo eliminar");
            }
        }, 500);
    };
});