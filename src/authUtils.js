// authUtils.js

export const setLoggedInUsername = (username) => {
  const expirationTime = 30 * 60 * 1000; // 30 minutes in milliseconds
  const expirationTimestamp = Date.now() + expirationTime;

  // Store the data without JSON.stringify
  localStorage.setItem("loggedInUsername", username);

  // Optionally, store the expiration timestamp for additional checks if needed
  localStorage.setItem("expirationTimestamp", expirationTimestamp);
};

export const getStoredUsername = () => {
  // Retrieve the data without JSON.parse
  const storedUsername = localStorage.getItem("loggedInUsername");

  if (storedUsername) {
    // Optionally, you can retrieve the expiration timestamp
    // const expirationTimestamp = localStorage.getItem("expirationTimestamp");

    // Perform additional checks if needed (e.g., expiration time)
    // ...

    return storedUsername;
  }

  return null;
};
