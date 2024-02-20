const express = require('express');
const router = express.Router();

router.get('/adas', (req, res) => {
    res.render('admin/admin-dashboard');
})
router.get('/alog', (req, res) => {
    res.render('admin/admin-login');
})
// router.get('/adoc', (req, res) => {
//     res.render('admin/admin-doctors');
// })
// router.get('/asta', (req, res) => {
//     res.render('admin/admin-staffs');
// })
router.get('/abed', (req, res) => {
    res.render('admin/admin-bedmanagement');
})
// router.get('/apas', (req, res) => {
//     res.render('admin/admin-Patients');
// });
module.exports = router;