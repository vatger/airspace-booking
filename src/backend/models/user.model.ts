import mongoose, { HydratedDocument } from 'mongoose';

import User from '@/shared/interfaces/user.interface';

export type UserDocument = HydratedDocument<User>;

const userSchema = new mongoose.Schema(
  {
    apidata: {
      cid: { type: Number, unique: true },
      personal: {
        name_first: { type: String, default: '' },
        name_last: { type: String, default: '' },
        name_full: { type: String, default: '' },
      },
      vatsim: {
        rating: {
          id: { type: Number, default: 0 },
          long: { type: String, default: '' },
          short: { type: String, default: '' },
        },
        pilotrating: {
          id: { type: Number, default: 0 },
          long: { type: String, default: '' },
          short: { type: String, default: '' },
        },
        division: {
          id: { type: String, default: 0 },
          name: { type: String, default: '' },
        },
        region: {
          id: { type: String, default: 0 },
          name: { type: String, default: '' },
        },
        subdivision: {
          id: { type: String, default: 0 },
          name: { type: String, default: '' },
        },
      },
    },
    access_token: { type: String, default: '' },
    refresh_token: { type: String, default: '' },

    areaBooking: {
      admin: { type: Boolean, default: false },
      allowBooking: { type: Boolean, default: true },
      banned: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

export default mongoose.model<UserDocument>('User', userSchema);
