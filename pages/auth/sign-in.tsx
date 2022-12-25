import { FormEventHandler, useState } from "react";
import Router from "next/router";
import styled from "styled-components";
import Head from "next/head";
import { useUserStore } from "../../stores/user.store";
import { useRouteProtection } from "../../hooks/use-route-protection";
import { UserAuthState } from "../../shared/types";

export default function SignInPage() {
  useRouteProtection(UserAuthState.AUTHENTICATED);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUserId = useUserStore((state) => state.set);

  const handleFormSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`,
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
          "x-mock-match-request-body": "true",
        },
      }
    );

    if (!response.ok) {
      alert("Cannot log in, check your credentials and try again.");
      return;
    }

    const jsonResponse = (await response.json()) as {
      meta: object;
      data: {
        user_id: string;
        token: string;
        email: string;
      };
    };

    setUserId(jsonResponse.data.user_id);
    Router.replace("/");
  };

  return (
    <>
      <Head>
        <title>Sign In | Dializer</title>
      </Head>
      <PageWrapper>
        <h1>Sign In</h1>
        <SignInForm
          onSubmit={handleFormSubmit}
          canSubmit={Boolean(email && password)}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="Email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            placeholder="Password"
          />
          <input type="submit" value="Sign in" />
        </SignInForm>
      </PageWrapper>
    </>
  );
}

const PageWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-family: sans-serif;
    letter-spacing: 2px;
    margin-bottom: 30px;
  }
`;

const SignInForm = styled.form<{ canSubmit: boolean }>`
  width: 250px;
  padding: 10px 20px;
  border: 1px solid grey;
  border-radius: 8px;
  display: flex;
  flex-direction: column;

  input {
    margin: 10px 0;
    border: 1px solid lightgrey;
    padding: 10px;
  }

  input[type="submit"] {
    color: white;
    border: none;
    background-color: ${(p) => (p.canSubmit ? "black" : "darkgrey")};
    border-radius: 8px;
    transition: all 0.2s;

    &:hover {
      cursor: pointer;
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;
