import { Router } from 'express';
import kardexControler from '../controllers/kardex.controller';
const validations = require('./validations')
const helper = require('./helper')

class KardexRoutes {
    public router: Router = Router();
    constructor() {
        this.config()
    }

    config(): void {
        this.router.get('/kardex', helper.routeHelper(kardexControler.getKardex))
        this.router.get('/kardexByDate/:initialDate/:endDate', helper.routeHelper(kardexControler.getKardexByDate))
        this.router.get('/kardexByProduct/:barcode', helper.routeHelper(kardexControler.getKardexByProduct))
        this.router.get('/kardex/:type/:id_operation/:id_product', helper.routeHelper(kardexControler.getKardexById))
        this.router.use(helper.errorMiddleware)
    }
}
const kardexRoutes = new KardexRoutes();
export default kardexRoutes.router;