import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of this file (src/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env file is in the same directory (src/.env)
const envPath = path.join(__dirname, ".env");
config({ path: envPath });

const env = {
  appwrite: {
    api_endpoint: String(process.env.API_ENDPOINT),
    project_id: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    api_key: String(process.env.APPWRITE_API_KEY),
  },
};

export default env;
