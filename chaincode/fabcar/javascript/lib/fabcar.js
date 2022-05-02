/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
       
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createCar(ctx, carNumber, make, model, color, owner) {
        console.info('============= START : Create Car ===========');

        const car = {
            color,
            docType: 'car',
            make,
            model,
            owner,
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
    }

    async createDonationDetails(ctx,bbid,donorid,transactionstring,bloodgroup,unit,cdate,edate,collectedby) {
        console.info('============= START : Create Donation Details ===========');
        let flag=true
        let todaynow=new Date().toLocaleTimeString();
       let transactionstring1 = JSON.parse(transactionstring.toString());
       let hg = parseFloat(transactionstring1.hg)
        let temp=parseFloat(transactionstring1.temp)
        let bps=parseInt(transactionstring1.bps)
        let bpd=parseInt(transactionstring1.bpd)
        let pulse=parseInt(transactionstring1.pulse)
        let hist_verified=transactionstring1.historyverified
        if(hg<12.5)
        {
        flag=false
        }
        if(temp>99)
        {
        flag=false
        }
        if(bps>160 || bpd>100)
        {
        flag=false
        }
        if(pulse>100 || pulse<60)
        {
        flag=false
        }
        if(hist_verified != 'yes')
        {
        flag=false
        }
        console.log("flag",flag);
        if(flag)
        {
            const donorcollection = {
                donorid:donorid,
                donordetails: transactionstring,
                bloodgroup: bloodgroup,
                unit:unit,
                collecteddate:cdate,
                expirydate:edate,
                collectedby:collectedby,
            };
        await ctx.stub.putState(bbid, Buffer.from(JSON.stringify(donorcollection)));
        console.info('============= END : Create Donation Details ===========');
        }
        else
        {
            throw new Error(`Cannot store the details`);
        }
    }

    async createDonorRegDetails(ctx, donorid,donorstring) {
             console.info('============= START : Create Donation Details ===========');

            let donorstring1 = JSON.parse(donorstring.toString());

             let flag=true
             if(flag)
             {
                const donordetail = {
                    donorstring:donorstring, 
                };
             await ctx.stub.putState(donorid, Buffer.from(JSON.stringify(donordetail)));
             console.info('============= END : Create Donor Details ===========');
             }
             else
             {
                 throw new Error(`Cannot store the details`);
             }
         }
    async queryDonationDetails(ctx, bbid) {
        const donationBytes = await ctx.stub.getState(bbid); // get the car from chaincode state
        if (!donationBytes || donationBytes.length === 0) {
            throw new Error(`${bbid} does not exist`);
        }
        console.log(donationBytes.toString());
        return donationBytes.toString();
    }

    async queryDonorRegDetails(ctx, donorid) {
        const donationBytes = await ctx.stub.getState(donorid); // get the donor from chaincode state
        if (!donationBytes || donationBytes.length === 0) {
            throw new Error(`${donorid} does not exist`);
        }
        console.log(donationBytes.toString());
        return donationBytes.toString();
    }

    async queryAllCars(ctx) {
        const startKey = 'CAR0';
        const endKey = 'CAR999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = FabCar;
