import { Request, Response } from 'express';
import pool from '../database/database';

class ComprasController {

    public async getCompras(req: Request, res: Response) {
        const response = await pool.query('SELECT * FROM buys ORDER BY time DESC ')
        res.json(response.rows)
    }

    public async getCompraById(req: Request, res: Response) {
        const id_buy = parseInt(req.params.id_buy)
        const response = await pool.query('SELECT * FROM buys WHERE id_buy=$1 ORDER BY time DESC',
            [id_buy])
        if (response.rowCount > 0) {
            res.json(response.rows)
        } else {
            console.log(req.params.id_buy)
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'No existen compras con el número de ticket especificado'
            })
        }
    }
    public async getCompraByDate(req: Request, res: Response) {
        const initialDate=req.params.initialDate
        const endDate=req.params.endDate
        console.log(initialDate+' '+endDate)
        const response = await pool.query('SELECT * FROM buys WHERE date>=$1 and date<=$2 ORDER BY date,time DESC',
            [initialDate,endDate])
        if (response.rowCount > 0) {
            res.json(response.rows)
        } else {
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'No existen compras para la fecha especificada'
            })
        }
    }
    public async getComprasByUser(req:Request,res:Response){
        const names='%'+req.params.names+'%'
        const response = await pool.query("SELECT id_buy,type,total_buy,id_provider,buys.id_user,coin,date,time "+
        "FROM buys JOIN users ON buys.id_user=users.id_user "+
        "where names_user ilike $1 or last_names_user ilike $1",[names])
        res.json(response.rows)
    }
    public async getComprasByProvider(req:Request,res:Response){
        const name='%'+req.params.name+'%'
        console.log(name)
        const response = await pool.query("SELECT id_buy,type,total_buy,buys.id_provider,id_user,coin,date,time "+
        "FROM buys JOIN providers ON buys.id_provider=providers.id_provider "+
        "where name_provider ilike $1",[name])
        if (response.rowCount > 0) {
            res.json(response.rows)
        } else {
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'No existen compras para el criterio especificado'
            })
        }
    }

    public async getProductosCompraById(req: Request, res: Response) {
        const id_buy = parseInt(req.params.id_buy)
        const response = await pool.query('SELECT * FROM buy_products WHERE id_buy=$1',
            [id_buy])
        if (response.rowCount > 0) {
            res.json(response.rows)
        }
    }
    public async getProductoCompraById(req: Request, res: Response) {
        const id_buy = parseInt(req.params.id_buy)
        const id_product=parseInt(req.params.id_product)
        const response = await pool.query('SELECT * FROM buy_products WHERE id_buy=$1 and id_product=$2',
            [id_buy,id_product])
        if (response.rowCount > 0) {
            res.json(response.rows)
        }
    }


    public async createCompra(req: Request, res: Response) {
        const { total_buy, coin,exchange, id_provider, id_user, buy_products } = req.body
        let response = await pool.query('INSERT INTO buys (total_buy,coin,exchange,id_provider,id_user)'+
        'values($1,$2,$3,$4,$5) RETURNING id_buy',
            [total_buy, coin,exchange, id_provider, id_user]);
        buy_products.forEach(async (data: any) => {
            await pool.query('INSERT INTO buy_products (id_buy,id_product,buy_price,sell_price,' +
                'weighted_averages_sell,quantity_products,exist_products,quantity_back,'+
                'weighted_averages_buy,discount_product,impuest)' +
                'values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [response.rows[0].id_buy, data.id_product, data.buy_price,
                data.sell_price, data.weighted_averages_sell, data.quantity_products,
                 data.exist_products, data.quantity_back,data.weighted_averages_buy,
                 data.discount_product,data.impuest])
        })
        res.status(200).json({
            icon: '', title: '¡Compra Registrado!', content: 'La compra se registró con exito en el sístema'
        })
    }

    public async actualizarCompra(req: Request, res: Response) {
        const id_buy = parseInt(req.params.id_buy)
        const { total_buy, id_provider, id_user } = req.body
        await pool.query('UPDATE buys SET total_buy=$1,id_provider=$2,id_user=$3 WHERE id_buy=$4',
            [total_buy, id_provider, id_user,id_buy]);
        res.status(200).json({
            icon: '', title: '¡Compra Actualizada!', content: 'La compra se actualizó con exito en el sístema'
        })
    }
    public async actualizarProductosCompra(req: Request, res: Response) {
        const id_buy_old = parseInt(req.params.id_buy)
        const id_product_old = parseInt(req.params.id_product)
        const { id_buy,id_product,buy_price,sell_price,weighted_averages,quantity_products,
        exist_products,quantity_back } = req.body
        await pool.query('UPDATE buy_products set id_buy=$1,id_product=$2,buy_price=$3,sell_price=$4,' +
        'weighted_averages=$5,quantity_products=$6,exist_products=$7,quantity_back=$8 where id_buy=$9 and id_product=$10',
            [id_buy,id_product,buy_price,sell_price,weighted_averages,quantity_products,
                exist_products,quantity_back,id_buy_old,id_product_old]);
        res.status(200).json({
            icon: '', title: '¡Compra Actualizada!', content: 'La compra se actualizó con exito en el sístema'
        })
    }
    public async eliminarCompra(req: Request, res: Response) {
        const id_buy = parseInt(req.params.id_buy)
        await pool.query('DELETE FROM buys WHERE id_buy=$1', [id_buy])
        res.status(200).json({
            icon: '', title: '¡Compra Eliminada!', content: 'La compra se eliminó con exito del sístema'
        })
    }
}
const comprasController = new ComprasController();
export default comprasController;