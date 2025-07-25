import {defineConfig} from "vite";
import {defaultConfig} from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    html: {
      colorPalette: "blue", // Change this to any color palette you prefer
    },
  },
})

export const system = createSystem(defaultConfig, config)