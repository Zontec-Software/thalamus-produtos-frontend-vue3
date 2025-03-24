import { defineConfig } from "@vue/cli-service";
export default defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: "all",
    host: 'localhost.thalamus.ind.br',
    client: {
      webSocketURL: 'ws://localhost.thalamus.ind.br:8080/ws',
    },
  },
});
