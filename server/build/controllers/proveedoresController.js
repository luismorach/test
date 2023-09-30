"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
class ProveedoresController {
    async getProveedores(req, res) {
        const response = await database_1.default.query('SELECT * FROM providers ORDER BY name_provider ASC');
        res.json(response.rows);
    }
    async getProveedoresById(req, res) {
        const id_provider = parseInt(req.params.id_provider);
        const response = await database_1.default.query('SELECT * FROM providers WHERE id_provider=$1 ORDER BY name_provider ASC', [id_provider]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'El proveedor que intenta actualizar ya no existe actualice la lista de proveedores e intentelo otra vez'
            });
        }
    }
    async createProveedor(req, res) {
        const { document_type, document_number, name_provider, address_provider, name_boss, phone_number, email, } = req.body;
        await database_1.default.query('INSERT INTO providers ' +
            '(document_type,document_number,name_provider,address_provider,name_boss,' +
            'phone_number,email) values($1,$2,$3,$4,$5,$6,$7)', [document_type, document_number, name_provider, address_provider, name_boss,
            phone_number, email]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Proveedor Registrado!', content: 'El proveedor se registró con exito en el sístema'
        });
    }
    async actualizarProveedor(req, res) {
        const id_provider = parseInt(req.params.id_provider);
        const { document_type, document_number, name_provider, address_provider, name_boss, phone_number, email, } = req.body;
        await database_1.default.query('UPDATE providers SET document_type=$1,document_number=$2,' +
            'name_provider=$3,address_provider=$4,name_boss=$5,phone_number=$6,email=$7 ' +
            'WHERE id_provider=$8', [document_type, document_number, name_provider, address_provider, name_boss,
            phone_number, email, id_provider]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Proveedor Actualizado!', content: 'El proveedor se actualizó con exito en el sístema'
        });
    }
    async eliminarProveedor(req, res) {
        const id_provider = parseInt(req.params.id_provider);
        await database_1.default.query('DELETE FROM providers WHERE id_provider=$1', [id_provider]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Proveedor Eliminado!', content: 'El proveedor se elimminó con exito del sístema'
        });
    }
}
const proveedoresController = new ProveedoresController();
exports.default = proveedoresController;
