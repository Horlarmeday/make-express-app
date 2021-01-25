import bcrypt from 'bcryptjs';
import {
  createUser,
  findUserByPhoneOrUsername,
  findUserByUsername,
  getUsers,
  searchUsers,
} from './userRepository';
import APIError from '../../util/apiError';

class UserService {
  /**
   * create user account
   *
   * @static
   * @returns {json} json object with user data
   * @param body
   * @memberOf UserService
   */
  static async createUserService(body) {
    const user = await findUserByPhoneOrUsername({ phone: body.phone, username: body.username });
    if (user) throw new APIError('INVALID', 400, 'User already exists');

    return createUser(body);
  }

  /**
   * login user account
   *
   * @static
   * @returns {json} json object with user data
   * @param body
   * @memberOf UserService
   */
  static async userLoginService(body) {
    const user = await findUserByUsername(body);
    if (!user) throw new APIError('INVALID', 400, 'Invalid username or password');

    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) throw new APIError('INVALID', 400, 'Invalid username or password');

    const token = user.generateAuthToken();

    return {
      token,
      user,
    };
  }

  /**
   * get users
   *
   * @static
   * @returns {json} json object with users data
   * @param body
   * @memberOf UserService
   */
  static async getUsers(body) {
    const { currentPage, pageLimit, search } = body;
    if (search) {
      return searchUsers(Number(currentPage), Number(pageLimit), search);
    }

    if (Object.values(body).length) {
      return getUsers(Number(currentPage), Number(pageLimit));
    }

    return getUsers();
  }
}
export default UserService;
