const express = require('express');
const client = require('./elasticsearch/client');

const {Client} = require('@elastic/elasticsearch');
const cors = require('cors');

const app = express();

const port = 3001;

const data = require('./data_management/retrieve_and_ingest_data');

app.use('/ingest_data', data);

app.use(cors());

app.get('/results', (req,res) => {
    const passedType = req.query.type;
    const passedMag = req.query.mag;
  const passedLocation = req.query.location;
  const passedDateRange = req.query.dateRange;
  const passedSortOption = req.query.sortOption;

  async function sendESRequest() {
    const body = await client.search({
        index: 'earthquakes',
        body:{
            sort:[
                {mag:{
                    order: passedSortOption,
                },
            },
            ],
            size: 300,
            query:{
                bool:{
                    filter:[
                        {term:{type:passedType},},
                        {range:{mag:{gte:passedMag,},},},
                        {match:{place:passedLocation},},
                        {range:{'@timestamp':{
                            gte: `now-${passedDateRange}d/d`,
                            lt:'now/d',
                        },},},
                    ],
                },
            },
        },
    });
    res.json(body.hits.hits);
    
  }
  sendESRequest();
});


app.listen(port, ()=>{
    console.log("server listening to port 3001");
});








// a6f2c5d3-e185-43e0-b182-76617e9532a3
// 5a02cabf-b23e-4dcd-a442-55deb4c559a2