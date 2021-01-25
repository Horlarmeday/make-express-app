import { findExistingUser, findUserByEmail, createUser, searchUsers, getUsers } from './userRepository';
import APIError from '../../util/apiError';
/**
 * sign up a user service
 *
 * @static
 * @returns {json} json object with user token
 * @param body object accept email, password, phone and firstname and lastname
 */
export const userSignUpService = async body => {
  const user = await findExistingUser(body);
  if (user.length > 0) throw new APIError('INVALID', 400, 'User already exists');

  return createUser(body);
};

/**
 * login a user service
 *
 * @static
 * @returns {json} json object with user token/null
 * @param body accept email and password
 */
export const loginUserService = async body => {
  const { email, password } = body;

  const user = await findUserByEmail(email);

  if (user && (await user.comparePassword(password))) {
    const token = user.generateAuthToken();
    return {
      token,
      user
    }
  }
  throw new APIError('INVALID', 400, 'invalid email or password');
};

/**
 * search users service
 *
 * @static
 * @returns {json} json array of objects of users
 * @param body
 */
export const getUsersService = async body => {
  const { currentPage, PageLimit, search } = body;

  if (search) {
    return searchUsers(body);
  }

  return getUsers(currentPage, PageLimit);
};
