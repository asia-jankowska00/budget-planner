const express = require("express");
const router = express.Router();
const Category = require('../models/category');
const categorySchemas = require('./schemas/categorySchemas');

router.post('/', async (req, res) => {
    try {
        await categorySchemas.defaultCategory.validateAsync(req.body);

        const newCategory = await Category.create(req.body);

        await categorySchemas.defaultCategory.validateAsync(newCategory);

    } catch {
        res.status(err.status || 400).json(err);
    }
})

router.get('/', async (req, res) => {
    try {
        const categories = await Category.readAll();

        await categorySchemas.defaultCategory.validateAsync(categories);
        res.json(categories);
    } catch {
        res.status(err.status || 400).json(err);
    }
})

router.get('/:categoryId', async (req, res) => {
    try {
        const category = await Category.readById(req.params.categoryId);

        await categorySchemas.defaultCategory.validateAsync(category);

        res.json(category);
    } catch {
        res.status(err.status || 400).json(err);
    }
})

router.patch('/:categoryId', async (req, res) => {
    try {
        await categorySchemas.defaultCategory.validateAsync(req.body);

        const category = await Category.readById(req.params.categoryId);
        await category.update(req.body);

        await categorySchemas.defaultCategory.validateAsync(category);
        res.json(category)
    } catch {
        res.status(err.status || 400).json(err);
    }
})

router.delete('/:categoryId', async (req, res) => {
    try {
        await Category.delete(req.params.id);
        res.json('Category deleted')
    } catch {
        res.status(err.status || 400).json(err);
    }
})

module.exports = router;