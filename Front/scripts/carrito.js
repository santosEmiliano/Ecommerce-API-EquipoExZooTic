import servicios from "./servicios.js";

// NOTA: Este es solo un ejemplo, cuando este lista la API del carrito aquí se reemplazará el código por
// el fetch a los endpoints.

document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-items-container");
    const subtotalEl = document.getElementById("summary-subtotal");
    const taxEl = document.getElementById("summary-tax");
    const totalEl = document.getElementById("summary-total");
    const shippingEl = document.getElementById("summary-shipping");

    let TAX_RATE;
    let SHIPPING_COST;

    initCart();

    async function initCart() {
        try {
            //const items = await servicios.getCarrito();
            // Por ahora, usamos datos de prueba si el fetch falla o está vacío
            let items = await servicios.obtenerCarrito();
            let datos = await servicios.obtenerResumenCompraCarrito();
            servicios.actualizarCarrito();

            console.log(datos);
            console.log(items);

            TAX_RATE = datos.tarifas[localStorage.getItem("pais")].tasa;
            SHIPPING_COST = datos.tarifas[localStorage.getItem("pais")].envio;
            
            renderCart(items);
            calculateTotals(items);

        } catch (error) {
            console.error("Error cargando carrito:", error);
            cartContainer.innerHTML = '<div class="error-msg">No pudimos abrir la mochila :(</div>';
        }
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
            const imgPath = item.imagen.startsWith('http') ? item.imagen : `http://72.60.228.244:3000${item.imagen}`;
            
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
                            
                            <div class="prices-wrapper" style="text-align: right; display: flex; flex-direction: column; justify-content: center;">
                                
                                <span class="unit-price" style="font-size: 0.85rem; color: #777; margin-bottom: 2px;">
                                    Unitario: $${parseFloat(item.precio).toFixed(2)}
                                </span>

                                <span class="item-price" style="font-weight: bold; font-size: 1.2rem; color: var(--color--verde-bosque);">
                                    $${(item.precio * item.cantidad).toFixed(2)}
                                </span>
                                
                            </div>
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
            await servicios.modificarProductoCarrito(id, newQty);
            console.log(`Actualizando ID ${id} a cantidad ${newQty} en BD...`);
            initCart(); 

        } catch (error) {
            Swal.fire({
                title: "Cuidado!",
                text: error.message,
                icon: "warning",
                confirmButtonText: "Okay",
            });
            input.value = newQty - change; 
        }
    };

    window.removeItem = async (id) => {
        const card = document.querySelector(`.cart-item[data-id="${id}"]`);
        
        card.classList.add("falling");

        // Esperar a que termine la animación para llamar al back
        setTimeout(async () => {
            try {
                await servicios.eliminarProductoCarrito(id);
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