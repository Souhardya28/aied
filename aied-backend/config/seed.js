import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Syllabus from '../models/Syllabus.js';
import CareerKB from '../models/CareerKB.js';

const dataDir = path.resolve(process.cwd(), '../data');
await connectDB();

const syllabus = JSON.parse(fs.readFileSync(path.join(dataDir, 'syllabus/cbse-class12.json'), 'utf8'));
await Syllabus.deleteMany({});
await Syllabus.insertMany(syllabus);

const careers = JSON.parse(fs.readFileSync(path.join(dataDir, 'career-kb.json'), 'utf8'));
await CareerKB.deleteMany({});
await CareerKB.insertMany(careers);

console.log(`[seed] ${syllabus.length} syllabus topics, ${careers.length} career entries`);
await mongoose.disconnect();
