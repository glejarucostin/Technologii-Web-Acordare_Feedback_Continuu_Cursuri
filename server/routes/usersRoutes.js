const express = require('express');
const app = express();
const sequelize = require('../database/sequelize');
const bcrypt = require('bcrypt');

// Import created models
const User = require('../models/User');
const UserType = require('../models/UserType');
const Activity = require('../models/Activity');

// GET all the users from the database.
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});
// GET all the usertypes from the database.
app.get('/usertypes', async (req, res, next) => {
  try {
    const users = await UserType.findAll();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});
// POST a new user to the database.
app.post('/users', async (req, res, next) => {
  try {
    if ( req.body.lastName && req.body.firstName && req.body.userName && req.body.password && req.body.usertypeId ) {
      const usertype = await UserType.findByPk(req.body.usertypeId);
      if (usertype) {
        const hashedPassword = await bcrypt.hash(
          req.body.password,
          Number.parseInt(process.env.NUMBER_OF_SALTS)
        );
        const par = {
          id: req.body.id,
          lastName: req.body.lastName,
          firstName: req.body.firstName,
          userName: req.body.userName,
          password: hashedPassword,
        };
        const user = await User.create(par);
        usertype.addUser(user);
        await usertype.save();
        res.status(201).json({ message: 'User Created!' });
      } else {
        res.status(400).json({ message: 'User Type not defined!' });
      }
    } else {
      res.status(400).json({ message: 'Malformed request!' });
    }
  } catch (err) {
    next(err);
  }
});
// POST a new usertype to the database.
app.post('/usertypes', async (req, res, next) => {
  try {
    if (req.body.id && req.body.description) {
      await UserType.create(req.body);
      res.status(201).json({ message: 'UserType Created!' });
    } else {
      res.status(400).json({ message: 'Malformed request!' });
    }
  } catch (err) {
    next(err);
  }
});
// GET an user by id.
app.get('/users/:userId', async (request, response, next) => {
  try {
      const user = await User.findByPk(request.params.userId);
      if (user) {
          response.json(user);
      } else {
          response.status(404).json({ message: 'User Not Found!' })
      }
  } catch (error) {
      next(error);
  }
});
// DELETE an user by id.
app.delete('/users/:userId', async (request, response, next) => {
  try {
      const user = await User.findByPk(request.params.userId);
      if (user) {
          await user.destroy();
          response.status(204).json({ message: 'User Deleted!' })
      } else {
          response.status(404).json({ message: 'User Not Found!' })
      }
  } catch (error) {
      next(error);
  }
});
// DELETE an usertype by id.
app.delete('/usertypes/:usertypeId', async (request, response, next) => {
  try {
      const usertype = await User.findByPk(request.params.usertypeId);
      if (usertype) {
          await usertype.destroy();
          response.status(204).json({ message: 'Usertype Deleted!' })
      } else {
          response.status(404).json({ message: 'User Not Found!' })
      }
  } catch (error) {
      next(error);
  }
});
// UPDATE an user by id.
app.put('/users/:userId', async (req, response, next) => {
  try {
      const user = await User.findByPk(req.params.userId);
      if (user) {
        if ( req.body.lastName && req.body.firstName && req.body.userName && req.body.password && req.body.usertypeId ) {
          const usertype = await UserType.findByPk(req.body.usertypeId);
          if (usertype) {
            const hashedPassword = await bcrypt.hash(
              req.body.password,
              Number.parseInt(process.env.NUMBER_OF_SALTS)
            );
            const par = {
              id: req.body.id,
              lastName: req.body.lastName,
              firstName: req.body.firstName,
              userName: req.body.userName,
              password: hashedPassword,
            };
           await user.update(par);
            response.status(201).json({ message: 'User Updated!' })
          }
        }
      } else {
          response.status(404).json({ message: 'User Not Found!' })
      }
  } catch (error) {
      next(error);
}});
// UPDATE an usertype by id.
app.put('/usertypes/:usertypeId', async (request, response, next) => {
  try {
      const usertype = await User.findByPk(request.params.usertypeId);
      if (usertype) {
        if (req.body.id && req.body.description) {
          const usertype = await UserType.findByPk(req.body.usertypeId);
          if (usertype) {
           await usertype.update(request.body);
            response.status(201).json({ message: 'Usertype Updated!' })
          }
        }
      } else {
          response.status(404).json({ message: 'Usertype Not Found!' })
      }
  } catch (error) {
      next(error);
}});

// GET an usertype by id.
app.get('/usertypes/:usertypeId', async (request, response, next) => {
  try {
      const usertype = await UserType.findByPk(request.params.usertypeId);
      if (usertype) {
          response.json(usertype);
      } else {
          response.status(404).json({ message: 'Usertype Not Found!' })
      }
  } catch (error) {
      next(error);
  }
});
// POST a new user into an activity -> enroll.
app.post('/users/:userId/activities/:activityId/enroll',async (request, response, next) => {
    try {
      const user = await User.findByPk(request.params.userId);
      const activity = await Activity.findByPk(request.params.activityId);
      if (user && activity) {
        if(user.usertypeId == 1){
          activity.addUser(user);
          await activity.save();
          response.status(201).json({ message: 'Enrollement is done!' });
        } else response.status(400).json({ message: 'Only a student can be enrolled!' });
      } else {
        response.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = app;
