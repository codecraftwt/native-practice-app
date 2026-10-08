import { Platform } from 'react-native';

const DEV_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
const PROD_HOST = 'https://native-practice-api.vercel.app';

const HOST = __DEV__ ? DEV_HOST : PROD_HOST;

export const API_BASE_URL = `${HOST}/api/v1`;
