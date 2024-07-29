const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context) => {
  const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET })
  const { name } = JSON.parse(event.body)
  
  try {
    await client.query(
      q.Delete(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('teams_by_name'), name))
        )
      )
    )
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Team deleted successfully' })
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) }
  }
}
