import { Request, Response } from 'express';
import pool from '../database/database';

class CajasController {

    public async getCajas(req: Request, res: Response) {
        const response = await pool.query('SELECT * FROM registers ORDER BY name ASC')
        res.json(response.rows)
    }
    public async getCajaById(req: Request, res: Response) {
        const id_register = parseInt(req.params.id_register)
        const response = await pool.query('SELECT * FROM registers WHERE id_register=$1 ORDER BY name ASC',
            [id_register])
        if (response.rowCount > 0) {
            res.json(response.rows)
        } else {
            res.json({
                icon: 'fa-regular fa-circle-xmark',
                title: 'Ocurrió un error inesperado',
                content: 'La caja que intenta actualizar ya no existe actualice la lista de cajas e intentelo otra vez'
            })
        }
    }
    public async createCaja(req: Request, res: Response) {
        const { name, state } = req.body
        await pool.query('INSERT INTO registers (name,state) values($1,$2)', [name, state]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Caja Registrada!', content: 'La caja se registro con exito en el sístema'
        })
    }

    public async actualizarCaja(req: Request, res: Response) {
        const id_register = parseInt(req.params.id_register)
        const { name, state } = req.body
        await pool.query('UPDATE registers SET name=$1,state=$2 WHERE id_register=$3',
            [name, state, id_register]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Caja Actualizada!', content: 'La caja se actualizó con exito en el sístema'
        })
    }
    public async eliminarCaja(req: Request, res: Response) {
        const id_register = parseInt(req.params.id_register)
        await pool.query('DELETE FROM registers WHERE id_register=$1', [id_register])
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Caja Eliminada!', content: 'La caja se elimminó con exito del sístema'
        })
    }
}
const cajasController = new CajasController();
export default cajasController;