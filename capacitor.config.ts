import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.alexandrelebegue.potatoclicker",
  appName: "Potato Clicker",
  webDir: "out",
  android: {
    allowMixedContent: false,
  },
};

export default config;
