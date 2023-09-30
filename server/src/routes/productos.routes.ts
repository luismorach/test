import { Router } from 'express';
import ProductosController from '../controllers/productosController';
const validations = require('./validations')
const helper = require('./helper')

class ProductosRoutes {
    public router: Router = Router();
    constructor() {
        this.config()
    }

    config(): void {
        this.router.get('/products', helper.routeHelper(ProductosController.getProductos))
        this.router.get('/products/sells', helper.routeHelper(ProductosController.getProductosMasVendidos))
        this.router.get('/products/expir', helper.routeHelper(ProductosController.getProductosPorVencimiento))
        this.router.get('/products/:id_product', helper.routeHelper(ProductosController.getProductoById))
        this.router.get('/products/barcode/:barcode', helper.routeHelper(ProductosController.getProductoByBarcode))
        this.router.get('/products/category/:id_category', helper.routeHelper(ProductosController.getProductoByCategory))
        this.router.post('/products',helper.routeHelper(ProductosController.createProducto))
        this.router.put('/products/:id_product', helper.routeHelper(ProductosController.actualizarProducto))
        this.router.delete('/products/:id_product', helper.routeHelper(ProductosController.eliminarProducto))
        this.router.use(helper.errorMiddleware)
    }
}
const productosRoutes = new ProductosRoutes();
export default productosRoutes.router;