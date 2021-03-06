const express = require('express');
const { check, validationResult } = require('express-validator');
const Customer = require('../models/customer_model')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/customer/insert',[
    check('firstName','Username is required').not().isEmpty(),
    check('lastName','Last Name is required').not().isEmpty(),
    check('password','Password is required').not().isEmpty(),
    check('email','Email is required').not().isEmpty()
], 
function(req,res) {
    const validationError = validationResult(req)
  //  res.send(validationError.array())

    // validation
    if(validationError.isEmpty()){ 
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const password = req.body.password
    const address = req.body.address
    const phone = req.body.phone
    const email = req.body.email

    bcryptjs.hash(password, 10, function(e, hash_password){
        const CustomerData = new Customer({
            firstName: firstName,
            lastName: lastName,
            password: hash_password,
            address: address,
            phone: phone,
            email: email
            })
            CustomerData.save()
            .then(function(result){
                res.status(201).json({message : "Item Added!!"})
            })
            .catch(function(e){
                res.status(500).json({message : e})
            })
    })
    
    }
    else{
        res.status(400).json(validationError.array())
    }
    });

router.get('/customer/login',function(req,res){
    const email = req.body.email
    const password = req.body.password

    Customer.findOne({email : email})
    .then(function(customerData){ //customerData fetches entire row related to the email
        if(customerData===null){
            //no customer found
           return res.status(403).json({error_message : "Invalid credentials!"})
        }
        // customer found
        bcryptjs.compare( password, customerData.password, function(_err, result){
            if(result == false){
                return res.status(403).json({error_message : "Invalid Password!"})
            }
            //email and password valid -> valid user
            //token generate
            const token = jwt.sign({customerId: customerData._id},'secret_key')
            res.status(200).json({
                token: token, 
                message: "Authorization successful"
            })
        })

    })
    .catch(function(e){
        res.status(500).json({error: e})
    })
})

//use put for update
router.put("/customer/update", function(req,res){
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const password = req.body.password
    const address = req.body.address
    const phone = req.body.phone
    const email = req.body.email
    const id = req.body.customerId

    products.updateOne({_id : customerId}, {firstName : firstName, lastName : lastName})
    .then(function(result){
        res.status(200).json({status: success})
    })
    .catch(function(e){
        res.status(200).json({error: e})
    })
})

module.exports = router