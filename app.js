const express = require('express');
// const ExpressError = require('./expressError');

const app = express();

app.use(express.json());

app.get('/mean', function(req, res){
    const nums = req.query.nums;
    checkForEmptyArr(nums, res);
    const nums_array = nums.split(',');
    checkArrForNaN(nums_array, res);
    const validEntries = nums_array.map(Number);
    let sum = 0;
    //validate that all entries are numbers
    console.log(validEntries);
    for (let i=0; i < validEntries.length; i++){
        sum += validEntries[i];
    }
    return res.json({
        operation: 'mean',
        value: sum / validEntries.length
    });
});

app.get('/median', function(req,res){
    const nums = req.query.nums;
    checkForEmptyArr(nums, res);
    const nums_array = nums.split(',');
    checkArrForNaN(nums_array, res);
    const validEntries = nums_array.map(Number);
    let medVal;
    validEntries.sort()
    if(validEntries.length % 2 == 0){
        let mid1 = validEntries.length / 2;
        let mid2 = mid1 - 1;
        medVal = (validEntries[mid1] + validEntries[mid2]) / 2;
    }else{
        let mid_idx = Math.ceil(validEntries.length / 2)-1
        medVal = validEntries[mid_idx];
    }
    return res.json({
        operation: 'median',
        value: medVal
    });
});

app.get('/mode', function(req,res){
    const nums = req.query.nums;
    checkForEmptyArr(nums, res);
    const nums_array = nums.split(',');
    checkArrForNaN(nums_array, res);
    const validEntries = nums_array.map(Number);
    let frequencyMap = {};
    let maxFrequency = 0;
    let modes = [];

    validEntries.forEach(num => {
        if (frequencyMap[num]){
            frequencyMap[num]++;
        }else{
            frequencyMap[num] = 1;
        }
    });

    for (num in frequencyMap){
        if(frequencyMap[num] > maxFrequency){
            maxFrequency = frequencyMap[num];
            modes = [Number(num)];
        }else if (frequencyMap[num] === maxFrequency){
            modes.push(Number(num));
        }
    }

    return res.json({
        operation: 'mode',
        value: modes
    });
});

//check if any values within the query string are NaN
function checkArrForNaN(arr, res){
    const invalidEntries = arr.filter(num => isNaN(num));
    if (invalidEntries.length > 0){
        return res.status(400).send(`Following entries are not valid numbers: ${invalidEntries.join(', ')}`);
    }
}
//check if the query string is empty
function checkForEmptyArr(nums, res){
    if (nums == undefined){
        return res.status(400).send('nums are required.');
    }
}

app.listen(3000 ,function(){
    console.log('App on port 3000');
})