import { v2 } from 'cloudinary';
import { config } from 'src/config/env.config';

const CLOUDINARY = 'Cloudinary';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: config.cloudinary.name,
      api_key: config.cloudinary.key,
      api_secret: config.cloudinary.secret,
    });
  },
};
