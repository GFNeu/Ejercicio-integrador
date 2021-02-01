const router = require('express').Router()
const {Product, Category} = require('../models')
const Promise = require("bluebird");


// GET all products
router.get('/products', (req,res,next)=>{
    if(req.query.category){ //Si viene con query, devuelve todos los productos para una categoría
        Category.findOne({where: { name: req.query.category}})
                .then((cat)=>cat.getProducts())
                .then((r)=>res.json(r))                       
    }else{ //Si viene sin query, devuelve todos los productos
        Product.findAll({ raw: false })
            .then(results => res.json(results))
            .catch(next)
        }
})

// GET number of products out of stock
router.get('/products/outOfStockCount', (req,res,next)=>{
  
  Product.outOfStockCount()
         .then((count) => res.json({"out_of_stock_count": count}))
         .catch(next)
    
})
// GET stock value of a certain product by id
router.get('/products/:id/stockValue', (req,res,next)=>{
     
  Product.findByPk(req.params.id)
         .then(prod => prod.getStockValue())
         .then(value => res.send(value))
         .catch(next)    
})

// GET product by id
router.get('/products/:id', (req,res,next)=>{
     
    Product.findByPk(req.params.id)
           .then(prod => res.json(prod))
           .catch(next)    
})


// POST add new product
router.post("/products", (req, res, next) => {
  let b = req.body;
  //Encuentra o crea el producto

  Product.findOrCreate({ where: { name: b.name, description: b.description || null, price: b.price, stock: b.stock }})
    .then((prod) => {
      //Si el producto no existía en la base de datos y se creó, y si llegaron categorías al body:  
      if (b.categories && prod[1] == true) {
        //Convierte las categorías que llegan en un string a array
        let categories = req.body.categories.toLowerCase().trim().split(/[, ]+/g);
        //Guarda en una variable un array con las promesas findOrCreate de cada una de las categorías pasadas
        promCategories = categories.map((cat) => Category.findOrCreate({ where: { name: cat } }));
        //Si el promise.all funciona devuelve un array con las categorías y un booleano por categoría que dice ya existían o si son nuevas
        return Promise.all(promCategories)
                      .then((cats) => {
                                //Se obtienen solo las categorías sin los valores booleanos
                                cats = cats.flat().filter((c) => typeof c != "boolean");
                                //Se agregan las categorías al producto pasadas como array
                                return prod[0].addCategory(cats);
                        });
      } else {
        return prod[1];//Si no se pasaron categorías se devuelve solamente la indicación de si el producto ya existía(false) o si fué creado recién(true) 
      }
    })
    .then(response => {
        if(response === false) res.send("The product you are triying to add is already in the database") //Si el producto ya existía
        else res.send("Your product was saved correctly") //Si el producto se creó con o sin categorías
    })
    .catch(next)
});

// PUT edit product
router.put('/products/:id', (req,res,next)=>{
    Product.findByPk(req.params.id)
           .then(product=> product.update(req.body))
           .then(()=>res.send("Your product has been updated"))
           .catch(next)

    //***************************************       
    //FALTA HACER EL UPDATE DE LAS CATEGORIAS
    //***************************************    

    //Está otra versión también funciona
    // Product.findByPk(req.params.id)
    //        .then(product => {
    //            for(let key in req.body) product[key] = req.body[key]
    //            return product.save()
    //        })
    //        .then(()=> res.send("Your product has been updated."))
    //        .catch(next) 
})

// DELETE products by id
router.delete('/products/:id', (req,res,next)=>{
    Product.findByPk(req.params.id)
           .then( p =>{
            let name = p.name   
            p.destroy().then(()=>res.send(`Your product ${name} has been deleted.`))
           }) 
           .catch(next)
})



module.exports = router;