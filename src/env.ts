const env = {
  appwrite: {
    api_endpoint: String(process.env.NEXT_PUBLIC_API_ENDPOINT),
    project_id: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    api_key: String(process.env.APPWRITE_API_KEY), // Server-only secret
  },
};

export default env;
