==== EJERCICIO INTEGRADOR ====
Recordá antes que nada crear una base de datos, podes llamarla "integradorback"
Hacer una RESTful API usando Node, Express y Sequelize (Postgres)
Vamos a tener una API de Productos y Categorias.
Modelo Producto {
        nombre: string
        precio: int
        descripcion: string
        disponible: booleano = default true
         stock: int
}


Crear un método de clase que diga cuántos productos hay sin stock, o no disponibles.
Crear un método de instancia que diga cuanta ganancia podría tener con el stock disponible y precio del producto.
También tiene que tener un getter sobre el campo precio que devuelva el precio con un símbolo de $ adelante, por ejemplo, si el precio es 20 devolvería “$20” (opcional, se puede hacer con un virtual)
Agregar un hook antes de ser creado que se fije en la propiedad 'disponible' en caso de ser false, agregar en el titulo del producto un "NO DISPONIBLE", por ejemplo, si el producto "Cartuchera" no está disponible quedaría: "Cartucheara NO DISPONIBLE"
Los endpoints van a ser los siguientes:
GET /productos
GET /productos/:id
POST /productos
PUT /productos/:id
DELETE /productos/:id
Los productos pueden tener varias categorías.
Modelo Categoria {
        nombre: string
}
Además GET /productos puede incluir un query de categorías por ejemplo
GET /productos?categoria=libros
Debería traer solo los productos que tengan la categoría libros


Agregar un setter en stock, que pregunte, si el stock llega a 0, cambie la propiedad disponible a false.


BONUS 
Reemplazar el hook, por un setter en "disponibilidad" de forma tal que cada vez que cambia la disponibilidad del producto, el titulo cambie dinámicamente, poniendo y sacando el "NO DISPONIBLE", ya que con el hook solo se haría en la creación!
====================================