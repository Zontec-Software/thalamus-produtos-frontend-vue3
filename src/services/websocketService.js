/**
 * Serviço de WebSocket para atualizações em tempo real (padrão thalamus-projetos).
 * URL: wss://socket.thalamus.ind.br
 * Quando qualquer cliente altera arquivos de um produto, as outras telas do mesmo produto recarregam.
 */

const DEFAULT_WS_URL = 'wss://socket.thalamus.ind.br';
const RECONNECT_INTERVAL_MS = 3000;

class WebSocketService {
  constructor(url = DEFAULT_WS_URL, reconnectInterval = RECONNECT_INTERVAL_MS) {
    this.url = url;
    this.reconnectInterval = reconnectInterval;
    this.ws = null;
    this.listeners = [];
    this.subscribedChannels = new Set();
    this.shouldReconnect = true;
    this.reconnectTimeout = null;
    this._onOpen = null;
    this._onMessage = null;
    this._onClose = null;
    this._onError = null;
    this.connect();
  }

  static _instance = null;
  static getInstance() {
    if (!WebSocketService._instance) {
      WebSocketService._instance = new WebSocketService();
    }
    return WebSocketService._instance;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.warn('[WebSocket] Erro ao conectar:', e);
      this.scheduleReconnect();
      return;
    }

    this._onOpen = () => {
      if (process.env.NODE_ENV !== 'production') console.log('[WebSocket] Conectado');
      this.subscribedChannels.forEach((ch) => this.sendSubscribe(ch));
    };

    this._onMessage = (event) => this.notifyAll(event);

    this._onClose = () => {
      if (process.env.NODE_ENV !== 'production') console.warn('[WebSocket] Conexão encerrada. Reconectando...');
      this.ws = null;
      this.scheduleReconnect();
    };

    this._onError = () => {
      if (process.env.NODE_ENV !== 'production') console.error('[WebSocket] Erro');
      if (this.ws) this.ws.close();
    };

    this.ws.addEventListener('open', this._onOpen);
    this.ws.addEventListener('message', this._onMessage);
    this.ws.addEventListener('close', this._onClose);
    this.ws.addEventListener('error', this._onError);
  }

  scheduleReconnect() {
    if (this.shouldReconnect && !this.reconnectTimeout) {
      this.reconnectTimeout = setTimeout(() => {
        if (process.env.NODE_ENV !== 'production') console.log('[WebSocket] Reconectando...');
        this.reconnectTimeout = null;
        this.connect();
      }, this.reconnectInterval);
    }
  }

  addListener(callback) {
    if (typeof callback === 'function') this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((l) => l !== callback);
  }

  /** Envia subscribe no formato Pusher/Reverb. Necessário para receber eventos do canal. */
  sendSubscribe(channel) {
    if (!channel || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    try {
      this.send({ event: 'pusher:subscribe', data: { channel } });
      if (process.env.NODE_ENV !== 'production') console.log('[WebSocket] Subscribe:', channel);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.warn('[WebSocket] Erro ao inscrever:', e);
    }
  }

  sendUnsubscribe(channel) {
    if (!channel || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    try {
      this.send({ event: 'pusher:unsubscribe', data: { channel } });
    } catch (e) {
      // ignora
    }
  }

  /**
   * Inscreve no canal para receber eventos (ex.: gestao-arquivos.produto.123).
   * Sem isso o servidor não envia eventos para este cliente.
   */
  subscribe(channel) {
    if (!channel) return;
    this.subscribedChannels.add(channel);
    this.sendSubscribe(channel);
  }

  unsubscribe(channel) {
    if (!channel) return;
    this.subscribedChannels.delete(channel);
    this.sendUnsubscribe(channel);
  }

  notifyAll(event) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.error('[WebSocket] Erro no listener:', e);
      }
    });
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(typeof message === 'string' ? message : JSON.stringify(message));
    } else if (process.env.NODE_ENV !== 'production') {
      console.warn('[WebSocket] Conexão fechada, mensagem não enviada.');
    }
  }

  close() {
    this.shouldReconnect = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      try {
        this.ws.removeEventListener('open', this._onOpen);
        this.ws.removeEventListener('message', this._onMessage);
        this.ws.removeEventListener('close', this._onClose);
        this.ws.removeEventListener('error', this._onError);
        this.ws.close();
      } finally {
        this.ws = null;
      }
    }
  }
}

/**
 * Nome do canal de gestão de arquivos para um produto (usado para filtrar mensagens).
 * @param {string|number} produtoCod
 * @returns {string}
 */
export function channelGestaoArquivosProduto(produtoCod) {
  return `gestao-arquivos.produto.${produtoCod}`;
}

export const getWebSocketService = () => WebSocketService.getInstance();

export default WebSocketService;
