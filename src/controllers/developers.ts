import axios from 'axios';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { sign } from 'jsonwebtoken';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary';
import Developer from '../models/Developer';
import { IDeveloper } from '../types/developer';

const client = new OAuth2Client(process.env.GOOGLE_AUTH_API_KEY!);

function signTokenAndRespond(developer: IDeveloper, req: Request, res: Response, status: number) {
  // Token
  const token = sign({ id: developer._id }, process.env.JWT_SECRET!);

  // Cookie
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  };

  res.cookie('jwt', token, cookieOptions);

  // Set Location Header
  const reqUrl = `${req.protocol}://${req.get('host')}`;
  res.set('Location', `${reqUrl}/api/developers/${developer.id}`);

  // Response
  res.status(status).json({ data: developer, token });
}

export async function getAllDevelopers(req: Request, res: Response) {
  try {
    // Fetch from DB
    const developers = await Developer.find({});

    // Response
    res.status(200).json({ data: developers });
  } catch (error) {
    res.status(500).json({
      error,
      message: 'An unexpected error occurred.',
    });
  }
}

export async function getDeveloper(req: Request, res: Response) {
  try {
    // Fetch from DB
    const developer = await Developer.findById(req.params.id);
    if (!developer) return res.status(404).json({ message: 'No developer found with that ID' });

    // Response
    res.status(200).json({ data: developer });
  } catch (error) {
    res.status(500).json({
      error,
      message: 'An unexpected error occurred.',
    });
  }
}

export async function createDeveloper(req: Request, res: Response) {
  try {
    // Create in DB
    const developer = await Developer.create(req.body);

    signTokenAndRespond(developer, req, res, 201);
  } catch (error) {
    res.status(500).json({
      error,
      message: 'An unexpected error occurred.',
    });
  }
}

export async function loginDeveloper(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Find in DB
    const developer = await Developer.findOne({ email });

    // Compare Passwords
    if (!developer || !(await developer.comparePasswords(password, developer.password)))
      return res.status(404).json({ message: 'Email or Password is incorrect' });

    signTokenAndRespond(developer, req, res, 200);
  } catch (error) {
    res.status(500).json({
      error,
      message: 'An unexpected error occurred.',
    });
  }
}

export async function googleLoginDeveloper(req: Request, res: Response) {
  try {
    const { tokenId } = req.body;

    client.verifyIdToken(
      {
        idToken: tokenId,
        audience: process.env.GOOGLE_AUTH_API_KEY!,
      },
      async (err, ticket) => {
        const { email_verified, email, family_name, given_name } = ticket?.getPayload() || {};

        if (email_verified) {
          const developer = await Developer.findOne({ email });

          if (developer) {
            signTokenAndRespond(developer, req, res, 200);
          }

          const password = `${email}+${process.env.JWT_SECRET!}`;
          const newDeveloper = await Developer.create({
            email,
            password,
            firstName: given_name,
            lastName: family_name,
          });

          signTokenAndRespond(newDeveloper, req, res, 201);
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      error,
      message: 'An unexpected error occurred.',
    });
  }
}

export async function githubLoginDeveloper({ query }: Request, res: Response) {
  try {
    const { code } = query;

    console.log(code);

    const { data } = await axios.post(
      `https://github.com/login/oauth/access_token&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}&code=${code}&redirect_uri=http://localhost:3000/developers/signup`
    );

    console.log(data);

    if (!code) {
      res.status(401).json({
        message: 'Missing code',
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error,
      message: 'An unexpected error occurred.',
    });
  }
}

export async function uploadDeveloperMedia(req: Request, res: Response) {
  let streamUpload = (req: Request) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          console.log(result);
          resolve(result);
        } else {
          reject(error);
        }
      });

      streamifier.createReadStream(req.file!.buffer).pipe(stream);
    });
  };

  async function upload(req: Request) {
    try {
      let result = await streamUpload(req);

      res.status(200).json({
        data: result,
      });
    } catch (err) {
      console.log(err);
    }
  }

  await upload(req);
}

export async function updateDeveloper(req: Request, res: Response) {
  try {
    // Update DB
    const developer = await Developer.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!developer) return res.status(404).json({ message: 'No developer found with that ID' });

    // Set Location Header
    const reqUrl = `${req.protocol}://${req.get('host')}`;
    res.set('Location', `${reqUrl}/api/developers/${developer.id}`);

    // Response
    res.status(200).json({ data: developer });
  } catch (error) {
    res.status(500).json({
      error,
      message: 'An unexpected error occurred.',
    });
  }
}

export async function deleteDeveloper(req: Request, res: Response) {
  try {
    // Delete from DB
    const developer = await Developer.findByIdAndDelete(req.params.id);

    // Response
    res.status(204).json({ data: developer });
  } catch (error) {
    res.status(500).json({
      error,
      message: 'An unexpected error occurred.',
    });
  }
}

export async function resetAndSeedDB(req: Request, res: Response) {
  try {
    // Reset
    await Developer.deleteMany();

    // Seed
    const developers = await Developer.insertMany([
      {
        firstName: 'Test',
        lastName: 'User 1',
        email: 'test1@gmail.com',
        password: 'test1234',
      },
      {
        firstName: 'Test',
        lastName: 'User 2',
        email: 'test2@gmail.com',
        password: 'test1234',
      },
    ]);

    res.status(200).json({
      data: developers,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
      message: 'An unexpected error occurred.',
    });
  }
}
