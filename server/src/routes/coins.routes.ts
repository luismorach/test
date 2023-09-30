import { Router } from 'express';
import coinsController from '../controllers/coins.controller';
const validations = require('./validations')
const helper = require('./helper')

class CoinsRoutes {
    public router: Router = Router();
    constructor() {
        this.config()
    }

    config(): void {
        this.router.get('/coins', helper.routeHelper(coinsController.getCoins))
        this.router.get('/coins/:id_coin', helper.routeHelper(coinsController.getCoinById))
        this.router.get('/CoinsMain', helper.routeHelper(coinsController.getMainCoin))
        this.router.post('/coins',helper.routeHelper(coinsController.createCoin))
        this.router.put('/coins/:id_coin', helper.routeHelper(coinsController.actualizarCoin))
        this.router.delete('/coins/:id_coin', helper.routeHelper(coinsController.eliminarCoin))
        this.router.use(helper.errorMiddleware)
    }
}
const coinsRoutes = new CoinsRoutes();
export default coinsRoutes.router;