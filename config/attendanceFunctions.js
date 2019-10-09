const moment = require('moment')
const pool_mdb = require('../config/config_mdb')
const pool = require('../config/config_universityPROF')
const sql = require('mssql')

const getNowPair = async ({
  group,
  pair,
  day
}) => {
  return new Promise(function (resolve, reject) {
    try {
      pool.connect(err => {
        if (err) {
          res.sendStatus(400)
          console.log(err);
        }
        const request = new sql.Request(pool)
        request.input('group', sql.NVarChar, `${group}`)
        request.input('pair', sql.NVarChar, `${pair}`)
        request.input('nowDay', sql.NVarChar, `${day}`)
        request.query(
          `  
          Select _Subject_ID as id_subject, _Subject_Type as type_subject
          From [UniASR].[dbo].аср_Расписание
          where Day_Number = @nowDay and Lesson_ID = @pair and _Group = @group and Schedule_Number = 5
  
        `,
          (err, result) => {
            if (err) {
              console.log('err: ', err)
            }
            pool.close()
            //console.log(result.recordset);
            resolve(result.recordset)
          }
        )
      })
    } catch (err) {
      reject(err)
      //console.log('err: ', err);
    }
  })
}

const findPoint = async ({
  group,
  id_subject,
  type_subject
}) => {
  try {
    const [
      [result]
    ] = await pool_mdb.query(
      `
      Select *
      From attendance
      Where n_group = ? and id_subject = ? and type_subject = ? and date_lesson = ?
      `,
      [group, id_subject, type_subject, moment().format('YYYY-MM-DD')]
    )

    console.log('result: ', result);

    return result
  } catch (err) {
    console.log(err);
    return err
  }
}

const createPoint = async ({
  group,
  id_subject,
  type_subject
}) => {
  console.log('group: ', group)
  console.log('id_subject: ', id_subject)
  console.log('type_subject: ', type_subject)
  try {
    const [result] = await pool_mdb.query(
      `
        INSERT into attendance (n_group, id_subject, type_subject, date_lesson) 
        VALUES(?, ?, ?, ?);
        `,
      [group, id_subject, type_subject, moment().format('YYYY-MM-DD')]
    )
    console.log('result: ', result)
    return result
  } catch (err) {
    return err
  }
}

const getClassmates = async ({
  group,
  id_lesson
}) => {
  return new Promise(function (resolve, reject) {
    try {
      pool.connect(err => {
        if (err) res.sendStatus(400)
        const request = new sql.Request(pool)
        request.input('group', sql.NVarChar, `${group}`)
        request.query(
          `  
            Select Код as oneCcode, Полное_Имя as Fio
            From [UniversityPROF].[dbo].[су_ИнформацияОСтудентах]
            Where Группа = @group and Статус != 'ЗКЗакрыта' and Статус = 'Является студентом'
            order by Полное_Имя
  
        `,
          (err, result) => {
            if (err) {
              console.log('err: ', err)
            }
            pool.close()
            //console.log(result.recordset);
            /*
            let finalResult = [];
            finalResult.push(id_point);
            let peoples = [];

            let getPeoples = result.recordset;
            for (i = 0; i < getPeoples.length; i++) {
              peoples.push(getPeoples[i].oneCcode),
                peoples.push(getPeoples[i].Fio)
            }
            finalResult.push(peoples);
                       */
            //just for update
            let peoples = result.recordset
            let mark = true
            for (let i = 0; i < peoples.length; i++) {
              let oneCcode = peoples[i].oneCcode
              let Fio = peoples[i].Fio

              peoples[i] = {
                oneCcode,
                Fio,
                mark
              }
            }
            let obj = {
              id_lesson: id_lesson == null ? 777 : id_lesson,
              peoples: peoples
            }
            resolve(obj)
          }
        )
      })
    } catch (err) {
      reject(err)
    }
  })
}

const addMarks = async ({
  oneCcode,
  id_attendance,
  mark
}) => {
  try {
    const result = await pool_mdb.query(
      `
        INSERT INTO attendance_marks (oneCcode, id_attendance, mark) 
        VALUES (?,?,?)
      `,
      [oneCcode, id_attendance, mark]
    )
    return result
  } catch (err) {
    return err
  }
}

module.exports = {
  getNowPair,
  findPoint,
  createPoint,
  getClassmates,
  addMarks
}