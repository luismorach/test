import { Request, Response } from 'express';
import pool from '../database/database';

class DevolucionesController {

    public async getDevoluciones(req: Request, res: Response) {
        const response = await pool.query('SELECT * FROM repayment ORDER BY date,time DESC ')
        res.json(response.rows)
    }

    public async getDevolucionById(req: Request, res: Response) {
        const id_repayment = parseInt(req.params.id_repayment)
        const response = await pool.query('SELECT * FROM repayment JOIN users ON '+
        'repayment.id_user=users.id_user  AND id_repayment=$1 ORDER BY date,time DESC',
            [id_repayment])
            console.log(id_repayment)
        if (response.rowCount > 0) {
            res.json(response.rows)
        } else {
            console.log(req.params.id_repayment)
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'No existen Devoluciones con el número de ticket especificado'
            })
        }
    }
    public async getDevolucionBuy(req: Request, res: Response) {
        const id_buy = parseInt(req.params.id_buy)
        const response = await pool.query('SELECT * FROM repayment WHERE id_buy=$1 ORDER BY date,time DESC',
            [id_buy])
        if (response.rowCount > 0) {
            res.json(response.rows)
        } else {
            console.log(req.params.id_repayment)
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'No existen devoluciones con el número de ticket especificado'
            })
        }
    }
    public async getDevolucionSell(req: Request, res: Response) {
        const id_sell = parseInt(req.params.id_sell)
        const response = await pool.query('SELECT * FROM repayment JOIN users ON '+
        'repayment.id_user=users.id_user JOIN registers ON users.id_register=registers.id_register '+ 
        'AND id_sell=$1 ORDER BY date,time DESC',[id_sell])
            console.log(id_sell)
        if (response.rowCount > 0) {
            res.json(response.rows)
        } else {
            console.log(req.params.id_repayment)
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'No existen devoluciones con el número de ticket especificado'
            })
        }
    }

    public async getDevolucionByDate(req: Request, res: Response) {
        const initialDate=req.params.initialDate
        const endDate=req.params.endDate
        console.log(initialDate+' '+endDate)
        const response = await pool.query('SELECT * FROM repayment JOIN users ON '+
        'repayment.id_user=users.id_user AND date>=$1 and date<=$2 ORDER BY date,time DESC',
            [initialDate,endDate])
        if (response.rowCount > 0) {
            res.json(response.rows)
        } else {
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'No existen Devoluciones para la fecha especificada'
            })
        }
    }
    public async getDevolucionByUser(req:Request,res:Response){
        const names='%'+req.params.names+'%'
        const response = await pool.query("SELECT * FROM repayment JOIN users ON "+
        "repayment.id_user=users.id_user "+
        "where names_user ilike $1 or last_names_user ilike $1",[names])
        res.json(response.rows)
    }

    public async getDevolucionByType(req:Request,res:Response){
        const type=req.params.type
        const response = await pool.query("SELECT * FROM repayment JOIN users ON "+
        "repayment.id_user=users.id_user "+
        "where type=$1",[type])
        res.json(response.rows)
    }

    public async getProductosDevolucionById(req: Request, res: Response) {
        const id_repayment = parseInt(req.params.id_repayment)
        const response = await pool.query('SELECT * FROM buy_products WHERE id_repayment=$1',
            [id_repayment])
        if (response.rowCount > 0) {
            res.json(response.rows)
        }
    }


    public async createDevolucionCompra(req: Request, res: Response) {
        const { type,id_buy,quantity,buy_price,total, coin,exist_quantity,
            weighted_averages_sell,id_user, id_product,weighted_averages_buy,exchange,sell_price } = req.body
        let response = await pool.query('INSERT INTO repayment (type,id_buy,quantity,'+
        'buy_price,total,coin,exist_quantity,weighted_averages_sell,id_user,id_product,'+
        'weighted_averages_buy,exchange,sell_price) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',
            [type,id_buy,quantity,buy_price,total, coin,exist_quantity,
                weighted_averages_sell,id_user, id_product ,weighted_averages_buy,exchange,sell_price]);
        res.status(200).json({
            icon: '', title: '¡Devolucion Registrada!', content: 'La Devolucion se registró con exito en el sístema'
        })
    }
    public async createDevolucionVenta(req: Request, res: Response) {
        const { type,id_sell,quantity,buy_price,total, coin,exist_quantity,
            weighted_averages_sell,id_user, id_product,weighted_averages_buy,exchange,sell_price } = req.body
        let response = await pool.query('INSERT INTO repayment (type,id_sell,quantity,'+
        'buy_price,total,coin,exist_quantity,weighted_averages_sell,id_user,id_product,'+
        'weighted_averages_buy,exchange,sell_price) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',
            [type,id_sell,quantity,buy_price,total, coin,exist_quantity,
                weighted_averages_sell,id_user, id_product,weighted_averages_buy,exchange,sell_price ]);
        res.status(200).json({
            icon: '', title: '¡Devolucion Registrada!', content: 'La Devolucion se registró con exito en el sístema'
        })
    }

    public async actualizarDevolucion(req: Request, res: Response) {
        const id_repayment = parseInt(req.params.id_repayment)
        const { type,id_operation,quantity,price,total, coin,exist_quantity,
            weighted_averages,id_user, id_product } = req.body
        await pool.query('UPDATE repayment SET otal_buy=$1,id_provider=$2,id_user=$3 WHERE id_repayment=$4',
            [type,id_operation,quantity,price,total, coin,exist_quantity,
                weighted_averages,id_user, id_product ]);
        res.status(200).json({
            icon: '', title: '¡Devolucion Actualizada!', content: 'La Devolucion se actualizó con exito en el sístema'
        })
    }
    public async eliminarDevolucion(req: Request, res: Response) {
        const id_repayment = parseInt(req.params.id_repayment)
        await pool.query('DELETE FROM repayment WHERE id_repayment=$1', [id_repayment])
        res.status(200).json({
            icon: '', title: '¡Devolucion Eliminada!', content: 'La Devolucion se eliminó con exito del sístema'
        })
    }
}
const devolucionsController = new DevolucionesController();
export default devolucionsController;