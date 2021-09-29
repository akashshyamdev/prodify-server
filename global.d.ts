namespace NodeJS {
  interface ProcessEnv {
    PORT?: number;
    MONGO_URI: string;
    JWT_SECRET: string;
    CLOUDINARY_API_KEY: string;
    GOOGLE_AUTH_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
