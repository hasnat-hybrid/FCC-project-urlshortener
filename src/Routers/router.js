const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const model = require('../db/model')
const {valid, valid2} = require('../methods/method')
const dns = require('dns');


router.post('/api/shorturl', async (req, res) => {

    try {

        if (!valid(req.body.url)) {
            return res.json({
                error: 'Invalid URL'
            })
        }

        //DNS starts here
        

        // var dnsLookup = new Promise((resolve, reject) => {
        //     dns.lookup('google.com', function(err, addresses, family) {
        //         if (err) reject(err);
        //         resolve(addresses);
        //     });
        // });
        
        // dnsLookup.catch((error) => {
        //     return res.json({
        //         error: 'No Host'
        //     })
        // })        

        //DNS ends here
    
        let count = await mongoose.connection.db.collection('datas').countDocuments()

        //console.log(count);
        
        if (count == 0) {
            count = 1;
        }
        else {
            count++;
        }

        //console.log(count);

        const newRequest = new model({
            assigned: count,
            url: req.body.url
        });
    
        await newRequest.save();
    
        res.json({
            original_url : req.body.url,
            short_url : count
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            errorType: 'Internal Error',
            errorMsg: error
        })
    }

})

router.get('/api/shorturl/:assigned', async (req, res) => {
    
    if (!valid2(req.params.assigned)) {
        return res.json({
            error: "Wrong format"
        })
    }

    const assigned = parseInt(req.params.assigned)
    const data = await model.findOne({assigned: assigned})
    
    if (!data) {
        return res.json({
            error: 'No short URL found for the given input'
        })
    }
    
    res.status(301).redirect(data.url)
})

module.exports = router