const url =
  window.location.hostname === "localhost"
    ? "https://localhost:3131"
    : "https://api.parentingo.com";

const api = {
  url,
};

export default api;
