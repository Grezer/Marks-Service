const moment = require('moment')
const pool_mdb = require('../config/config_mdb')
const pool = require('../config/config_universityPROF')
const sql = require('mssql')

const getNowPair = async ({
  group,
  pair,
  day
}) => {
  try {
    const result = await pool.request()
      .input('group', sql.NVarChar, `${group}`)
      .input('pair', sql.NVarChar, `${pair}`)
      .input('nowDay', sql.NVarChar, `${day}`)
      .query(
        `  
          Select _Subject_ID as id_subject, _Subject_Type as type_subject
          From [UniASR].[dbo].аср_Расписание
          where Day_Number = @nowDay and Lesson_ID = @pair and _Group = @group and Schedule_Number = 5
        `
      )
    return result;
  } catch (err) {

  }

  /*

    pool.connect(err => {
      if (err) return "400"
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
}

module.exports = getNowPair