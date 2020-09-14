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
       
        await sourceSchemas.postSourcesOutput.validateAsync(newSource);

        res.status(201).json(newSource);


    } catch (err){
        // if exists, throw an error
        console.log(err);
        res.status(err.status || 400).json(err);
    }
});

router.get('/', async (req,res) => {
// get the user
// get users pref currency from req.user
// get this by using const user = User.readByUsername(req.user.username)
// get all source from DB *return an array of sources object
// if source.currency != user.currency use the third-party API
// const {data} = await axios.get(`https://api.exchangeratesapi.io/latest?base=${userObj.currency.code}`)
// convertedAmount = data.rates[source.currency.code] * source.amount
});

router.get('/owner', async (req,res) => {

});

router.get('/:sourceId', async (req,res) => {
    try {
        const source = await Source.readById(req.params.sourceId, req.user);
    
        await sourceSchemas.getSourceIdOutput.validateAsync(source);
    
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
    
        await sourceSchemas.patchSourceOutput.validateAsync(source);
    
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