//здесь api связанные с просмотром оценок
const router = require('express').Router();
const sql = require('mysql');
const pool_mdb = require('../config/config_mdb');
const {
  loggerPriem
} = require('../lib/logger');