var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.download(`${__dirname}/../public/template.xlsx`)
});

module.exports = router;