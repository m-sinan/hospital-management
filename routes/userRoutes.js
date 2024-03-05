const express = require('express');
const router = express.Router();

// router.get('/', (req, res) => {
//     res.render('user/index');
// })
router.get('/uabo', (req, res) => {
    res.render('user/about');
})
// router.get('/uapp', (req, res) => {
//     res.render('user/appointment');
// })
// router.get('/ublo', (req, res) => {
//     res.render('user/blog');
// })
router.get('/ucon', (req, res) => {
    res.render('user/contact');
})
// router.get('/udoc', (req, res) => {
//     res.render('user/doctors');
// })
router.get('/ufaq', (req, res) => {
    res.render('user/faq');
})
router.get('/upro', (req, res) => {
    res.render('user/portfolio-details');
})
module.exports = router;