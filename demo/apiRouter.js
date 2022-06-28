const express = require('express');
const router = express.Router()

router.get('/',(req, res, next) => {
    res.json('router')

});


router.get('/:id',(req, res,next) => {
    res.json('router id is'+ req.params.id )
    next()
})
router.get('/test',(req, res,next) => {
    res.json('advbv  id is'+ req.path )
    next()
})
module.exports = router