
const productos = [
    {
        id: 1,
        nombre: "Malbec Reserva",
        precio: 10000,
        imagen: "../img/vinos/01.jpg"
    },
    {
        id: 2,
        nombre: "Cabernet Sauvignon",
        precio: 9500,
        imagen: "../img/vinos/02.jpg"
    },
    {
        id: 3,
        nombre: "Syrah Roble",
        precio: 8800,
        imagen: "../img/vinos/03.jpg"
    },
    {
        id: 4,
        nombre: "Chardonnay",
        precio: 7900,
        imagen: "../img/vinos/04.jpg"
    },
    {
        id: 5,
        nombre: "Rosé de Malbec",
        precio: 8200,
        imagen: "../img/vinos/05.jpg"
    },
    {
        id: 6,
        nombre: "Blend Premium",
        precio: 12000,
        imagen: "../img/vinos/06.jpg"
    }
];

// --- FUNCIONES DE CARRITO ---
function getCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function setCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(id) {
    let carrito = getCarrito();
    const producto = productos.find(p => p.id === id);
    const existe = carrito.find(item => item.id === id);
    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    setCarrito(carrito);
    actualizarContadorCarrito();
}

function eliminarDelCarrito(id) {
    let carrito = getCarrito();
    carrito = carrito.filter(item => item.id !== id);
    setCarrito(carrito);
    mostrarCarrito();
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    setCarrito([]);
    mostrarCarrito();
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const carrito = getCarrito();
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.querySelectorAll(".carrito").forEach(el => el.textContent = total);
}

// --- TIENDA: BOTONES AGREGAR ---
if (document.querySelector(".container-productos")) {
    document.querySelectorAll(".boton-agregar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.getAttribute("data-id"));
            agregarAlCarrito(id);
            btn.textContent = "¡Agregado!";
            setTimeout(() => btn.textContent = "Agregar al Carrito", 1000);
        });
    });
    actualizarContadorCarrito();
}

// --- CARRITO: MOSTRAR Y ACCIONES ---
function mostrarCarrito() {
    const carrito = getCarrito();
    const contenedor = document.querySelector(".carrito-items");
    const vacio = document.querySelector(".carrito-vacio");
    const acciones = document.querySelector(".carrito-acciones");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    if (carrito.length === 0) {
        if (vacio) vacio.style.display = "block";
        if (acciones) acciones.style.display = "none";
        return;
    }
    if (vacio) vacio.style.display = "none";
    if (acciones) acciones.style.display = "flex";

    carrito.forEach(item => {
        const div = document.createElement("div");
        div.className = "items-del-carrito";
        div.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="carrito-titulo">
                <small>Título</small>
                <h3>${item.nombre}</h3>
            </div>
            <div class="carrito-cantidad">
                <small>Cantidad</small>
                <p>${item.cantidad}</p>
            </div>
            <div class="carrito-precio">
                <small>Precio</small>
                <p>$${item.precio.toLocaleString()}</p>
            </div>
            <div class="carrito-subtotal">
                <small>Subtotal</small>
                <p>$${(item.precio * item.cantidad).toLocaleString()}</p>
            </div>
            <button class="eliminar-item" data-id="${item.id}"><i class="bi bi-trash"></i></button>
        `;
        contenedor.appendChild(div);
    });

    // Botones eliminar
    document.querySelectorAll(".eliminar-item").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = Number(btn.getAttribute("data-id"));
            eliminarDelCarrito(id);
        });
    });

    // Total
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const totalEl = document.getElementById("total");
    if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;
}

// Vaciar carrito
if (document.querySelector(".boton-vaciar-carrito")) {
    document.querySelector(".boton-vaciar-carrito").addEventListener("click", () => {
        if (confirm("¿Vaciar el carrito?")) vaciarCarrito();
    });
}

// Comprar (solo ejemplo)
if (document.querySelector(".carrito-acciones-comprar")) {
    document.querySelector(".carrito-acciones-comprar").addEventListener("click", () => {
        alert("¡Gracias por tu compra!");
        vaciarCarrito();
    });
}

// Mostrar carrito al cargar la página de carrito
if (document.querySelector(".carrito-items")) {
    mostrarCarrito();
    actualizarContadorCarrito();
}