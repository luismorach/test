"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
class CajasController {
    async getCajas(req, res) {
        const response = await database_1.default.query('SELECT * FROM registers ORDER BY name ASC');
        res.json(response.rows);
    }
    async getCajaById(req, res) {
        const id_register = parseInt(req.params.id_register);
        const response = await database_1.default.query('SELECT * FROM registers WHERE id_register=$1 ORDER BY name ASC', [id_register]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            res.json({
                icon: 'fa-regular fa-circle-xmark',
                title: 'Ocurrió un error inesperado',
                content: 'La caja que intenta actualizar ya no existe actualice la lista de cajas e intentelo otra vez'
            });
        }
    }
    async createCaja(req, res) {
        const { name, state } = req.body;
        await database_1.default.query('INSERT INTO registers (name,state) values($1,$2)', [name, state]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Caja Registrada!', content: 'La caja se registro con exito en el sístema'
        });
    }
    async actualizarCaja(req, res) {
        const id_register = parseInt(req.params.id_register);
        const { name, state } = req.body;
        await database_1.default.query('UPDATE registers SET name=$1,state=$2 WHERE id_register=$3', [name, state, id_register]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Caja Actualizada!', content: 'La caja se actualizó con exito en el sístema'
        });
    }
    async eliminarCaja(req, res) {
        const id_register = parseInt(req.params.id_register);
        await database_1.default.query('DELETE FROM registers WHERE id_register=$1', [id_register]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Caja Eliminada!', content: 'La caja se elimminó con exito del sístema'
        });
    }
}
const cajasController = new CajasController();
exports.default = cajasController;
