const  Donor = require('../models/donor.model')
var getdonor = require('../fabcar/javascript/query_donation')
let network = require('../fabcar/javascript/invoke_donation')

const path = require('path');
//const fs = require('fs');
let donorreg = require('../fabcar/javascript/invoke_donorregis')
var getdonorreg = require('../fabcar/javascript/query_donordetails')

//view all the donors
const viewDonor = (req,res) => {
    Donor.find()
    .then(response => {
        res.json({
            response
        })
        console.log(response)
    })
    .catch(error => {
        res.json({
            message: 'An error oocured!'
        })
    })
}

const show=(req,res,next) => {
    let donorid = req.body.donorid
    Donor.find({donorid:donorid})
    .then(response => {
        res.json({
            response
        })
        console.log(response)
    })
    .catch(error => {
        res.json({
            message: 'An eror occured!'
        })
    })
}

const store=(req,res,next) => {
    var donordetails = req.body
   let donor = new Donor({
    donorid: donordetails.donorid,
    donorname: donordetails.donorname,
    password: donordetails.password,
    email:  donordetails.email,
    mobile: donordetails.mobile,
    dob: new Date (donordetails.dob),
    gender: donordetails.gender
   })
    donor.save() //mongo db 
    .then(response => {
        console.log("added !!!!")
        res.json({
           message: 'donor added successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}

//update Donor Details
const update = (req,res,next) => {
    let id = req.body.id
    var donordetails = req.body
    let updatedData = {
        donorname: donordetails.donorname,
        password: donordetails.password,
        email:  donordetails.email,
        mobile: donordetails.mobile,
        gender: donordetails.gender
    }
    Donor.findByIdAndUpdate(id, {$set: updatedData})

    .then(response => {
        console.log("updated")
        res.json({
           message: 'donor details updated successfully!'
        })
    })
    .catch(error => {
        console.log(error)
        res.json({
            message: 'An error occured!'
        })
    })
}

const destroy = (req,res,next) => {
    let id = req.body.id
    console.log(id)
    Donor.findByIdAndDelete(id)
    .then(() => {
        console.log('Deleted')
        req.json({
            message: 'Employee delected successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}

function calculateAge(year, month, day) {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getUTCMonth() + 1;
    var currentDay = currentDate.getUTCDate();
    // You need to treat the cases where the year, month or day hasn't arrived yet.
    var age = currentYear - year;
    if (currentMonth > month) {
        return age;
    } else {
        if (currentDay >= day) {
            return age;
        } else {
            age--;
            return age;
        }
    }
}

exports.saveDonorRegDetails = async(req,res,next) => {
    console.log("inside controller")
    let donorid = req.body.donorid
  
    var donorstring =JSON.stringify(req.body.donordetails);
    
 //  var donorstring=JSON.stringify(donordetail);
   console.log("donor----",donorstring)
    const newdonor =({
        donorid: donorid,
        donorstring: donorstring,
   });
   console.log("newdonor",newdonor)
   donorreg.saveDonorRegDetails(newdonor);
   return res.status(200).json({
    status: 200,
    message: "success",
});
}

exports.saveDonationDetails = async(req,res,next) => {
    console.log("inside controller")
    const bbid = req.body.bbid;
    console.log("bbid",bbid);
    let todaynow=new Date().toLocaleTimeString();
    console.log("date:",todaynow);
    var transactionstring =JSON.stringify(req.body.donordetails);
    let donorid = req.body.donorid
   let unit = req.body.unit
   let cdate = req.body.collecteddate
   let expirydate=req.body.expirydate
   let bloodgroup=req.body.bloodgroup
   let collectedby=req.body.collectedby
  
    const newdonation =({
       bbid:bbid,
       donorid:donorid,
       transactionstring: transactionstring, 
       bloodgroup:bloodgroup, 
       unit:unit,
       cdate:cdate,
       expirydate:expirydate,  
       collectedby:collectedby,
   });
  console.log("newdonor",newdonation)
   network.saveDonationDetails(newdonation);
   return res.status(200).json({
    status: 200,
    message: "success",
});
}

exports.getDonationDetails = async(req,res,next) => {
    let bbid = req.params.bbid
    console.log(bbid)
    let result1 =await getdonor.getDonationDetails(bbid);
 return res.status(200).json({
    status: 200,
    message: "success",result1
});
}

exports.getDonorDetails = async(req,res,next) => {
    let donorid = req.params.donorid
    console.log(donorid)

    let result1 =await getdonorreg.getDonorDetails(donorid);
 return res.status(200).json({
    status: 200,
    message: "success",result1
});
}
