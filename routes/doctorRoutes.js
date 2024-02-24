const express = require('express');
const router = express.Router();

router.get('/dhom', (req, res) => {
    res.render('doctor/doctor-login');
})
router.get('/dapp', (req, res) => {
    res.render('doctor/doctor-Appointments');
})
// router.get('/dblo', (req, res) => {
//     res.render('doctor/doctor-Blog');
// })
// router.get('/ddas', (req, res) => {
//     res.render('doctor/doctor-dashboard');
// })
router.get('/dmar', (req, res) => {
    res.render('doctor/doctor-marketing');
})
router.get('/dnot', (req, res) => {
    res.render('doctor/doctor-notify');
})
// router.get('/dpat', (req, res) => {
//     res.render('doctor/doctor-Patients');
// })
router.get('/dsch', (req, res) => {
    res.render('doctor/doctor-Schedules');
})
router.get('/dreg', (req, res) => {
    res.render('doctor/doctor-register');
})
router.get('/dnot', (req, res) => {
    res.render('doctor/doctor-notify');
})
module.exports = router;