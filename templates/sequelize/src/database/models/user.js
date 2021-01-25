import sequelizePaginate from 'sequelize-paginate';
import bcrypt from 'bcryptjs';

import { sign } from 'jsonwebtoken';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    // {
    //   defaultScope: {
    //     attributes: {
    //       exclude: ['password'],
    //     },
    //   },
    // },
    {
      hooks: {
        // eslint-disable-next-line no-unused-vars
        async beforeCreate(user, options) {
          const salt = await bcrypt.genSalt(12);
          staff.password = await bcrypt.hash(staff.password, salt);
        },
      },
    },
    {}
  );

  User.prototype.generateAuthToken = function() {
    return sign(
      {
        sub: this.user_id,
        firstname: this.firstname,
        lastname: this.lastname,
        username: this.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2 days',
      }
    );
  };

  User.associate = ({}) => {
    // associations can be defined here
  };

  sequelizePaginate.paginate(User);
  return User;
};
