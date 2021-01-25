import User from '../model/user';
import { calculateLimitAndOffset, paginate } from '../../helpers/helper';
import { countDocument } from '../Q&A/repository/questionRepository';

/**
 * find user by email
 *
 * @static
 * @returns {json} json object with user data
 * @param data accepts email
 */
export const findUserByEmail = async data => {
  return User.findOne({ email: data });
};

/**
 * count number of users
 *
 * @static
 * @returns {json} json object with number of documents
 */
export const countDocument = async () => {
  return User.estimatedDocumentCount();
};

/**
 * finds if user exists
 *
 * @static
 * @returns {json} array of user(s)
 * @param data accepts email and phone
 */
export const findExistingUser = async data => {
  return User.find({ $or: [{ email: data.email }, { phone: data.phone }] });
};

/**
 * create user data
 *
 * @static
 * @returns {json} json object with user data
 * @param data accept email, phone, lastname, firstname and password
 */
export const createUser = async data => {
  const { firstname, lastname, email, phone, password } = data;
  const user = new User({
    firstname,
    lastname,
    email,
    phone,
    password,
  });
  await user.save();
  return user;
};

/**
 * search users
 *
 * @static
 * @returns {json} json array of objects of users
 * @param data accepts search query
 */
export const searchUsers = async data => {
  const { currentPage, pageLimit, search } = data;
  const { limit, offset } = calculateLimitAndOffset(currentPage, pageLimit);
  const users = await User.find({ $text: { $search: search } }, { score: { $meta: 'textScore' } })
    .limit(limit)
    .skip(offset)
    .select({ __v: 0 })
    .sort({ score: { $meta: 'textScore' } });
  const meta = paginate(currentPage, await countDocument(), users, pageLimit);
  return { users, meta };
};

/**
 * get users
 *
 * @static
 * @returns {json} json array of objects of users
 * @param data accepts currentPage number
 */
export const getUsers = async (currentPage, pageLimit) => {
  const { limit, offset } = calculateLimitAndOffset(currentPage, pageLimit);
  const users = await User.find()
    .limit(limit)
    .skip(offset)
    .select({ __v: 0 })
    .sort('-createdAt');
  const meta = paginate(currentPage, await countDocument(), users, pageLimit);
  return { users, meta };
};
