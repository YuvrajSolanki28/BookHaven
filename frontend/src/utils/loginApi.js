const getErrorMessage = (data, fallbackMessage) => {
  return data?.message || data?.error || fallbackMessage;
};

const requestJson = async (url, payload) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
};

export const loginUser = async ({ email, password }) => {
  const baseUrl = process.env.REACT_APP_BACKEND_URL;
  const result = await requestJson(`${baseUrl}/api/auth/login`, { email, password });

  if (!result.ok) {
    return {
      ...result,
      errorMessage: getErrorMessage(result.data, 'Login failed'),
    };
  }

  return result;
};

export const verifyUserEmail = async ({ email, code }) => {
  const baseUrl = process.env.REACT_APP_BACKEND_URL;
  const result = await requestJson(`${baseUrl}/api/auth/verify`, { email, code });

  if (!result.ok) {
    return {
      ...result,
      errorMessage: getErrorMessage(result.data, 'Invalid verification code'),
    };
  }

  return result;
};
