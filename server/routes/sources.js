const express = require("express");
const Source = require("../models/source");
const router = express.Router();

const sourceSchemas = require('./schemas/sourceSchemas');

router.post('/', async (req,res) =>{
    try {
        // get the user from middleware (req.user)
        await sourceSchemas.postSourcesInput.validateAsync(req.body);
        
        // if everything is fine, procceed create
        const newSource = await Source.create(req.body, req.user);
       
        await sourceSchemas.defaultSourceOutput.validateAsync(newSource);

        res.status(201).json(newSource);


    } catch (err){
        // if exists, throw an error
        console.log(err);
        res.status(err.status || 400).json(err);
    }
});

router.get('', async (req,res) => {
    try {
        const sources = await Source.readAllOwner(req.user);

        await sourceSchemas.getSourcesOutput.validateAsync(sources);
        res.json(sources);
    } catch (err) {
        res.status(err.status || 400).json(err);
      }
});

router.get('/:sourceId', async (req,res) => {
    try {
        const source = await Source.readById(req.params.sourceId, req.user);
    
        await sourceSchemas.defaultSourceOutput.validateAsync(source);
    
        res.json(source);
      } catch (err) {
        res.status(err.status || 400).json(err);
      }
});

router.patch('/:sourceId', async (req,res) => {
    try {
        await sourceSchemas.patchSourceInput.validateAsync(req.body);

        const source = await Source.readById(req.params.sourceId, req.user);
        await source.update(req.body, req.user);
    
        await sourceSchemas.defaultSourceOutput.validateAsync(source);
    
        res.json(source);
      } catch (err) {
        res.status(err.status || 400).json(err);
      }
});

router.delete('/:sourceId', async (req,res) => {
    try{
        await Source.delete(req.params.sourceId, req.user);
        res.status(200).json({"message":"Source deleted"});
    } catch (err){
        console.log(err);
        res.status(err.status || 400).json(err);
    }
});

module.exports = router;