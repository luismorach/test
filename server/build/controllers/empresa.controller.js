"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
class EmpresaController {
    async getEmpresas(req, res) {
        const response = await database_1.default.query('SELECT * FROM building ORDER BY name ASC');
        res.json(response.rows);
    }
    async getEmpresaById(req, res) {
        const id_register = parseInt(req.params.id_register);
        const response = await database_1.default.query('SELECT * FROM building WHERE id_register=$1 ORDER BY name ASC', [id_register]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'La caja que intenta actualizar ya no existe actualice la lista de cajas e intentelo otra vez'
            });
        }
    }
    async createEmpresa(req, res) {
        const { document_type, document_number, name, coin, address, name_tax, tax_rate, show_tax, email, phone_number, exhange_bs, exhange_dolar, exhange_euro } = req.body;
        await database_1.default.query('INSERT INTO building (document_type,document_number,name,coin,address,' +
            'name_tax,tax_rate,show_tax,email,phone_number,exhange_bs,exhange_dolar,' +
            'exhange_euro) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)', [document_type, document_number, name, coin, address, name_tax, tax_rate,
            show_tax, email, phone_number, exhange_bs, exhange_dolar, exhange_euro]);
        res.status(200).json({
            icon: '', title: '¡Empresa Registrada!', content: 'La Empresa se registró con exitó en el sístema'
        });
    }
    async actualizarEmpresa(req, res) {
        const id_building = parseInt(req.params.id_building);
        const { document_type, document_number, name, coin, address, name_tax, tax_rate, show_tax, email, phone_number, exhange_bs, exhange_dolar, exhange_euro } = req.body;
        await database_1.default.query('UPDATE building SET document_type=$1,document_number=$2,' +
            'name=$3,coin=$4,address=$5,name_tax=$6,tax_rate=$7,show_tax=$8,' +
            'email=$9,phone_number=$10,exchange_bs=$11,exchange_dolar=$12,exchange_euro=13' +
            'WHERE id_building=$14', [document_type, document_number, name, coin, address, name_tax, tax_rate,
            show_tax, email, phone_number, exhange_bs, exhange_dolar, exhange_euro, id_building]);
        res.status(200).json({
            icon: '', title: '¡Caja Actualizada!', content: 'La caja se actualizó con exito en el sístema'
        });
    }
    async eliminarCaja(req, res) {
        const id_register = parseInt(req.params.id_register);
        await database_1.default.query('DELETE FROM registers WHERE id_register=$1', [id_register]);
        res.status(200).json({
            icon: '', title: '¡Caja Eliminada!', content: 'La caja se elimminó con exito del sístema'
        });
    }
}
const empresaController = new EmpresaController();
exports.default = empresaController;
