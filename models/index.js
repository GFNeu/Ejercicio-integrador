const Category = require('./Category')
const Product = require('./Product')

Product.belongsToMany(Category, {through: 'ProdCategories' })
Category.belongsToMany(Product, {through: 'ProdCategories' })

module.exports = {Category, Product}