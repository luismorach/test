import { Request, Response } from 'express';
import pool from '../database/database';

class CajasController {

    public async getKardex(req: Request, res: Response) {
        const response = await pool.query('SELECT * FROM kardex JOIN products ON '+
        'kardex.id_product=products.id_product ORDER BY date,time ASC')
        res.json(response.rows)
    }
    public async getKardexById(req: Request, res: Response) {
        const type =req.params.type
        const id_operation = parseInt(req.params.id_operation)
        const id_product = parseInt(req.params.id_product)
        console.log(type)
        const response = await pool.query('SELECT * FROM kardex JOIN products ON '+
        'kardex.id_product=products.id_product where type=$1 And id_operation=$2 AND kardex.id_product=$3 '+
        'ORDER BY date,time ASC',
            [type,id_operation,id_product])
           
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
    public async getKardexByDate(req: Request, res: Response) {
        const initialDate=req.params.initialDate
        const endDate=req.params.endDate
        const response = await pool.query('SELECT * FROM kardex JOIN products ON '+
        'kardex.id_product=products.id_product where date>=$1 and date<=$2 ORDER BY date,time ASC',
            [initialDate,endDate])
        if (response.rowCount > 0) {
            res.json(response.rows)
        } else {
            res.json({
                icon: 'fa-regular fa-circle-xmark',
                title: 'Ocurrió un error inesperado',
                content: 'No existen movimientos para fecha especificada'
            })
        }
    }
    public async getKardexByProduct(req:Request,res:Response){
        const barcode= parseInt(req.params.barcode)
        const response = await pool.query("SELECT * "+
        "FROM kardex JOIN products ON kardex.id_product=products.id_product "+
        "where products.barcode=$1",[barcode])
        res.json(response.rows)
    }
}
const cajasController = new CajasController();
export default cajasController;