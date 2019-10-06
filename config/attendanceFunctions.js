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
    pool.connect(err => {
      if (err) res.sendStatus(400);
      console.log('group: ', group);
      console.log('pair: ', pair);
      console.log('day: ', day);
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
            console.log('err: ', err);
          }
          pool.close();
          console.log(result.recordset);
          return result.recordset;
        }
      );
    });
  } catch (err) {
    console.log('err: ', err);
  }
}

const findPoint = async ({
  group,
  id_subject,
  type_subject
}) => {
  const result = await pool_mdb.query(
    `
    Select *
    From attendance
    Where n_group = ? and id_subject = ? and type_subject = ? and date_lesson = ?
    `,
    [
      group,
      id_subject,
      type_subject,
      moment().format('YYYY-MM-DD')
    ]
  );
  return result[0][0];
}

module.exports = {
  getNowPair,
  findPoint
}