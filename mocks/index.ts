const initMock = async () => {
  if (typeof window === "undefined") {
    const { server } = await import("./server");
    server.listen();
  } else {
    const { worker } = require("./browser");
    worker.start({ onUnhandledRequest: "bypass" });
  }
};

initMock();

export {};
