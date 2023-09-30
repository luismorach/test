"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
class CategoriasController {
    async getcategorías(req, res) {
        const response = await database_1.default.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(response.rows);
    }
    async getcategoríaById(req, res) {
        const id_category = parseInt(req.params.id_category);
        const response = await database_1.default.query('SELECT * FROM categories WHERE id_category=$1 ORDER BY name ASC', [id_category]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            res.json({
                icon: 'fa-regular fa-circle-xmark',
                title: 'Ocurrió un error inesperado',
                content: 'La categoría que intenta actualizar ya no existe actualice la lista de categorías e intentelo otra vez'
            });
        }
    }
    async createcategoría(req, res) {
        const { name, ubication } = req.body;
        await database_1.default.query('INSERT INTO categories (name,ubication) values($1,$2)', [name, ubication]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Categoría Registrada!', content: 'La categoría se registró con exito en el sístema'
        });
    }
    async actualizarcategoría(req, res) {
        const id_category = parseInt(req.params.id_category);
        const { name, ubication } = req.body;
        await database_1.default.query('UPDATE categories SET name=$1,ubication=$2 WHERE id_category=$3', [name, ubication, id_category]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Categoría Actualizada!', content: 'La categoría se actualizó con exito en el sístema'
        });
    }
    async eliminarcategoría(req, res) {
        const id_category = parseInt(req.params.id_category);
        await database_1.default.query('DELETE FROM categories WHERE id_category=$1', [id_category]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Categoría Eliminada!', content: 'La categoría se elimminó con exito del sístema'
        });
    }
}
const categoriasController = new CategoriasController();
exports.default = categoriasController;
