import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import Modal from "react-modal";
import Head from "next/head";

Modal.setAppElement("#__next");

if (process.env.NODE_ENV === "development") {
  require("../mocks");
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="description" content="Cross-platform todo list app" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Component {...pageProps} />
      <ToastContainer position="bottom-left" />
    </>
  );
}
