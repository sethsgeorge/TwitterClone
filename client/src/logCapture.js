// logCapture.js

const logMessages = [];

const originalConsoleLog = console.log;
console.log = function (...args) {
  logMessages.push(args);
  originalConsoleLog(...args);
  localStorage.setItem("logMessages", JSON.stringify(logMessages));
};
