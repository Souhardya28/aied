import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

const sign = (u) => jwt.sign({ id: u._id, name: u.name }, env.jwtSecret, { expiresIn: '7d' });
const publicUser = ({ _id, name, email, class: cls, stream, board, language_pref }) =>
  ({ id: _id, name, email, class: cls, stream, board, language_pref });

export async function register(req, res) {
  const { name, email, password, ...profile } = req.body;
  if (await User.exists({ email })) return res.status(409).json({ error: 'An account with this email already exists.' });
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 10), ...profile });
  res.status(201).json({ token: sign(user), user: publicUser(user) });
}

export async function login(req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
    return res.status(401).json({ error: 'Email or password is incorrect.' });
  }
  res.json({ token: sign(user), user: publicUser(user) });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id);
  res.json(publicUser(user));
}

export async function updateProfile(req, res) {
  const { class: cls, stream, board, language_pref, interests } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { class: cls, stream, board, language_pref, interests }, { new: true });
  res.json(publicUser(user));
}
