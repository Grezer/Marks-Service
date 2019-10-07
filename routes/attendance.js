const router = require('express').Router()
const moment = require('moment')
const {
  getNowPair,
  findPoint,
  createPoint,
  getClassmates,
  addMarks
} = require('../config/attendanceFunctions')
const pool_mdb = require('../config/config_mdb')
const pool = require('../config/config_universityPROF')
const sql = require('mssql')

const getOrCreatePoint = async (group, pair, day) => {
  const [getPairResult] = await getNowPair({
    group,
    pair,
    day
  });

  if (!getPairResult) return "No pairs right now";

  id_subject = getPairResult.id_subject;
  type_subject = getPairResult.type_subject;
  const findPointResult = await findPoint({
    group,
    id_subject,
    type_subject
  });

  if (!findPointResult) {
    const createPointResult = await createPoint({
      group,
      id_subject,
      type_subject
    })
    id_lesson = createPointResult.insertId
    const classmates = await getClassmates({
      group,
      id_lesson
    })
    return classmates;
  } else {
    id_lesson = findPointResult.id
    const classmates = await getClassmates({
      group,
      id_lesson
    })
    return classmates;
  }
}

const postMarks = async (oneCcode, id_attendance, mark) => {
  await addMarks({
    oneCcode,
    id_attendance,
    mark
  });
  return true;
}

router.route('/getClassMates/:group').get((req, res, next) => {
  /*
  let numberPair = -1
  if (moment().isBetween(moment('8:50', 'h:mm'), moment('10:00', 'h:mm'))) numberPair = 1
  if (moment().isBetween(moment('10:30', 'h:mm'), moment('11:40', 'h:mm'))) numberPair = 2
  if (moment().isBetween(moment('12:40', 'h:mm'), moment('13:50', 'h:mm'))) numberPair = 3
  if (moment().isBetween(moment('14:20', 'h:mm'), moment('15:30', 'h:mm'))) numberPair = 4
  if (moment().isBetween(moment('16:00', 'h:mm'), moment('17:10', 'h:mm'))) numberPair = 5
  if (moment().isBetween(moment('17:40', 'h:mm'), moment('18:50', 'h:mm'))) numberPair = 6
  if (moment().isBetween(moment('19:20', 'h:mm'), moment('20:30', 'h:mm'))) numberPair = 7
  */

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

  numberOfPair = -1;
  const isPair = (pair) => moment().isBetween(moment(obj[pair].start, "h:mm"), moment(obj[pair].finish, "h:mm"))
  for (const key in obj) {
    const pair = isPair(key)
    if (pair) {
      obj[key].isActive = true
      numberOfPair = key
    }
  }
  /*
  if (numberOfPair === -1) {
    res.send({
      response: 'No pair right now'
    });
  }
  */

  numberOfPair = 1;
  const nowDay = 1; //moment().weekday() % 2 ? moment().weekday() + 7 : moment().weekday();


  startInitAttendance = getOrCreatePoint(req.params.group, numberOfPair, nowDay).then(result => {
    res.send(result);
  }).catch(err => {
    res.send(err);
  })







  /*
    nowDay = 1
    numberPair = 1
    const group = req.params.group
    //let nowPair
    async someeeee => {
      try {
        const r = await getNowPair({
          group,
          numberPair,
          nowDay
        })
        console.log('r: ', r);
      } catch (err) {

      }
    }
    someeeee;

    */



  /*
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
          try {
            nowRole = findPoint(result.recordset);
            console.log('nowRole: ', nowRole);
          } catch (e) {
            reject(new Error('findPoint'))
          }

        } else {
          //try-catch
          res.send({
            Error: 'No classes right now'
          })
        }
        pool.close()
      }
    )
  })
  */





  /*

    const findPoint = async nowPair => {
      
        if (err) throw err
        pool_mdb.query(
          `
        Select *
        From attendance
        Where n_group = ? and id_subject = ? and type_subject = ? and date_lesson = ?
        `,
          [
            req.params.group,
            nowPair[0].id_subject,
            nowPair[0].type_subject,
            moment().format('YYYY-MM-DD')
          ],
          (error, result) => {
            if (error) throw error
            //res.sendStatus(200)
            if (!result[0]) {
              //create point
            } else {
              //Вернуть список одногруппников + id
            }
            return result[0]
            //res.send(result[0])
          }
        )
    }
  */


  /*
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
    } */
})

router.post('/add', (req, res, next) => {
  const id_lesson = req.body.id_lesson
  //oneCcode, id_attendance, mark
  req.body.peoples.forEach(element => {
    asd = postMarks(element.oneCcode, id_lesson, element.mark)
      .then(result => {

      }).catch(err => {
        res.send(err);
      })
  });
  res.sendStatus(200);



  /*
    asd = postMarks(req).then(result => {
      res.send(result);
    }).catch(err => {
      res.send(err);
    })
    */

  /*
  pool_mdb.getConnection((err, con) => {
    if (err) throw EvalError
    const id_attendance = req.body.id_point;
    console.log('id_attendance: ', id_attendance);

    req.body.peoples.forEach(element => {
      con.query(
        `  
          INSERT INTO attendance_marks (oneCcode, id_attendance, mark) 
          VALUES (?,?,?)   
        `,
        [element.oneCcode, id_attendance, element.mark],
        (error, result) => {
          if (error) throw error
          res.sendStatus(200);
        }
      )
    })
    con.release()
  })
*/

})

module.exports = router