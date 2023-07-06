/*
    Objetivos de la tercer pre-entrega:
    - DOM
    - Eventos
    - Storage
*/

class BaseDeDatos {
    constructor() {
        this.productos = [];
        // Cargo todos los productos que tengo a la venta
        this.agregarRegistro(1, "Espejo", 10000, "Decoración", "espejo.png");
        this.agregarRegistro(2, "Cuadro", 20000, "Decoración", "cuadro.png");
        this.agregarRegistro(3, "Mesa", 25000, "Decoración", "mesa.png");
        this.agregarRegistro(4, "Perchero", 15000, "Decoración", "perchero.png");
    }
    agregarRegistro(id, nombre, precio, categoria, imagen) {
        const producto = new Producto(id, nombre, precio, categoria, imagen);
        this.productos.push(producto);
    }
    devolverRegistros() {
        return this.productos;
    } 
    registroPorId(id) {
        return this.productos.find((producto) => producto.id === id);
    }
    registroPorNombre(palabra){
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra));
    }
}

class Carrito{
    constructor(){
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
        this.carrito = carritoStorage || [];
        this.total = 0;
        this.totalProductos = 0;
        this.listar();
    }
    estaEnCarrito({ id }) {
        return this.carrito.find((producto => producto.id === id));
    }
    agregar(producto) {
        let productoEnCarrito = this.estaEnCarrito(producto);
        if (productoEnCarrito){
            productoEnCarrito.cantidad++;
        } else {
            this.carrito.push({ ...producto, cantidad: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar(); 
    }
    quitar(id) {
        const indice = this.carrito.findIndex((producto) => producto.id === id);
        if (this.carrito[indice].cantidad > 1) {
            this.carrito[indice].cantidad--;
        } else {
            this.carrito.splice(indice, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }
    listar() {
        this.total = 0;
        this.totalProductos = 0;
        divCarrito.innerHTML = "";
        for (const producto of this.carrito){
            divCarrito.innerHTML += `
            <div class="producto">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <a href="#" data-id="${producto.id}"  class="btnQuitar">Quitar del carrito</a>
            </div> `

            this.total += producto.precio * producto.cantidad;
            this.totalProductos += producto.cantidad;
        }
        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar) {
            boton.addEventListener("click", (event) => {
                event.preventDefault();
                this.quitar(Number(boton.dataset.id));
            });
        }
        spanCantidadProductos.innerText = this.totalProductos;
        spanTotalCarrito.innerText = this.total;
    }
}
class Producto {
    constructor(id, nombre, precio, categoria, imagen = false) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

const bd = new BaseDeDatos();

// Nodos
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProducto");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h1");

// Llamo a la función.
cargarProductos(bd.devolverRegistros());

function cargarProductos(productos) {
    divProductos.innerHTML = "";
    for (const producto of productos) {
        divProductos.innerHTML += `
        <div class="producto">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <img src="img/${producto.imagen}" width ="150" />
            <p><a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a></p>
        </div>
        `;
    } 
    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    for (const boton of botonesAgregar){
        boton.addEventListener("click", (event) =>{  event.preventDefault();
            const id = Number(boton.dataset.id);
            const producto = bd.registroPorId(id);
            carrito.agregar(producto);            
        });
    }
}

inputBuscar.addEventListener("keyup", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    cargarProductos(bd.registroPorNombre(palabra.toLowerCase()));
});

botonCarrito.addEventListener("click", () => {
    document.querySelector("section").classList.toggle("ocultar")
});


const carrito = new Carrito();