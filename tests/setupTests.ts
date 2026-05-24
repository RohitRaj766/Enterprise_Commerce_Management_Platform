import '@testing-library/jest-dom';

import dotenv from 'dotenv';
dotenv.config({ path: process.env.TEST_ENV_FILE || '.env' });
