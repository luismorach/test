import { Router } from 'express';
import VentasController from '../controllers/ventas.controller';
const helper = require('./helper')

class VentasRoutes {
    public router: Router = Router();
    constructor() {
        this.config()
    }

    config(): void {
       
        this.router.get('/sells', helper.routeHelper(VentasController.getVentas))
        this.router.get('/sells/:id_sell', helper.routeHelper(VentasController.getVentaById))
        this.router.get('/sells/:initialDate/:endDate', helper.routeHelper(VentasController.getVentasByDate))
        this.router.get('/sellsByDate/:initialDate/:endDate', helper.routeHelper(VentasController.getVentaByDate))
        this.router.get('/sellsProducts/:id_sell',helper.routeHelper(VentasController.getProductosVentaById))
        this.router.get('/sellsProduct/:id_sell/:id_product',helper.routeHelper(VentasController.getProductoVentaById))
        this.router.get('/sellsPays/:id_sell',helper.routeHelper(VentasController.getPagosVentaById))
        this.router.get('/sellsPaysByDate/:initialDate/:endDate',helper.routeHelper(VentasController.getPagosVentaByDate))
        this.router.get('/sellsByUser/:names',helper.routeHelper(VentasController.getVentasByUser))
        this.router.get('/sellsByClient/:names',helper.routeHelper(VentasController.getVentasByClient))
        this.router.post('/sells',helper.routeHelper(VentasController.createVenta))
        this.router.put('/sells/:id_sell', helper.routeHelper(VentasController.actualizarVenta))
        this.router.put('/sellsProducts/:id_sell/:id_product', helper.routeHelper(VentasController.actualizarProductosVenta))
        this.router.delete('/sells/:id_sell', helper.routeHelper(VentasController.eliminarVenta))
        this.router.use(helper.errorMiddleware)
    }
}
const ventasRoutes = new VentasRoutes();
export default ventasRoutes.router;