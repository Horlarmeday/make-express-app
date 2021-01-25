/**
 * User controller handles all requests that has to do with users
 *
 * - getUsers - get all users
 */
import UserService from './UserService';

/**
 *
 *
 * @class UserController
 */
class UserController {
  /**
   * create a user record
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status, user data and access token
   */
  static async createUser(req, res, next) {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    try {
      const user = await UserService.createUserService(req.body);

      return res.status(201).json({
        message: 'Successful, account created!',
        data: user
      });
    } catch (e) {
      return next(e);
    }
  }

  /**
   * login a user
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status, user data and access token
   */
  static async loginUser(req, res, next) {
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    try {
      const { token, user } = await UserService.userLoginService(req.body);

      return res.status(200).json({
        message: 'Login successful!',
        token,
        data: user,
      });
    } catch (e) {
      return next(e);
    }
  }

  /**
   * get all users
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with users data
   */
  static async getUsers(req, res, next) {
    try {
      const users = await UserService.getUsers(req.query);

      return res.status(200).json({
        message: 'Data retrieved',
        data: users,
      });
    } catch (e) {
      return next(e);
    }
  }
}
export default UserController;
