import { Sequelize } from 'sequelize';

const { User } = require('../../database/models');

const { Op } = Sequelize;

/**
 * Save user details to the DB
 *
 * @function
 * @returns {json} json object with user data
 * @param data
 */
export async function createUser(data) {
  const { firstname, lastname, email, password, address, phone, username } = data;
  return User.create({
    firstname,
    lastname,
    email,
    password,
    address,
    phone,
    username
  });
}

/**
 * query user details in the DB by phone or username
 *
 * @function
 * @returns {json} json object with user data
 * @param data
 */
export async function findUserByPhoneOrUsername(data) {
  return User.findOne({
    where: { [Op.or]: [{ phone: data.phone }, { username: data.username }] },
  });
}

/**
 * query user account in the DB by username
 *
 * @function
 * @returns {json} json object with user data
 * @param data
 */
export async function findUserByUsername(data) {
  return User.findOne({ where: { username: data.username } });
}

/**
 * query user account in the DB by phone
 *
 * @function
 * @returns {json} json object with user data
 * @param data
 */
export async function findUserByPhone(data) {
  return User.findOne({ where: { phone: data.phone } });
}

/**
 * query user account in the DB by user id
 *
 * @function
 * @returns {json} json object with user data
 * @param data
 */
export async function getUserById(data) {
  return User.findByPk(data);
}


/**
 * get users
 *
 * @function
 * @returns {json} json object with users data
 * @param currentPage
 * @param pageLimit
 */
export async function getUsers(currentPage = 1, pageLimit = 10) {
  return User.paginate({
    page: currentPage,
    paginate: pageLimit,
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['password'] },
  });
}

/**
 * search users
 *
 * @function
 * @returns {json} json object with users data
 * @param currentPage
 * @param pageLimit
 * @param search
 */
export async function searchUsers(currentPage = 1, pageLimit = 10, search) {
  return User.paginate({
    page: currentPage,
    paginate: pageLimit,
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['password'] },
    where: {
      [Op.or]: [
        {
          firstname: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          lastname: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          username: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          phone: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
  });
}
