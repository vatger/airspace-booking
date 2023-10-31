export default function getConfig() {
  const { PORT } = process.env;

  const port = Number(PORT);

  const options = {
    vatsimAuthUrl: process.env.VATSIM_AUTH_URL ?? 'https://auth-dev.vatsim.net',
    vatsimAuthClientId: process.env.CLIENT_ID ?? '',
  };

  return {
    port: Number.isNaN(port) ? 3030 : port,
    mongoUri: process.env.MONGO_URI || '',

    vatsimAuthUrl: options.vatsimAuthUrl,
    clientId: options.vatsimAuthClientId,
    clientSecret: process.env.CLIENT_SECRET ?? '',

    publicUrl: process.env.PUBLIC_URL ?? '',
    jwtSecret: process.env.JWT_SECRET ?? 'super-secret-secret!',
    
  };
}
