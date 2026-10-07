import { Platform } from 'react-native';

const DEV_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export const API_BASE_URL = `${DEV_HOST}/api/v1`;
