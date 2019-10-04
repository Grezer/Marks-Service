const router = require('express').Router()
const moment = require('moment')
const pool_mdb = require('../config/config_mdb')
const pool = require('../config/config_universityPROF')
const sql = require('mssql')

router.route('/getClassMates/:group').get((req, res, next) => {
  let nowDay = moment().weekday()
  if (moment().week() % 2) nowDay += 7

  let numberPair = -1
  if (moment().isBetween(moment('8:50', 'h:mm'), moment('10:00', 'h:mm'))) numberPair = 1
  if (moment().isBetween(moment('10:30', 'h:mm'), moment('11:40', 'h:mm'))) numberPair = 2
  if (moment().isBetween(moment('12:40', 'h:mm'), moment('13:50', 'h:mm'))) numberPair = 3
  if (moment().isBetween(moment('14:20', 'h:mm'), moment('15:30', 'h:mm'))) numberPair = 4
  if (moment().isBetween(moment('16:00', 'h:mm'), moment('17:10', 'h:mm'))) numberPair = 5
  if (moment().isBetween(moment('17:40', 'h:mm'), moment('18:50', 'h:mm'))) numberPair = 6
  if (moment().isBetween(moment('19:20', 'h:mm'), moment('20:30', 'h:mm'))) numberPair = 7

  /*
  if (pair === -1) {
    res.send({
      response: 'No pair right now'
    });
  }
  */

  /*
  const obj = {
    1: {
      isActive: false,
      start: '8:50',
      finish: '10:00'
    },
    2: {
      isActive: false,
      start: '10:30',
      finish: '11:40'
    },
    3: {
      isActive: false,
      start: '12:40',
      finish: '13:50'
    },
    4: {
      isActive: false,
      start: '14:20',
      finish: '15:30'
    },
    5: {
      isActive: false,
      start: '16:00',
      finish: '17:10'
    },
    6: {
      isActive: false,
      start: '17:40',
      finish: '18:50'
    },
    7: {
      isActive: false,
      start: '19:20',
      finish: '20:30'
    },
  }
  const isPair = (pair) => moment().isBetween(moment(obj[pair.start], "h:mm"), moment(obj[pair.finish], "h:mm"))
  for (const key in obj) {
    const pair = isPair(key)
    console.log(pair)
    if (pair) obj[key].isActive = true1
  }
  console.log(obj)
  */

  nowDay = 1
  numberPair = 1
  //let nowPair


  pool.connect(err => {
    if (err) res.sendStatus(400)
    const request = new sql.Request(pool)
    request.input('group', sql.NVarChar, `${req.params.group}`)
    request.input('pair', sql.NVarChar, `${numberPair}`)
    request.input('nowDay', sql.NVarChar, `${nowDay}`)
    request.query(
      `  
          Select _Subject_ID as id_subject, _Subject_Type as type_subject
          From [UniASR].[dbo].аср_Расписание
          where Day_Number = @nowDay and Lesson_ID = @pair and _Group = @group and Schedule_Number = 5
        `,
      (err, result) => {
        if (err) {
          res.sendStatus(400)
        }
        if (result.recordset.length) {
          findPoint(result.recordset);
        } else {
          res.send({
            "Error": "No classes right now"
          });
        }
        pool.close()
      }
    )
  });

  function findPoint(nowPair) {
    pool_mdb.getConnection((err, con) => {
      if (err) throw err
      con.query(
        `
      Select *
      From attendance
      Where n_group = ? and id_subject = ? and type_subject = ? and date_lesson = ?
      `,
        [req.params.group, nowPair[0].id_subject, nowPair[0].type_subject, moment().format('YYYY-MM-DD')],
        (error, result) => {
          if (error) throw error
          //res.sendStatus(200)   
          if (!result[0]) {
            //create point
          } else {
            //result[0].id
            //Вернуть список одногруппников + id 
          }
          res.send(result[0])
        }
      )
      con.release()
    })
  }

  function getClassmates(id) {
    if (err) res.sendStatus(400)
    const request = new sql.Request(pool)
    request.input('group', sql.NVarChar, `${req.params.group}`)
    request.input('id', sql.NVarChar, `${id}`)
    request.query(
      `  
        Select Ссылка, Код, Полное_Имя, Группа
        From [UniversityPROF].[dbo].[су_ИнформацияОСтудентах]
        Where Группа = @group and Статус != 'ЗКЗакрыта' and Статус = 'Является студентом'
        `,
      (err, result) => {
        if (err) {
          res.sendStatus(400)
        }
        if (result.recordset.length) {

        }
        pool.close()
      }
    )
  }
});



router.post('/add', (req, res, next) => {
  pool_mdb.getConnection((err, con) => {
    if (err) throw EvalError
    req.body.peoples.forEach(element => {
      con.query(
        `  
          INSERT INTO attendance_marks (oneCcode, id_attendance, mark) 
          VALUES (?,?,?)   
        `,
        [
          element.oneCcode,
          element.id_attendance,
          element.mark
        ],
        (error, result) => {
          if (error) throw error
        }
      )
    });
    con.release()
  })
})


module.exports = router