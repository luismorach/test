"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
class CajasController {
    async getKardex(req, res) {
        const response = await database_1.default.query('SELECT * FROM kardex JOIN products ON ' +
            'kardex.id_product=products.id_product ORDER BY date,time ASC');
        res.json(response.rows);
    }
    async getKardexById(req, res) {
        const type = req.params.type;
        const id_operation = parseInt(req.params.id_operation);
        const id_product = parseInt(req.params.id_product);
        console.log(type);
        const response = await database_1.default.query('SELECT * FROM kardex JOIN products ON ' +
            'kardex.id_product=products.id_product where type=$1 And id_operation=$2 AND kardex.id_product=$3 ' +
            'ORDER BY date,time ASC', [type, id_operation, id_product]);
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
    async getKardexByDate(req, res) {
        const initialDate = req.params.initialDate;
        const endDate = req.params.endDate;
        const response = await database_1.default.query('SELECT * FROM kardex JOIN products ON ' +
            'kardex.id_product=products.id_product where date>=$1 and date<=$2 ORDER BY date,time ASC', [initialDate, endDate]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            res.json({
                icon: 'fa-regular fa-circle-xmark',
                title: 'Ocurrió un error inesperado',
                content: 'No existen movimientos para fecha especificada'
            });
        }
    }
    async getKardexByProduct(req, res) {
        const barcode = parseInt(req.params.barcode);
        const response = await database_1.default.query("SELECT * " +
            "FROM kardex JOIN products ON kardex.id_product=products.id_product " +
            "where products.barcode=$1", [barcode]);
        res.json(response.rows);
    }
}
const cajasController = new CajasController();
exports.default = cajasController;
