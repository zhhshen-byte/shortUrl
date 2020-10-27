import express from 'express';
import bodyParser from 'body-parser';
import query from '../models/query';
import dayjs from 'dayjs'

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

function string10to62(number: number) {
  let chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'.split('')
  let radix = chars.length
  let qutient = +number
  let arr = []
  do {
    let mod = qutient % radix;
    qutient = (qutient - mod) / radix;
    arr.unshift(chars[mod]);
  } while (qutient);
  return arr.join('');
}
 
function string62to10(numberCode: string | number) {
  let chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'
  let radix = chars.length
  numberCode = String(numberCode)
  let len = numberCode.length
  let i = 0
  let originNumber = 0
  while (i < len) {
    originNumber += Math.pow(radix, i++) * chars.indexOf(numberCode.charAt(len - i))
  }
  return originNumber
}

function randomWord(randomFlag: boolean, min: number, max: number, ruledOutStr: Array<any>) {
  let str = ''
  let range = min
  let pos = 0
  let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  if(ruledOutStr){
    ruledOutStr.forEach(item =>{
      arr = arr.join('').split(item).join('').split('')
    })
  }
  // 随机产生
  if(randomFlag){
    range = Math.round(Math.random() * (max - min)) + min
  }
  for(let i=0; i < range; i++){
    pos = Math.round(Math.random() * (arr.length-1))
    str += arr[pos]
  }
  return str
}

function EncodeStr(number: number) {
  let randomInsertStr = 'a';
  let chars = '0123456789bcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'.split('')
  let radix = chars.length
  let qutient = +number
  let arr = []
  do {
    let mod = qutient % radix;
    qutient = (qutient - mod) / radix;
    arr.unshift(chars[mod]);
  } while (qutient);
  let codeStr =  arr.join('')
  codeStr = codeStr.length < 6 ?  (codeStr + randomInsertStr + randomWord(false, 5 - codeStr.length, 0, [randomInsertStr])) : codeStr
  return codeStr;
}


let queryAllSQL = `SELECT * FROM links`

router.get('/getLinks', async (req, res) => {
    let { keyword } = req.query
    if (keyword) {
      queryAllSQL += `WHERR links.keyword=${keyword}`;
    }
    let sql = `${queryAllSQL} ORDER BY links.id DESC`;
    try {
        let result = await query(sql);
        result.forEach((i: any) => {
            i.key = i.id,
            i['update_at'] = dayjs(i['update_at']).format('YYYY-MM-DD HH:mm:ss')
        })
        res.json({
            flag: 0,
            data: result
        })
    } catch (e) {
        res.json({
            flag: 1,
            msg: e.toString()
        })
    }
});



router.post('/create', urlencodedParser, async (req, res) => {
    let host = req.headers.host 
    console.log('body', req.body)
    let { url, type = 'system',  } = req.body;
    if (url) {
      let insertTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      let sql = `INSERT INTO links (url, type, insert_at, update_at)
      VALUES ('${url}', '${type}', '${insertTime}', '${insertTime}')`;
      try {
        let { insertId: id } = await query(sql);
        let keyword = EncodeStr(id)
        console.log('keyWord', keyword)
        let updateSql = `UPDATE links
        SET
            keyword='${keyword}'
        WHERE
            id=${id}`;
          try {
              await query(updateSql);
              res.json({
                  flag: 0,
                  data: req.protocol + '://' + host + '/' + keyword
              })
          } catch (e) {
              res.json({
                  flag: 1,
                  msg: e.toString()
              })
          }
      } catch (e) {
          res.json({
              flag: 1,
              msg: e.toString()
          })
      }
    } else {
      res.json({
        flag: 1,
        msg: 'url 不能为空'
      })
    }
});

router.post('/delete', async (req, res) => {
    let { id } = req.body;
    let sql = `DELETE FROM links WHERE id=${id}`;
    try {
        let result = await query(sql);
        res.json({
          flag: 0
        })
    } catch (e) {
        res.json({
            flag: 1,
            msg: e.toString()
        })
    }
});

// router.post('/updateEmployee', async (req, res) => {
//     let { id, name, departmentId, hiredate, levelId } = req.body;
//     let sql = `UPDATE employee
//         SET
//             name='${name}',
//             departmentId=${departmentId},
//             hiredate='${hiredate}',
//             levelId=${levelId}
//         WHERE
//             id=${id}`;
//     try {
//         let result = await query(sql);
//         res.json({
//             flag: 0
//         })
//     } catch (e) {
//         res.json({
//             flag: 1,
//             msg: e.toString()
//         })
//     }
// });

export default router;
