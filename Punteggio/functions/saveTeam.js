const https = require('https');
const faunadb = require('faunadb');
const q = faunadb.query;

function testConnection() {
  return new Promise((resolve, reject) => {
    https.get('https://db.fauna.com', (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve(true));
    }).on('error', (err) => reject(err));
  });
}

exports.handler = async (event, context) => {
  console.log('Starting saveTeam function');
  console.log('FAUNADB_SECRET is set:', !!process.env.FAUNADB_SECRET);

  try {
    // Test di connessione
    await testConnection();
    console.log('Connection to FaunaDB successful');

    const client = new faunadb.Client({ 
      secret: process.env.FAUNADB_SECRET,
      observer: (res) => {
        console.log('Raw FaunaDB response:', res.responseRaw);
      }
    });

    // Query FaunaDB
    const result = await client.query(q.Get(q.Ref(q.Collection('teams'), '123456789')));
    console.log('Query result:', JSON.stringify(result, null, 2));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Connection to FaunaDB successful', result })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Operation failed', 
        details: error.message,
        stack: error.stack
      })
    };
  }
};
