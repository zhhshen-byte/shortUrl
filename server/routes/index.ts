import express from 'express'
const router = express.Router()
import query from '../models/query'
/* GET home page. */
router.get('/:id', async function(req, res, next) {
  let id = req.params.id
  let sql = `SELECT url FROM links WHERE links.keyword = '${id}'`
  try {
    let result = await query(sql)
    console.log('result', result[0].url)
    res.redirect(301, result[0].url)
  } catch (e) {
    res.send(e.toString())
  }
});

export default router;
