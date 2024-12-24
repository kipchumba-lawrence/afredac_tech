import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  celoAlfajores,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    celoAlfajores, ],
  ssr: true,
});