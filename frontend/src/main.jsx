import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Headphones,
  LogIn,
  MessageSquare,
  Plus,
  RefreshCw,
  Send,
  UserCheck,
  UserPlus
} from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
const EMPTY_AUTH_FORM = {
  name: '',
  email: '',
  password: ''
};
const INITIAL_FORM = {
  title: '',
  description: '',
  categoryId: '',
  priority: 'medium'
};
const STATUS_OPTIONS = [
  ['open', 'Aberto'],
  ['in_progress', 'Em atendimento'],
  ['waiting_user', 'Aguardando usuario'],
  ['resolved', 'Resolvido'],
  ['closed', 'Fechado'],
  ['canceled', 'Cancelado']
];
const STATUS_LABELS = Object.fromEntries(STATUS_OPTIONS);
const PRIORITY_LABELS = {
  low: 'Baixa',
  medium: 'Media',
  high: 'Alta',
  critical: 'Critica'
};
const EVENT_LABELS = {
  ticket_created: 'Chamado criado',
  ticket_assigned: 'Chamado assumido',
  message_added: 'Mensagem adicionada',
  status_changed: 'Status atualizado'
};

function App() {
  const [mode, setMode] = useStateFromStorage('authMode', 'login');
  const [auth, setAuth] = React.useState(null);
  const [authForm, setAuthForm] = React.useState(EMPTY_AUTH_FORM);
  const [ticketForm, setTicketForm] = React.useState(INITIAL_FORM);
  const [message, setMessage] = React.useState('');
  const [categories, setCategories] = React.useState([]);
  const [tickets, setTickets] = React.useState([]);
  const [selectedTicket, setSelectedTicket] = React.useState(null);
  const [status, setStatus] = React.useState({ type: 'idle', message: '' });
  const [isLoading, setIsLoading] = React.useState(false);

  const token = auth?.token;
  const isTechnician = ['technician', 'admin'].includes(auth?.user?.role);
  const isRequester = !isTechnician;
  const isLoggedOut = auth === null;

  React.useEffect(() => {
    if (!token) {
      return;
    }

    loadWorkspaceData();
    // The request helper already captures the current token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  React.useEffect(() => {
    if (status.type !== 'success' || !status.message) {
      return undefined;
    }

    const timeoutId = globalThis.setTimeout(() => {
      setStatus({ type: 'idle', message: '' });
    }, 4500);

    return () => globalThis.clearTimeout(timeoutId);
  }, [status]);

  async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error?.message ?? 'Falha ao chamar a API.');
    }

    return data;
  }

  async function handleAuth(event) {
    event.preventDefault();
    setIsLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const isLogin = mode === 'login';
      const path = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: authForm.email, password: authForm.password }
        : { ...authForm };
      const result = await request(path, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (isLogin) {
        setAuth(result);
        setStatus({ type: 'success', message: 'Usuario autenticado com sucesso.' });
        return;
      }

      setMode('login');
      setAuthForm({
        name: result.user.name,
        email: result.user.email,
        password: ''
      });
      setStatus({ type: 'success', message: 'Cadastro realizado. Faca login para continuar.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  async function loadWorkspaceData() {
    setIsLoading(true);
    try {
      const [categoryResult, ticketResult] = await Promise.all([
        request('/api/categories'),
        request('/api/tickets')
      ]);

      setCategories(categoryResult.categories);
      setTickets(ticketResult.tickets);
      setTicketForm((current) => ({
        ...current,
        categoryId: current.categoryId || categoryResult.categories[0]?.id || ''
      }));
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  async function createTicket(event) {
    event.preventDefault();
    setIsLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const result = await request('/api/tickets', {
        method: 'POST',
        body: JSON.stringify(ticketForm)
      });

      setSelectedTicket(result.ticket);
      setTicketForm({
        ...INITIAL_FORM,
        categoryId: ticketForm.categoryId
      });
      await loadWorkspaceData();
      setStatus({ type: 'success', message: 'Chamado criado e listado.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  async function assignSelectedTicket() {
    if (!selectedTicket) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await request(`/api/tickets/${selectedTicket.id}/assign`, {
        method: 'POST'
      });
      await loadWorkspaceData();
      await showTicket(result.ticket.id);
      setStatus({ type: 'success', message: 'Chamado assumido pelo tecnico.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  async function updateSelectedStatus(status) {
    if (!selectedTicket) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await request(`/api/tickets/${selectedTicket.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      await loadWorkspaceData();
      await showTicket(result.ticket.id);
      setStatus({ type: 'success', message: 'Status do chamado atualizado.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessage(event) {
    event.preventDefault();
    if (!selectedTicket) {
      return;
    }

    setIsLoading(true);
    try {
      await request(`/api/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message })
      });
      setMessage('');
      await loadWorkspaceData();
      await showTicket(selectedTicket.id);
      setStatus({ type: 'success', message: 'Resposta registrada no historico.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  async function showTicket(ticketId) {
    setIsLoading(true);
    try {
      const result = await request(`/api/tickets/${ticketId}`);
      setSelectedTicket(result.ticket);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    setAuth(null);
    setAuthForm(EMPTY_AUTH_FORM);
    setTicketForm(INITIAL_FORM);
    setMessage('');
    setCategories([]);
    setTickets([]);
    setSelectedTicket(null);
    setMode('login');
    setStatus({ type: 'idle', message: '' });
  }

  function changeAuthMode(nextMode) {
    setMode(nextMode);
    setStatus({ type: 'idle', message: '' });
  }

  return (
    <main className={`app-shell ${isTechnician ? 'technician-mode' : 'requester-mode'}`}>
      <section className="workspace">
        <header className="topbar">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <Headphones size={22} />
            </div>
            <div>
              <p className="eyebrow">Central de suporte tecnico</p>
              <h1>Sistema de Chamados</h1>
            </div>
          </div>
          {auth?.user && (
            <div className="session-bar">
              <span>{auth.user.email}</span>
              <button className="secondary-action" type="button" onClick={logout}>
                Sair
              </button>
            </div>
          )}
        </header>

        {status.message && (
          <div className={`status ${status.type}`} role="status" aria-live="polite">
            {status.type === 'success' ? (
              <CheckCircle2 size={18} aria-hidden="true" />
            ) : (
              <AlertTriangle size={18} aria-hidden="true" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        {isLoggedOut ? (
          <AuthPanel
            mode={mode}
            setMode={changeAuthMode}
            form={authForm}
            setForm={setAuthForm}
            onSubmit={handleAuth}
            isLoading={isLoading}
            fillCredentials={(credentials) => {
              changeAuthMode('login');
              setAuthForm({ name: '', ...credentials });
            }}
          />
        ) : (
          <div
            className={`dashboard ${
              isTechnician ? 'technician-dashboard' : 'requester-dashboard'
            }`}
          >
            <section className="panel" id={isRequester ? 'new-ticket-panel' : undefined}>
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Usuario autenticado</p>
                  <h2>{auth.user.name}</h2>
                  <span className="profile-label">{isTechnician ? 'Tecnico' : 'Solicitante'}</span>
                </div>
                <button className="icon-action" type="button" onClick={loadWorkspaceData}>
                  <RefreshCw size={18} aria-hidden="true" />
                  <span>Atualizar</span>
                </button>
              </div>

              {isTechnician ? (
                <TechnicianSummary tickets={tickets} />
              ) : (
                <TicketForm
                  categories={categories}
                  form={ticketForm}
                  setForm={setTicketForm}
                  onSubmit={createTicket}
                  isLoading={isLoading}
                />
              )}
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Chamados</p>
                  <h2>
                    {tickets.length} {tickets.length === 1 ? 'registrado' : 'registrados'}
                  </h2>
                </div>
                {isRequester && (
                  <button
                    className="icon-action mobile-priority-action"
                    type="button"
                    onClick={() =>
                      document
                        .getElementById('new-ticket-panel')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  >
                    <Plus size={18} aria-hidden="true" />
                    <span>Novo</span>
                  </button>
                )}
              </div>
              <TicketList
                tickets={tickets}
                onSelect={showTicket}
                isTechnician={isTechnician}
                selectedTicketId={selectedTicket?.id}
              />
            </section>

            <section className="panel detail-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Detalhe</p>
                  <h2>{selectedTicket ? selectedTicket.title : 'Nenhum chamado selecionado'}</h2>
                </div>
              </div>
              <TicketDetail
                ticket={selectedTicket}
                isTechnician={isTechnician}
                isLoading={isLoading}
                message={message}
                setMessage={setMessage}
                onAssign={assignSelectedTicket}
                onStatusChange={updateSelectedStatus}
                onSendMessage={sendMessage}
              />
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

function AuthPanel({ mode, setMode, form, setForm, onSubmit, isLoading, fillCredentials }) {
  return (
    <section className="auth-panel">
      <div className="auth-heading">
        <div className="brand-mark" aria-hidden="true">
          <ClipboardList size={22} />
        </div>
        <div>
          <p className="eyebrow">Acesso</p>
          <h2>{mode === 'login' ? 'Entrar no sistema' : 'Criar conta'}</h2>
        </div>
      </div>

      <div className="segmented-control" role="tablist" aria-label="Modo de acesso">
        <button
          className={mode === 'login' ? 'active' : ''}
          type="button"
          onClick={() => {
            setMode('login');
            setForm({ ...EMPTY_AUTH_FORM, email: form.email });
          }}
        >
          <LogIn size={18} aria-hidden="true" />
          Login
        </button>
        <button
          className={mode === 'register' ? 'active' : ''}
          type="button"
          onClick={() => {
            setMode('register');
            setForm(EMPTY_AUTH_FORM);
          }}
        >
          <UserPlus size={18} aria-hidden="true" />
          Cadastro
        </button>
      </div>

      {mode === 'login' && (
        <div className="quick-access" aria-label="Acesso por perfil">
          <button
            type="button"
            className="quick-access-button"
            onClick={() =>
              fillCredentials({
                email: 'usuario.demo@example.com',
                password: '123456'
              })
            }
          >
            Usuario
          </button>
          <button
            type="button"
            className="quick-access-button"
            onClick={() =>
              fillCredentials({
                email: 'tecnico.demo@example.com',
                password: '123456'
              })
            }
          >
            Tecnico
          </button>
        </div>
      )}

      <form className="form-grid" onSubmit={onSubmit}>
        {mode === 'register' && (
          <label>
            <span>Nome</span>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
        )}
        <label>
          <span>E-mail</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>
        <label>
          <span>Senha</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            minLength={6}
            required
          />
        </label>
        <button className="primary-action" type="submit" disabled={isLoading}>
          {mode === 'login' ? <LogIn size={18} aria-hidden="true" /> : <UserPlus size={18} aria-hidden="true" />}
          {mode === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>
    </section>
  );
}

function TicketForm({ categories, form, setForm, onSubmit, isLoading }) {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label>
        <span>Titulo</span>
        <input
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          required
        />
      </label>
      <label>
        <span>Descricao</span>
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          rows={5}
          required
        />
      </label>
      <div className="form-row">
        <label>
          <span>Categoria</span>
          <select
            value={form.categoryId}
            onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Prioridade</span>
          <select
            value={form.priority}
            onChange={(event) => setForm({ ...form, priority: event.target.value })}
          >
            <option value="low">Baixa</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="critical">Critica</option>
          </select>
        </label>
      </div>
      <button className="primary-action" type="submit" disabled={isLoading}>
        <Plus size={18} aria-hidden="true" />
        Abrir chamado
      </button>
    </form>
  );
}

function TechnicianSummary({ tickets }) {
  const openCount = tickets.filter((ticket) => ticket.status === 'open').length;
  const inProgressCount = tickets.filter((ticket) => ticket.status === 'in_progress').length;
  const highPriorityCount = tickets.filter((ticket) =>
    ['high', 'critical'].includes(ticket.priority)
  ).length;

  return (
    <div className="summary-grid">
      <article>
        <span>Abertos</span>
        <strong>{openCount}</strong>
      </article>
      <article>
        <span>Em atendimento</span>
        <strong>{inProgressCount}</strong>
      </article>
      <article>
        <span>Alta prioridade</span>
        <strong>{highPriorityCount}</strong>
      </article>
    </div>
  );
}

function TicketList({ tickets, onSelect, isTechnician, selectedTicketId }) {
  if (!tickets.length) {
    return <p className="empty-state">Nenhum chamado encontrado.</p>;
  }

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <button
          key={ticket.id}
          className={`ticket-row ${ticket.id === selectedTicketId ? 'selected' : ''}`}
          type="button"
          aria-pressed={ticket.id === selectedTicketId}
          onClick={() => onSelect(ticket.id)}
        >
          <span>
            <strong>{ticket.title}</strong>
            <small>
              {ticket.category.name}
              {isTechnician ? ` - ${ticket.requester.name}` : ''}
            </small>
          </span>
          <span className="ticket-meta">
            <span className={`badge priority-${ticket.priority}`}>
              {formatPriority(ticket.priority)}
            </span>
            <span className={`badge ${ticket.status}`}>{formatStatus(ticket.status)}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function TicketDetail({
  ticket,
  isTechnician,
  isLoading,
  message,
  setMessage,
  onAssign,
  onStatusChange,
  onSendMessage
}) {
  if (!ticket) {
    return <p className="empty-state">Selecione um chamado para ver o historico.</p>;
  }

  return (
    <div className="ticket-detail">
      <dl>
        <div>
          <dt>Status</dt>
          <dd>{formatStatus(ticket.status)}</dd>
        </div>
        <div>
          <dt>Prioridade</dt>
          <dd>{formatPriority(ticket.priority)}</dd>
        </div>
        <div>
          <dt>Categoria</dt>
          <dd>{ticket.category.name}</dd>
        </div>
      </dl>
      <p>{ticket.description}</p>
      {(isTechnician || ticket.status === 'waiting_user') && (
        <div className={isTechnician ? 'technician-actions' : 'requester-actions'}>
          {isTechnician && (
            <>
              {!ticket.technician && (
                <button className="primary-action" type="button" onClick={onAssign} disabled={isLoading}>
                  <UserCheck size={18} aria-hidden="true" />
                  Assumir chamado
                </button>
              )}
              <div className="action-strip" aria-label="Acoes rapidas de status">
                {ticket.status !== 'in_progress' && (
                  <button
                    className="secondary-action"
                    type="button"
                    onClick={() => onStatusChange('in_progress')}
                    disabled={isLoading}
                  >
                    Em atendimento
                  </button>
                )}
                {ticket.status !== 'resolved' && (
                  <button
                    className="primary-action"
                    type="button"
                    onClick={() => onStatusChange('resolved')}
                    disabled={isLoading}
                  >
                    Resolver
                  </button>
                )}
              </div>
              <label>
                <span>Status</span>
                <select
                  value={ticket.status}
                  onChange={(event) => onStatusChange(event.target.value)}
                  disabled={isLoading}
                >
                  {STATUS_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          <form className="message-form" onSubmit={onSendMessage}>
            <label>
              <span>{isTechnician ? 'Resposta ao solicitante' : 'Sua resposta'}</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
                required
              />
            </label>
            <button className="primary-action" type="submit" disabled={isLoading}>
              <Send size={18} aria-hidden="true" />
              Enviar resposta
            </button>
          </form>
        </div>
      )}
      <div className="timeline">
        {ticket.events?.map((event) => (
          <article key={event.id}>
            <MessageSquare size={16} aria-hidden="true" />
            <div>
              <strong>{formatEventType(event.type)}</strong>
              <span>{event.message}</span>
              <small>
                {event.author?.name ?? 'Sistema'} - {formatDate(event.createdAt)}
              </small>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const categoryShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});

const personShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});

const eventShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  message: PropTypes.string,
  author: personShape,
  createdAt: PropTypes.string.isRequired
});

const ticketShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  category: categoryShape.isRequired,
  requester: personShape.isRequired,
  technician: personShape,
  events: PropTypes.arrayOf(eventShape)
});

AuthPanel.propTypes = {
  mode: PropTypes.oneOf(['login', 'register']).isRequired,
  setMode: PropTypes.func.isRequired,
  form: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }).isRequired,
  setForm: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  fillCredentials: PropTypes.func.isRequired
};

TicketForm.propTypes = {
  categories: PropTypes.arrayOf(categoryShape).isRequired,
  form: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    categoryId: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired
  }).isRequired,
  setForm: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

TechnicianSummary.propTypes = {
  tickets: PropTypes.arrayOf(ticketShape).isRequired
};

TicketList.propTypes = {
  tickets: PropTypes.arrayOf(ticketShape).isRequired,
  onSelect: PropTypes.func.isRequired,
  isTechnician: PropTypes.bool.isRequired,
  selectedTicketId: PropTypes.string
};

TicketDetail.propTypes = {
  ticket: ticketShape,
  isTechnician: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
  onAssign: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onSendMessage: PropTypes.func.isRequired
};

function formatStatus(status) {
  return STATUS_LABELS[status] ?? status;
}

function formatPriority(priority) {
  return PRIORITY_LABELS[priority] ?? priority;
}

function formatEventType(type) {
  return EVENT_LABELS[type] ?? type;
}

function formatDate(value) {
  if (!value) {
    return 'sem data';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}

function useStateFromStorage(key, initialValue) {
  const [value, setValue] = React.useState(() => {
    const stored = globalThis.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  React.useEffect(() => {
    if (value === null) {
      globalThis.localStorage.removeItem(key);
      return;
    }

    globalThis.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
