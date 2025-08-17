import "dotenv/config";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const config = {
  OPENAI_API_KEY: getEnvVar("OPENAI_API_KEY"),
  GEMINI_API_KEY: getEnvVar("GEMINI_API_KEY"),
  GEMINI_BASE_URL: getEnvVar("GEMINI_BASE_URL")
};
