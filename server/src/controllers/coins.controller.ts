import { Request, Response } from 'express';
import pool from '../database/database';

class CoinsController {

    public async getCoins(req: Request, res: Response) {
        const response = await pool.query('SELECT * FROM coins ORDER BY name ASC')
        res.json(response.rows)
    }
    public async getCoinById(req: Request, res: Response) {
        const id_coin = parseInt(req.params.id_coin)
        const response = await pool.query('SELECT * FROM coins WHERE id_coin=$1 ORDER BY name ASC',
            [id_coin])
        if (response.rowCount > 0) {
            res.json(response.rows)
        } else {
            res.json({
                icon: 'fa-regular fa-circle-xmark',
                title: 'Ocurrió un error inesperado',
                content: 'La moneda que intenta actualizar ya no existe actualice la lista de Coins e intentelo otra vez'
            })
        }
    }
    public async getMainCoin(req: Request, res: Response) {
        const response = await pool.query("SELECT * FROM coins where type='principal'ORDER BY name ASC")
        res.json(response.rows)
    }
    public async createCoin(req: Request, res: Response) {
        const { name,symbol,type,exchange,id_building} = req.body
        await pool.query('INSERT INTO coins (name,symbol,type,exchange,id_building)'+
        'values($1,$2,$3,$4,$5)', [name,symbol,type,exchange,id_building]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Coin Registrada!', content: 'La Coin se registró con exito en el sístema'
        })
    }

    public async actualizarCoin(req: Request, res: Response) {
        const id_coin = parseInt(req.params.id_coin)
        const { name,symbol,type,exchange,id_building } = req.body
        await pool.query('UPDATE coins SET name=$1,symbol=$2,type=$3,exchange=$4,id_building=$5'+ 
        'WHERE id_coin=$6',[name, symbol,type,exchange,id_building, id_coin]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Coin Actualizada!', content: 'La Coin se actualizó con exito en el sístema'
        })
    }
    public async eliminarCoin(req: Request, res: Response) {
        const id_coin = parseInt(req.params.id_coin)
        await pool.query('DELETE FROM coins WHERE id_coin=$1', [id_coin])
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Coin Eliminada!', content: 'La Coin se elimminó con exito del sístema'
        })
    }
}
const coinsController = new CoinsController();
export default coinsController;