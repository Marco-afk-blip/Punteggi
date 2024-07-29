const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context) => {
  const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET })
  
  try {
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('teams'))),
        q.Lambda(x => q.Get(x))
      )
    )
    
    return {
      statusCode: 200,
      body: JSON.stringify(result.data.map(item => item.data))
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) }
  }
}