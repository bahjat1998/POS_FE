import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.NewClickPosSystem.app',
  appName: 'Pos System',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
