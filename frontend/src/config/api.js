import { Platform } from 'react-native';


const MACHINE_IP = '192.168.1.5'; 

export const API_BASE_URL = Platform.select({
  ios: 'http://127.0.0.1:3000',
  android: 'http://10.0.2.2:3000', 
  default: `http://${MACHINE_IP}:3000`,
});
