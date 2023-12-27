// Create an AbortController instance
const abortController = new AbortController();

// Define default options
const defaultOptions = {
  mode: 'cors', // default
  headers: {
    'Content-Type': 'application/json',
    // Accept: 'application/json',
  },
};

async function request(url, requestOptions, timeout = 90000) {
  const { signal } = abortController;
  let loading = true;
  let error = null;
  let data = null;

  // Set a timeout for aborting the fetch
  const timeoutId = setTimeout(() => {
    abortController.abort();
    loading = false; // Set loading to false on timeout
    error = 'Request timed out!';
  }, timeout);

  try {
    const response = await fetch(url, {
      signal,
      ...defaultOptions,
      ...requestOptions,
    });

    if (!response.ok) {
      error = response.statusText;
    } else {
      data = await response.json();
    }

    // Clear the timeout if the request completes before it
    clearTimeout(timeoutId);

    // Set loading to false after successful or failed request
    // then return response
    loading = false;
    return { loading, error, data, response };
  } catch (err) {
    // Handle the exception and errors
    error = err.message;

    // Clear the timeout on error
    clearTimeout(timeoutId);

    // Set loading to false on error and return response
    loading = false;
    return { loading, error, data, response: null };
  }
}

export function GET(url, options = {}, timeout = 90000) {
  return request(url, { method: 'GET', ...options }, timeout);
}

export function POST(url, options = {}, timeout = 90000) {
  return request(url, { method: 'POST', ...options }, timeout);
}

// Todo: Add other HTTP methods
