
exports.searchData = function (req, res) {
    const input = req.query;
    let criteria = {};
    let sortBy;
    let sortType;
    let skip = input.skip ? parseInt(input.skip) : 0 ;
    let limit = input.limit ? parseInt(input.limit) : 50;
    if (input.schemaName) {
        criteria['SchemaName'] = input.schemaName
    }
    if (input.sortType == 2) {
        sortType = 'NetAssetValuee'
    } else {
        sortType = 'Date'
    }


    if (input.sortBy == 1) {
        sortBy = 1
    } else {
        sortBy = -1
    }

    console.log('check her sort type and by', sortType, sortBy, criteria)

    db.collection('datacollection')
        .find(criteria).sort({ sortType: sortBy }).skip(skip).limit(limit).toArray(function (error, response) {
            if(error) {
                return res.send({status : 400, message : 'Some error occured while getting data'})
            }
            console.log('res phere ', response)
            let output = {
                status : 200,
                message : 'Successful',
                data : response || []
            }

            return res.send(output);
        })
}






