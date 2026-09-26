/**
 * Retries a promise-returning function with exponential backoff.
 * * @param {Function} fn - The asynchronous function to execute (must return a Promise).
 * @param {number} retries - Maximum number of retry attempts.
 * @param {number} delay - Initial delay between retries in milliseconds.
 * @param {number} backoff - The multiplier by which the delay increases each retry.
 * @returns {Promise<any>} The resolved value of the passed function.
 */
async function retryWithBackoff(fn: any, retries = 3, delay = 1000, backoff = 2) {
  try {
    // Attempt to execute the passed asynchronous function
    return await fn();
  } catch (error) {
    // If no retries are left, throw the final error
    if (retries <= 0) {
      return Promise.reject(new Error(`Max retries reached. Final error: ${error.message}`));
    }
    console.warn(`Execution failed: "${error.message}". Retrying in ${delay}ms... (${retries} attempts left)`);
    // 1. Create a native Promise that resolves after the specified delay
    await new Promise(resolve => setTimeout(resolve, delay));
    // 2. Recursively call itself, reducing the retry count and increasing the delay
    return retryWithBackoff(fn, retries - 1, delay * backoff, backoff);
  }
}