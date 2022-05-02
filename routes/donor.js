const express = require('express')
const router = express.Router()
const DonorController = require('../controllers/DonorController')

// router.get('/viewdonor',DonorController.viewDonor)
// router.post('/show',DonorController.show)
// router.post('/store',DonorController.store)
// router.post('/update',DonorController.update)
// router.post('/delete',DonorController.destroy)
// console.log('hi')
router.post('/createDonationEntry',DonorController.saveDonationDetails)
router.get('/getDonationDetails/:bbid',DonorController.getDonationDetails)
router.post('/createDonorRegEntry',DonorController.saveDonorRegDetails)
router.get('/getDonorDetails/:donorid',DonorController.getDonorDetails)

//router.get('/getDonationDetails/:bbid',query.getDonationDetails(req,res,bbid))
module.exports = router