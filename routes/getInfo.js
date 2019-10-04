const router = require('express').Router()
const sql = require('mssql')
const pool_mdb = require('../config/config_mdb')
const pool_asr = require('../config/config_asr')
const {
  logger
} = require('../lib/logger')

//just for start drone
//Получение предметов и групп по fio препода
/*
router.route('/getLessons/:fio').get((req, res, next) => {
  pool_asr.connect(err => {
    if (err) res.sendStatus(400)
    console.log(req.params.fio)
    const request = new sql.Request(pool_asr)
    request.input('fio', sql.NVarChar, `%${req.params.fio}%`)
    request.query(
      `  
      Select Lecturer, _Subject, _Group, _Subject_Type
      From [UniASR].[dbo].[аср_Расписание]
      Where Period_ID = 0x818156C626D51EA7011E8FC4EE009EED7 and _Subject_Type != 'Лабораторные работы' and Lecturer like @fio
      Group by _Group, _Subject_Type, Lecturer, _Subject
      Order by Lecturer
    `,
      (err, result) => {
        if (err) {
          logger.log('error', 'Get group schedule error', {
            err
          })
          res.sendStatus(400)
        }

        logger.log('info', 'Get group schedule success', {
          result: req.params.fio
        })

        pool_asr.close()
        res.send(result.recordset)
      }
    )
  })
})
*/

// Получение списка одногруппников
router.route('/getClassMates/:group').get((req, res, next) => {
  pool_asr.connect(err => {
    if (err) res.sendStatus(400)
    const request = new sql.Request(pool_asr)
    request.input('group', sql.NVarChar, `${req.params.group}`)
    request.query(
      `  
      Select Код, Полное_Имя, Группа
      From [UniversityPROF].[dbo].[су_ИнформацияОСтудентах]
      Where Группа = @group and Статус != 'ЗКЗакрыта' and Статус = 'Является студентом'
    `,
      (err, result) => {
        if (err) {
          logger.log('error', 'Get group schedule error', {
            err
          })
          res.sendStatus(400)
        }

        logger.log('info', 'Get group schedule success', {
          result: req.params.fio
        })

        pool_asr.close()
        res.send(result.recordset)
      }
    )
  })
})

router.route('/getLesson/:group').get((req, res, next) => {
  console.log(req.params.group)
  pool_asr.connect(err => {
    if (err) res.sendStatus(400)
    console.log(req.params.group)
    const request = new sql.Request(pool_asr)
    request.input('group', sql.NVarChar, `${req.params.group}`)
    request.query(
      `  
      Select distinct _Subject, _Subject_Type
      FROM [UniASR].[dbo].[аср_Расписание]
      Where _Group = @group
    `,
      (err, result) => {
        if (err) {
          logger.log('error', 'Get group schedule error', {
            err
          })
          res.sendStatus(400)
        }

        logger.log('info', 'Get group schedule success', {
          result: req.params.fio
        })

        pool_asr.close()
        res.send(result.recordset)
      }
    )
  })
})

//Получение контрольных точек
router.get('/getControlPoints/:lesson/:group/:type', (req, res, next) => {
  pool_mdb.getConnection((err, con) => {
    if (err) throw err

    const lesson = req.params.lesson
    const group = req.params.group
    const type = req.params.type
    console.log(req.params.lesson)
    console.log(req.params.group)
    console.log(req.params.type)

    con.query(
      `  
        Select * From control_points 
        Where n_group= ? and lesson = ? and type_lesson = ?
      `,
      [group, lesson, type],
      (error, result) => {
        if (error) throw error

        res.setHeader('Content-Type', 'application/json')
        console.log(result)
        res.send(result)
      }
    )
    con.release()
  })
})

router.get('/getLastControlPoint', (req, res, next) => {
  pool_mdb.getConnection((err, con) => {
    if (err) throw err
    con.query(
      `  
        Select MAX(id) From control_points
      `,
      (error, result) => {
        if (error) throw error

        res.setHeader('Content-Type', 'application/json')
        res.send(result)
      }
    )
    con.release()
  })
})

function today() {
  let currentTime = new Date()
  let dd = currentTime.getDate()
  let mm = currentTime.getMonth() + 1
  let yyyy = currentTime.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  return {
    now: yyyy + '-' + mm + '-' + dd
  }
}

module.exports = router