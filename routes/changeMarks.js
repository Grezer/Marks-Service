const router = require('express').Router();
const pool_mdb = require('../config/config_mdb');
const pool_prof = require('../config/config_universityPROF');
const pool_asr = require('../config/config_universityPROF');
const { loggerChangeMarks } = require('../lib/logger');

router.post('/addControlPoints', (req, res, next) => {
  pool_mdb.getConnection((err, con) => {
    if (err) throw err;
    const lesson_date = today().now;
    const lesson = req.body.lesson;
    const id_type_control_points = req.body.id_type_control_points;
    const id_type_marks = req.body.id_type_marks;
    const name = req.body.name;
    const oneCcode_teacher = req.body.oneCcode_teacher;
    const n_group = req.body.n_group;
    const type_lesson = req.body.type_lesson;
    const confirmation = req.body.confirmation;

    console.log(lesson_date);
    console.log(lesson);
    console.log(id_type_control_points);
    console.log(id_type_marks);
    console.log(name);
    console.log(oneCcode_teacher);
    console.log(n_group);
    console.log(type_lesson);
    console.log(confirmation);

    con.query(
      `  
        INSERT INTO control_points (lesson_date, lesson, id_type_control_points, id_type_marks, name, oneCcode_teacher, n_group, type_lesson, confirmation) 
        VALUES (?,?,?,?,?,?,?,?,?)   
      `,
      [
        lesson_date,
        lesson,
        id_type_control_points,
        id_type_marks,
        name,
        oneCcode_teacher,
        n_group,
        type_lesson,
        confirmation,
      ],
      (error, result) => {
        if (error) throw error;
        res.sendStatus(200);
      },
    );
    con.release();
  });
});

router.post('/addMark', (req, res, next) => {
  pool_mdb.getConnection((err, con) => {
    if (err) throw err;
    const lesson_date = today().now;
    const lesson = req.body.lesson;
    const id_type_control_points = req.body.id_type_control_points;
    const id_type_marks = req.body.id_type_marks;
    const name = req.body.name;
    const oneCcode_teacher = req.body.oneCcode_teacher;
    const n_group = req.body.n_group;
    const type_lesson = req.body.type_lesson;
    const confirmation = req.body.confirmation;

    console.log(lesson_date);
    console.log(lesson);
    console.log(id_type_control_points);
    console.log(id_type_marks);
    console.log(name);
    console.log(oneCcode_teacher);
    console.log(n_group);
    console.log(type_lesson);
    console.log(confirmation);

    con.query(
      `  
        INSERT INTO control_points (lesson_date, lesson, id_type_control_points, id_type_marks, name, oneCcode_teacher, n_group, type_lesson, confirmation) 
        VALUES (?,?,?,?,?,?,?,?,?)   
      `,
      [
        lesson_date,
        lesson,
        id_type_control_points,
        id_type_marks,
        name,
        oneCcode_teacher,
        n_group,
        type_lesson,
        confirmation,
      ],
      (error, result) => {
        if (error) throw error;
        res.sendStatus(200);
      },
    );
    con.release();
  });
});

function today() {
  let currentTime = new Date();
  let dd = currentTime.getDate();
  let mm = currentTime.getMonth() + 1;
  let yyyy = currentTime.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return {
    now: yyyy + '-' + mm + '-' + dd,
  };
}

module.exports = router;
