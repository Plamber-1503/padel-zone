import express from 'express';
import { db } from '../db.js';

const router = express.Router();

const VALID_ENTITIES = ['User', 'Court', 'Booking', 'Post', 'Comment', 'ChatMessage', 'Follow', 'Review'];

function validateEntity(req, res, next) {
  const entityName = req.params.entity;
  if (!VALID_ENTITIES.includes(entityName)) {
    return res.status(404).json({ error: `Entidad '${entityName}' no encontrada` });
  }
  next();
}

// GET list / filter
router.get('/:entity', validateEntity, (req, res) => {
  try {
    const entityName = req.params.entity;
    const { sort, limit, ...filterParams } = req.query;

    const parsedLimit = limit ? parseInt(limit, 10) : 100;
    
    // Si hay parámetros de filtro en el query string
    let results;
    if (Object.keys(filterParams).length > 0) {
      // Convertir 'true' / 'false' strings a booleans si corresponde
      const parsedFilters = {};
      for (const [key, val] of Object.entries(filterParams)) {
        if (val === 'true') parsedFilters[key] = true;
        else if (val === 'false') parsedFilters[key] = false;
        else parsedFilters[key] = val;
      }
      results = db.filter(entityName, parsedFilters, sort, parsedLimit);
    } else {
      results = db.list(entityName, sort, parsedLimit);
    }

    // Ocultar hash de contraseñas si es User
    if (entityName === 'User') {
      results = results.map(({ password_hash, ...u }) => u);
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by ID
router.get('/:entity/:id', validateEntity, (req, res) => {
  try {
    const item = db.getById(req.params.entity, req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    if (req.params.entity === 'User') {
      delete item.password_hash;
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/:entity', validateEntity, (req, res) => {
  try {
    const newItem = db.create(req.params.entity, req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update
router.put('/:entity/:id', validateEntity, (req, res) => {
  try {
    const updatedItem = db.update(req.params.entity, req.params.id, req.body);
    if (!updatedItem) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:entity/:id', validateEntity, (req, res) => {
  try {
    const result = db.delete(req.params.entity, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
