import { Router } from 'express';
import ClientesController from '../controllers/clientesController';
const validations = require('./validations')
const helper = require('./helper')

class ClientesRoutes {
    public router: Router = Router();
    constructor() {
        this.config()
    }

    config(): void {
        this.router.get('/clients', helper.routeHelper(ClientesController.getClientes))
        this.router.get('/clients/:id_client', helper.routeHelper(ClientesController.getClienteById))
        this.router.post('/clients',helper.routeHelper(ClientesController.createCliente))
        this.router.put('/clients/:id_client', helper.routeHelper(ClientesController.actualizarCliente))
        this.router.delete('/clients/:id_client', helper.routeHelper(ClientesController.eliminarCliente))
        this.router.use(helper.errorMiddleware)
    }
}
const clientesRoutes = new ClientesRoutes();
export default clientesRoutes.router;