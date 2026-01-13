const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: "all",
    host: 'localhost.thalamus.ind.br',
    client: {
      webSocketURL: 'ws://localhost.thalamus.ind.br:8080/ws',
    },
  },
})