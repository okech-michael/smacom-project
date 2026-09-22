import express from 'express';
import { prisma } from '../config/db.js';
import { entityNameMap, normalizeFilter, parseSort } from '../utils/helpers.js';
import authMiddleware from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';
import { assertCreateAccess, assertEntityAccess, restrictListWhere } from '../middleware/entityAuthorization.js';
import { isValidRole } from '../config/roles.js';

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
router.use(authMiddleware);
router.use('/User', roleGuard('admin'));

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
  const restrictedWhere = restrictListWhere(req.params.entity, filters, req.user);
  if (!restrictedWhere) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const items = await prisma[modelName].findMany({
      where: restrictedWhere,
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
  const restrictedWhere = restrictListWhere(req.params.entity, where, req.user);
  if (!restrictedWhere) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const select = fields ? Object.fromEntries(fields.map((field) => [field, true])) : undefined;

  try {
    const items = await prisma[modelName].findMany({
      where: restrictedWhere,
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
    const access = await assertEntityAccess(req.params.entity, item, req.user, 'read');
    if (!access.allowed) return res.status(access.status).json({ error: access.error });
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
    const access = assertCreateAccess(req.params.entity, data, req.user);
    if (!access.allowed) return res.status(access.status).json({ error: access.error });
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
    const existing = await prisma[modelName].findUnique({ where: { id: req.params.id } });
    const access = await assertEntityAccess(req.params.entity, existing, req.user, 'update');
    if (!access.allowed) return res.status(access.status).json({ error: access.error });
    const data = prepareData(normalizeFilter(req.body || {}));
    if (req.params.entity === 'User' && Object.prototype.hasOwnProperty.call(data, 'role')) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Role changes require administrator approval' });
      }
      if (!isValidRole(data.role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
    }
    delete data.id;
    delete data.created_date;
    delete data.updated_date;
    for (const key of ['user_id', 'buyer_id', 'seller_id', 'owner_id', 'processor_id', 'assigned_processor_id']) {
      if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== existing[key]) {
        return res.status(403).json({ error: 'Ownership cannot be changed' });
      }
    }
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
    const existing = await prisma[modelName].findUnique({ where: { id: req.params.id } });
    const access = await assertEntityAccess(req.params.entity, existing, req.user, 'delete');
    if (!access.allowed) return res.status(access.status).json({ error: access.error });
    await prisma[modelName].delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
