import { loginUser, verifyUserEmail } from './loginApi';

describe('loginApi', () => {
  beforeEach(() => {
    process.env.REACT_APP_BACKEND_URL = 'http://localhost:5000';
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns successful login response payload', async () => {
    const payload = { token: 'jwt-token', user: { id: '1', email: 'test@example.com' } };
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(payload),
    });

    const result = await loginUser({ email: 'test@example.com', password: 'secret' });

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'secret' }),
    });
    expect(result).toEqual({ ok: true, status: 200, data: payload });
  });

  it('returns fallback login error message when API response has no message', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({}),
    });

    const result = await loginUser({ email: 'test@example.com', password: 'bad' });

    expect(result.errorMessage).toBe('Login failed');
    expect(result.status).toBe(401);
  });

  it('returns verification error message from API response', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({ message: 'Code expired' }),
    });

    const result = await verifyUserEmail({ email: 'test@example.com', code: '111111' });

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', code: '111111' }),
    });
    expect(result.errorMessage).toBe('Code expired');
  });
});
