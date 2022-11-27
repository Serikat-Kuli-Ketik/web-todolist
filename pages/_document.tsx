import { Html, Head, Main, NextScript } from "next/document";

if (process.env.NODE_ENV !== "production") {
  require("../api-mock");
}

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
