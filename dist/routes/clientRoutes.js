"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/clientRoutes.ts
const express_1 = __importDefault(require("express"));
const admin_1 = require("../firebase/admin");
const router = express_1.default.Router();
// Criar novo cliente
router.post('/', async (req, res) => {
    try {
        const docRef = await admin_1.db.collection('clients').add(req.body);
        res.status(201).json({ id: docRef.id });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar cliente' });
    }
});
// Listar clientes
router.get('/', async (_req, res) => {
    try {
        const snapshot = await admin_1.db.collection('clients').get();
        const clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(clients);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});
// Obter detalhes
router.get('/:id', async (req, res) => {
    try {
        const doc = await admin_1.db.collection('clients').doc(req.params.id).get();
        if (!doc.exists)
            return res.status(404).json({ error: 'Cliente não encontrado' });
        res.json({ id: doc.id, ...doc.data() });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
});
// Atualizar
router.put('/:id', async (req, res) => {
    try {
        await admin_1.db.collection('clients').doc(req.params.id).update(req.body);
        res.json({ message: 'Cliente atualizado' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
});
// Deletar
router.delete('/:id', async (req, res) => {
    try {
        await admin_1.db.collection('clients').doc(req.params.id).delete();
        res.json({ message: 'Cliente deletado' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
});
exports.default = router;
