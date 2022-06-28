const express = require('express');
const https = require('https');
// const {router} = require("express/lib/application");
const app = new express;
const router = require('./apiRouter.js');
const path = require('path');

app.get('/api', (req, res, next) => {
    console.log('1')
    next();
}, (req, res, next) => {
    console.log('2')
    next()
}, (req, res, next) => {
    console.log('3')
    next()
});

// app.use((req, res, next) => {
//     console.log('4');
// });

app.use('/api', router);
app.use((req, res, next) => {
    console.log('4');
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.listen(3000, () => {
    console.log('listening on port 3000')
})


