import express from 'express';
import { prisma } from '../config/db.js';
import { entityNameMap, normalizeFilter, parseSort } from '../utils/helpers.js';

const ARRAY_FIELDS = new Set([
  'photo_urls',
  'image_urls',
  'tags',
  'completed_lessons',
  'features',
]);

const prepareData = (data) => {
  const prepared = { ...data };
  Object.entries(prepared).forEach(([key, value]) => {
    if (Array.isArray(value) && ARRAY_FIELDS.has(key)) {
      prepared[key] = JSON.stringify(value);
    }
  });
  return prepared;
};

const parseValues = (item) => {
  if (!item || typeof item !== 'object') return item;
  const parsed = { ...item };
  Object.entries(parsed).forEach(([key, value]) => {
    if (typeof value === 'string' && ARRAY_FIELDS.has(key)) {
      try {
        parsed[key] = JSON.parse(value);
      } catch {
        parsed[key] = value;
      }
    }
  });
  return parsed;
};

const router = express.Router();

router.get('/:entity', async (req, res) => {
  const modelName = entityNameMap[req.params.entity];
  if (!modelName) {
    return res.status(404).json({ error: 'Entity not found' });
  }

  const sort = parseSort(req.query.sort);
  const limit = Number(req.query.limit) || 100;
  const skip = Number(req.query.skip) || 0;
  const filters = normalizeFilter({ ...req.query });
  delete filters.sort;
  delete filters.limit;
  delete filters.skip;
  delete filters.fields;

  try {
    const items = await prisma[modelName].findMany({
      where: filters,
      orderBy: sort,
      take: limit,
      skip,
    });
    return res.json(items.map(parseValues));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/:entity/filter', async (req, res) => {
  const modelName = entityNameMap[req.params.entity];
  if (!modelName) {
    return res.status(404).json({ error: 'Entity not found' });
  }

  const sort = parseSort(req.query.sort);
  const limit = Number(req.query.limit) || 100;
  const skip = Number(req.query.skip) || 0;
  const fields = req.query.fields ? String(req.query.fields).split(',') : null;
  const where = normalizeFilter(req.body || {});
  const select = fields ? Object.fromEntries(fields.map((field) => [field, true])) : undefined;

  try {
    const items = await prisma[modelName].findMany({
      where,
      orderBy: sort,
      take: limit,
      skip,
      select,
    });
    return res.json(items.map(parseValues));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/:entity/:id', async (req, res) => {
  const modelName = entityNameMap[req.params.entity];
  if (!modelName) {
    return res.status(404).json({ error: 'Entity not found' });
  }

  try {
    const item = await prisma[modelName].findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Not found' });
    return res.json(parseValues(item));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/:entity', async (req, res) => {
  const modelName = entityNameMap[req.params.entity];
  if (!modelName) {
    return res.status(404).json({ error: 'Entity not found' });
  }

  try {
    const data = prepareData(normalizeFilter(req.body || {}));
    const item = await prisma[modelName].create({ data });
    return res.status(201).json(parseValues(item));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.patch('/:entity/:id', async (req, res) => {
  const modelName = entityNameMap[req.params.entity];
  if (!modelName) {
    return res.status(404).json({ error: 'Entity not found' });
  }

  try {
    const data = prepareData(normalizeFilter(req.body || {}));
    const item = await prisma[modelName].update({
      where: { id: req.params.id },
      data,
    });
    return res.json(parseValues(item));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete('/:entity/:id', async (req, res) => {
  const modelName = entityNameMap[req.params.entity];
  if (!modelName) {
    return res.status(404).json({ error: 'Entity not found' });
  }

  try {
    await prisma[modelName].delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
