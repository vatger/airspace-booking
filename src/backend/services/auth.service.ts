import axios from 'axios';
import jwt from 'jsonwebtoken';

import config from '../config';
import userModel, { UserDocument } from '../models/user.model';
import nestedobjectsUtils from '../utils/nestedobjects.utils';


export async function authUser(code: string): Promise<string> {
  const body = {
    grant_type: 'authorization_code',
    client_id: config().clientId,
    client_secret: config().clientSecret,
    redirect_uri: config().publicUrl + '/api/v1/auth/login',
    code: code,
  };

  try {
    const tokenResponse = await axios.post(config().vatsimAuthUrl + '/oauth/token', body);

    const userResponse = await axios.get(config().vatsimAuthUrl + '/api/user', {
      headers: {
        Authorization: 'Bearer ' + tokenResponse.data.access_token,
        Accept: 'application/json',
      },
    });

    const userFromApi = userResponse.data.data;

    console.log(userFromApi);

    let user = await userModel.findOne({ 'apidata.cid': userFromApi.cid });

    const updateOps: any = {
      apidata: userFromApi,
      access_token: tokenResponse.data.access_token,
      refresh_token: tokenResponse?.data?.refresh_token ?? null,
      areaBooking: {},
    };

    if (userFromApi.oauth.token_valid != 'true') {
      // do not save tokens if :wow: they aren't valid
      updateOps.access_token = '';
      updateOps.refresh_token = '';
    }

    //create JWT for the Frontend
    const token = jwt.sign(
      {
        cid: userFromApi.cid,
      },
      config().jwtSecret,
      {
        expiresIn: '1h',
      },
    );

    if (user) {
      // user exists, update
      await userModel.updateOne(
        { _id: user._id },
        {
          $set: nestedobjectsUtils.getValidUpdateOpsFromNestedObject(updateOps),
        },
      );
    } else {
      // user does not exist, create in database
      // updateOps._id = new mongoose.Types.ObjectId();
      user = new userModel(updateOps);
      await user.save();
    }

    return token;
  } catch (e) {
    console.log('error authenticating user', e);
    throw e;
  }
}

export async function getUserFromToken(token: string): Promise<UserDocument> {
  try {
    console.log('Token is:', token);
    const tokendata = jwt.verify(token, config().jwtSecret, {});

    if (typeof tokendata == 'string') {
      console.log('BIG WTF -', tokendata);

      throw new Error('token returned string, wtf');
    }

    const user = await userModel
      .findOne({
        'apidata.cid': tokendata.cid,
      })
      .exec();

    if (!user) {
      throw new Error('no user with that CID found in database');
    }

    return user;
  } catch (e) {
    console.log('error getting user from token', e);
    throw e;
  }
}

export default {
  authUser,
  getUserFromToken,
};
