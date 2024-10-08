const {Client} = require("@elastic/elasticsearch");
const config = require("config");

const elasticConfig = config.get('elastic');

const client = new Client({
    cloud:{
        id: elasticConfig.cloudID,
    },
    auth:{
        // username: elasticConfig.username,
        // password: elasticConfig.password
        apiKey:elasticConfig.apiKey 
    },
});

client.ping()
.then(response => console.log('You are connected to Elasticsearch.'))
.catch(error => console.log("Elasticsearch is not connected"))

module.exports=client;