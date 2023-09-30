"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
class UsuariosController {
    async getUsuarios(req, res) {
        const response = await database_1.default.query('SELECT * FROM users ORDER BY names_user ASC');
        res.json(response.rows);
    }
    async getUsuariosById(req, res) {
        const id_user = parseInt(req.params.id_user);
        const response = await database_1.default.query('SELECT * FROM users WHERE id_user=$1 ORDER BY names_user ASC', [id_user]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'El usuario que intenta actualizar ya no existe actualice la lista de Usuarios e intentelo otra vez'
            });
        }
    }
    async createUsuario(req, res) {
        const { document_type_user, document_number_user, range_user, names_user, last_names_user, phone_number_user, gander_user, id_register, email_user, password_user, state_user } = req.body;
        await database_1.default.query('INSERT INTO users ' +
            '(document_type_user,document_number_user,range_user,names_user,last_names_user,' +
            'phone_number_user,gander_user,id_register,' +
            'email_user,password_user,state_user) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [document_type_user, document_number_user, range_user, names_user, last_names_user,
            phone_number_user, gander_user, id_register, email_user, password_user, state_user]);
        res.status(200).json({
            icon: '', title: '¡Usuario Registrado!', content: 'El Usuario se registró con exito en el sístema'
        });
    }
    async actualizarUsuario(req, res) {
        const id_user = parseInt(req.params.id_user);
        const { document_type_user, document_number_user, range_user, names_user, last_names_user, phone_number_user, gander_user, id_register, email_user, password_user, state_user } = req.body;
        await database_1.default.query('UPDATE users SET document_type_user=$1,document_number_user=$2,' +
            'range_user=$3,names_user=$4,last_names_user=$5,phone_number_user=$6,gander_user=$7,' +
            'id_register=$8,email_user=$9,password_user=$10,state_user=$11 WHERE id_user=$12', [document_type_user, document_number_user, range_user, names_user, last_names_user,
            phone_number_user, gander_user, id_register, email_user, password_user, state_user, id_user]);
        res.status(200).json({
            icon: '', title: '¡Usuario Actualizado!', content: 'El Usuario se actualizó con exito en el sístema'
        });
    }
    async eliminarUsuario(req, res) {
        const id_user = parseInt(req.params.id_user);
        await database_1.default.query('DELETE FROM users WHERE id_user=$1', [id_user]);
        res.status(200).json({
            icon: '', title: '¡Usuario Eliminado!', content: 'El Usuario se elimminó con exito del sístema'
        });
    }
}
const usuariosController = new UsuariosController();
exports.default = usuariosController;
