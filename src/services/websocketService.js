/**
 * Serviço de WebSocket para atualizações em tempo real.
 * Configure VUE_APP_WEBSOCKET_URL no .env (ex: ws://127.0.0.1:6001).
 * Se não estiver configurado, subscribe/unsubscribe não fazem nada (app segue funcionando sem WS).
 */

const getWsUrl = () => {
  const url = process.env.VUE_APP_WEBSOCKET_URL;
  if (url) return url;
  const api = process.env.VUE_APP_ROOT_API || "";
  if (api.startsWith("http://")) return api.replace("http://", "ws://").replace("/api", "") + "/ws";
  if (api.startsWith("https://")) return api.replace("https://", "wss://").replace("/api", "") + "/ws";
  return null;
};

let ws = null;
let wsUrl = null;
let reconnectTimer = null;
const RECONNECT_DELAY_MS = 3000;
const channelCallbacks = new Map();
let connecting = false;

function connect() {
  const url = getWsUrl();
  if (!url) return;
  if (ws?.readyState === WebSocket.OPEN || connecting) return;

  wsUrl = url;
  connecting = true;
  try {
    ws = new WebSocket(wsUrl);
  } catch (e) {
    connecting = false;
    console.warn("[WebSocket] Erro ao conectar:", e);
    return;
  }

  ws.onopen = () => {
    connecting = false;
    channelCallbacks.forEach((_, channel) => sendSubscribe(channel));
  };

  ws.onclose = () => {
    connecting = false;
    ws = null;
    if (channelCallbacks.size > 0 && wsUrl) {
      reconnectTimer = setTimeout(() => connect(), RECONNECT_DELAY_MS);
    }
  };

  ws.onerror = () => {
    connecting = false;
  };

  ws.onmessage = (event) => {
    try {
      const payload = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      const channel = payload.channel ?? payload.channel_name ?? null;
      const eventName = payload.event ?? payload.type ?? "message";
      const data = payload.data ?? payload;

      if (channel && channelCallbacks.has(channel)) {
        const cb = channelCallbacks.get(channel);
        if (typeof cb === "function") cb({ event: eventName, data });
        return;
      }
      if (!channel && channelCallbacks.size > 0) {
        channelCallbacks.forEach((cb) => {
          if (typeof cb === "function") cb({ event: eventName, data });
        });
      }
    } catch (e) {
      // ignore parse error
    }
  };
}

function sendSubscribe(channel) {
  if (ws?.readyState === WebSocket.OPEN && channel) {
    try {
      ws.send(JSON.stringify({ action: "subscribe", channel }));
    } catch (e) {
      console.warn("[WebSocket] Erro ao inscrever no canal:", e);
    }
  }
}

function sendUnsubscribe(channel) {
  if (ws?.readyState === WebSocket.OPEN && channel) {
    try {
      ws.send(JSON.stringify({ action: "unsubscribe", channel }));
    } catch (e) {
      // ignora falha ao enviar unsubscribe
    }
  }
}

/**
 * Inscreve em um canal para receber eventos em tempo real.
 * @param {string} channel - Nome do canal (ex: "gestao-arquivos.produto.2760515092")
 * @param {function} callback - Função chamada com { event, data } quando chegar mensagem
 * @returns {function} - Função para cancelar a inscrição
 */
function subscribe(channel, callback) {
  if (!channel || typeof callback !== "function") return () => {};

  channelCallbacks.set(channel, callback);
  if (ws?.readyState === WebSocket.OPEN) {
    sendSubscribe(channel);
  } else if (getWsUrl()) {
    connect();
  }

  return () => {
    channelCallbacks.delete(channel);
    sendUnsubscribe(channel);
    if (channelCallbacks.size === 0 && reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
      if (ws) {
        ws.close();
        ws = null;
      }
    }
  };
}

/**
 * Cria o nome do canal para gestão de arquivos de um produto.
 * @param {string|number} produtoCod
 * @returns {string}
 */
function channelGestaoArquivosProduto(produtoCod) {
  return `gestao-arquivos.produto.${produtoCod}`;
}

export default {
  subscribe,
  channelGestaoArquivosProduto,
  get isConfigured() {
    return !!getWsUrl();
  },
};
