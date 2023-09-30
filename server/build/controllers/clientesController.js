"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
class ClientesController {
    async getClientes(req, res) {
        const response = await database_1.default.query('SELECT * FROM clients ORDER BY names_client ASC');
        res.json(response.rows);
    }
    async getClienteById(req, res) {
        const id_client = parseInt(req.params.id_client);
        const response = await database_1.default.query('SELECT * FROM clients WHERE id_client=$1 ORDER BY names_client ASC', [id_client]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            res.json({
                icon: 'fa-regular fa-circle-xmark',
                title: 'Ocurrió un error inesperado',
                content: 'El cliente que intenta actualizar ya no existe actualice la lista de Clientes e intentelo otra vez'
            });
        }
    }
    async createCliente(req, res) {
        const { document_type_client, document_number_client, names_client, last_names_client, state_client, city_client, street_client, phone_number_client, email_client } = req.body;
        let response = await database_1.default.query('INSERT INTO clients ' +
            '(document_type_client,document_number_client,names_client,last_names_client,state_client,city_client,' +
            'street_client,phone_number_client,email_client) values($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id_client', [document_type_client, document_number_client, names_client, last_names_client, state_client,
            city_client, street_client, phone_number_client, email_client]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Cliente Registrado!', content: 'El Cliente se registró con exito en el sístema',
            id_client: response.rows[0].id_client
        });
    }
    async actualizarCliente(req, res) {
        const id_client = parseInt(req.params.id_client);
        const { document_type_client, document_number_client, names_client, last_names_client, state_client, city_client, street_client, phone_number_client, email_client } = req.body;
        await database_1.default.query('UPDATE clients SET document_type_client=$1,document_number_client=$2,' +
            'names_client=$3,last_names_client=$4,state_client=$5,city_client=$6,street_client=$7,' +
            'phone_number_client=$8,email_client=$9 WHERE id_client=$10', [document_type_client, document_number_client, names_client, last_names_client, state_client,
            city_client, street_client, phone_number_client, email_client, id_client]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Cliente Actualizado!', content: 'El Cliente se actualizó con exito en el sístema'
        });
    }
    async eliminarCliente(req, res) {
        const id_client = parseInt(req.params.id_client);
        await database_1.default.query('DELETE FROM clients WHERE id_client=$1', [id_client]);
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Cliente Eliminado!', content: 'El Cliente se elimminó con exito del sístema'
        });
    }
}
const clientesController = new ClientesController();
exports.default = clientesController;
