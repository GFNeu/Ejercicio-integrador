const S = require('sequelize');
const db = require('../db');

class Product extends S.Model {
    // Crear un método de clase que diga cuántos productos hay sin stock, o no disponibles.
    static outOfStockCount(){
        return this.count({where: {availability: false}})
    }
    // Crear un método de instancia que diga cuanta ganancia podría tener con el stock disponible y precio del producto.
    getStockValue(){
        return '$' + this.stock * this.getDataValue('price')
    }
}

Product.init({
    name: {
        type: S.STRING,
        allowNull: false
    },
    price: {
        type: S.INTEGER,
        allowNull: false,
        get(){
            return "$" + this.getDataValue('price')
        }
    },
    description: {
        type: S.STRING
    },
    availability: {
        type: S.BOOLEAN,
        defaultValue: true,
    },
    stock: {
        type: S.INTEGER,
        allowNull: false,
        set(value){
            let name = this.getDataValue('name')
            if(value <= 0) {
                this.setDataValue('stock', 0); //Que el stock no pueda ser negativo
                if(this.availability){
                    this.setDataValue('availability', false); //Que si hay stock 0, availability pase a ser false
                    this.setDataValue('name',toggleName(name));
                }
            } else {
                this.setDataValue('stock', value);
                if(!this.availability){
                    this.setDataValue('availability', true)};
                    this.setDataValue('name',toggleName(name)); //Si el stock es positivo que availability sea true solo cuando antes fuese false
            }
        }
    }

},{sequelize: db, modelName: 'Product'})

// También tiene que tener un getter sobre el campo precio que devuelva el precio con un símbolo de $ adelante, por ejemplo, si el precio es 20 devolvería “$20” (opcional, se puede hacer con un virtual) <= HECHO

// Agregar un hook antes de ser creado que se fije en la propiedad 'disponible' en caso de ser false, agregar en el titulo del producto un "NO DISPONIBLE", por ejemplo, si el producto "Cartuchera" no está disponible quedaría: "Cartucheara NO DISPONIBLE" <= hecho directamente con el set del price

// Agregar un setter en stock, que pregunte, si el stock llega a 0, cambie la propiedad disponible a false. <= HECHO

// Reemplazar el hook, por un setter en "disponibilidad" de forma tal que cada vez que cambia la disponibilidad del producto, el titulo cambie dinámicamente, poniendo y sacando el "NO DISPONIBLE", ya que con el hook solo se haría en la creación! <= NO PUDE HACER ESTO. EL SET DEL STOCK SETEABA LA DISPONIBILIDAD PERO EL SET EN DISPONIBILIDAD NO HACÍA NADA. PUSE ESTE SET EN EL STOCK DIRECTAMENTE

function toggleName (str){
    let phrase = /NOT AVAILABLE/i;
    return phrase.test(str)? str.replace(phrase, "").trim() : `${str} NOT AVAILABLE`
}


module.exports = Product;