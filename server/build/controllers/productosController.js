"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
class ProductosController {
    async getProductos(req, res) {
        const response = await database_1.default.query('SELECT * FROM products ORDER BY name ASC');
        res.json(response.rows);
    }
    async getProductosMasVendidos(req, res) {
        const response = await database_1.default.query('SELECT * FROM products ORDER BY sell_quantity DESC');
        res.json(response.rows);
    }
    async getProductosPorVencimiento(req, res) {
        const response = await database_1.default.query('SELECT * FROM products ORDER BY expir DESC');
        res.json(response.rows);
    }
    async getProductoById(req, res) {
        const id_product = parseInt(req.params.id_product);
        const response = await database_1.default.query('SELECT * FROM products WHERE id_product=$1 ORDER BY name ASC', [id_product]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'El producto que intenta actualizar ya no existe actualice la lista de Productos e intentelo otra vez'
            });
        }
    }
    async getProductoByBarcode(req, res) {
        const barcode = parseInt(req.params.barcode);
        const response = await database_1.default.query('SELECT * FROM products WHERE barcode=$1 ORDER BY name ASC', [barcode]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'El producto que intenta buscar no existe en el sistema'
            });
        }
    }
    async getProductoByCategory(req, res) {
        const id_category = parseInt(req.params.id_category);
        const response = await database_1.default.query('SELECT * FROM products WHERE id_category=$1 ORDER BY name ASC', [id_category]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'El producto que intenta actualizar ya no existe actualice la lista de Productos e intentelo otra vez'
            });
        }
    }
    async createProducto(req, res) {
        const { barcode, name, garanty, mark, model, can_expir, expir, time_garanty, id_category, discount, impuest } = req.body;
        await database_1.default.query('INSERT INTO products ' +
            '(barcode,name,garanty,mark,model,can_expir,expir,time_garanty,id_category,discount,impuest)' +
            'values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [barcode, name, garanty, mark, model, can_expir, expir, time_garanty, id_category, discount, impuest]);
        res.status(200).json({
            icon: '', title: '¡Producto Registrado!', content: 'El Producto se registró con exito en el sístema'
        });
    }
    async actualizarProducto(req, res) {
        const id_product = parseInt(req.params.id_product);
        const { barcode, name, garanty, mark, model, can_expir, expir, time_garanty, id_category, discount, impuest, buy_price, sell_price, exist_quantity, coin } = req.body;
        await database_1.default.query('UPDATE products SET barcode=$1,name=$2,garanty=$3,mark=$4,' +
            'model=$5,can_expir=$6,expir=$7,time_garanty=$8,id_category=$9,discount=$10,impuest=$11,' +
            'buy_price=$12,sell_price=$13,exist_quantity=$14,coin=$15 WHERE id_product=$16', [barcode, name, garanty, mark, model, can_expir, expir, time_garanty, id_category, discount,
            impuest, buy_price, sell_price, exist_quantity, coin, id_product]);
        res.status(200).json({
            icon: '', title: '¡Producto Actualizado!', content: 'El Producto se actualizó con exito en el sístema'
        });
    }
    async eliminarProducto(req, res) {
        const id_product = parseInt(req.params.id_product);
        await database_1.default.query('DELETE FROM products WHERE id_product=$1', [id_product]);
        res.status(200).json({
            icon: '', title: '¡Producto Eliminado!', content: 'El Producto se eliminó con exito del sístema'
        });
    }
}
const productosController = new ProductosController();
exports.default = productosController;
