const express = require('express');
const app = express();
const sequelize = require('../database/sequelize');

// Import created models
const User = require('../models/User');
const UserType = require('../models/UserType');
const Activity = require('../models/Activity');
const Feedback = require('../models/Feedback');

// Define entities relationship
UserType.hasMany(User);
User.hasMany(Feedback);
User.hasMany(Activity, {foreignKey: 'creator'});
Activity.belongsToMany(User,{ through: 'enrollements'});// many to many
User.belongsToMany(Activity, {through: 'enrollements'});
Activity.belongsToMany(Feedback,{ through: 'links'});
Feedback.belongsToMany(Activity,{ through: 'links'});

// Create a special GET endpoint so that when it is called it will sync our database with the models.
 app.get('/create', async (req, res, next) => {
    try {
      await sequelize.sync({ force: true });
      res.status(201).json({ message: 'Database created with the models.' });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
  
app.get('/update', async (req, res, next) => {
    try {
      await sequelize.sync({ alter: true });
      res.status(201).json({ message: 'Database updated with the models.' });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
module.exports = app;  