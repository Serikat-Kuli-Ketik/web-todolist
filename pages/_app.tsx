import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import Modal from "react-modal";

Modal.setAppElement("#__next");

if (process.env.NODE_ENV === "development") {
  require("../mocks");
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer position="bottom-left" />
    </>
  );
}
