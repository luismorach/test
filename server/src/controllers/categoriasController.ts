import { Request, Response } from 'express';
import pool from '../database/database';

class CategoriasController {

    public async getcategorías(req: Request, res: Response) {
        const response = await pool.query('SELECT * FROM categories ORDER BY name ASC')
        res.json(response.rows)
    }
    public async getcategoríaById(req: Request, res: Response) {
        const id_category = parseInt(req.params.id_category)
        const response = await pool.query('SELECT * FROM categories WHERE id_category=$1 ORDER BY name ASC',
            [id_category])
        if (response.rowCount > 0) {
            res.json(response.rows)
        } else {
            res.json({
                icon: 'fa-regular fa-circle-xmark',
                title: 'Ocurrió un error inesperado',
                content: 'La categoría que intenta actualizar ya no existe actualice la lista de categorías e intentelo otra vez'
            })
        }
    }
    public async createcategoría(req: Request, res: Response) {
        const { name, ubication } = req.body
        await pool.query('INSERT INTO categories (name,ubication) values($1,$2)', [name, ubication]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Categoría Registrada!', content: 'La categoría se registró con exito en el sístema'
        })
    }

    public async actualizarcategoría(req: Request, res: Response) {
        const id_category = parseInt(req.params.id_category)
        const { name, ubication } = req.body
        await pool.query('UPDATE categories SET name=$1,ubication=$2 WHERE id_category=$3',
            [name, ubication, id_category]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Categoría Actualizada!', content: 'La categoría se actualizó con exito en el sístema'
        })
    }
    public async eliminarcategoría(req: Request, res: Response) {
        const id_category = parseInt(req.params.id_category)
        await pool.query('DELETE FROM categories WHERE id_category=$1', [id_category])
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Categoría Eliminada!', content: 'La categoría se elimminó con exito del sístema'
        })
    }
}
const categoriasController = new CategoriasController();
export default categoriasController;