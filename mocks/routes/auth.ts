import { rest, setupWorker } from "msw";

export const handlers: Parameters<typeof setupWorker> = [
  rest.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-out`,
    async (req, res, ctx) => {
      return res(ctx.delay(300), ctx.status(200));
    }
  ),

  rest.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`,
    async (req, res, ctx) => {
      const reqBody = (await req.json()) as Partial<{
        email: string;
        password: string;
      }>;

      if (!reqBody.email || !reqBody.password) {
        const errors = {} as { email: string[]; password: string[] };

        if (!reqBody.email) {
          errors.email = [
            "email can't be empty",
            "email must be matched the documented format",
          ];
        }

        if (!reqBody.password) {
          errors.password = [
            "password can't be empty",
            "password must be at least 8 characters",
          ];
        }

        return res(
          ctx.delay(300),
          ctx.status(400),
          ctx.json({
            meta: {
              code: 400,
              message: "Bad Request",
            },
            data: {
              errors,
            },
          })
        );
      }

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTY5MTUyMjQsImp0aSI6ImFhYWFhYWFhLTAwMTAtMDAxMi0wMDAwYWFhYWJiYmJjY2NjIiwiZW1haWwiOiJ5b3VyZW1haWxAZXhhbXBsZS5jb20ifQ.XR_gIrhbPYbTX6P2op970kfdaJ9OP-RAuJ2UV9N6rXQ";

      return res(
        ctx.delay(300),
        ctx.cookie("token", token),
        ctx.status(201),
        ctx.json({
          meta: {
            code: 201,
            message: "Created",
          },
          data: {
            user_id: "aaaaaaaa-0010-0012-0000aaaabbbbcccc",
            email: reqBody.email,
            token,
          },
        })
      );
    }
  ),

  rest.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`,
    async (req, res, ctx) => {
      const reqBody = (await req.json()) as Partial<{
        email: string;
        password: string;
        password_confirmation: string;
      }>;

      if (
        !reqBody.email ||
        !reqBody.password ||
        !reqBody.password_confirmation
      ) {
        const errors = {} as {
          email: string[];
          password: string[];
          password_confirmation: string[];
        };

        if (!reqBody.email) {
          errors.email = [
            "email can't be empty",
            "email must be matched the documented format",
          ];
        }

        if (!reqBody.password) {
          errors.password = [
            "password can't be empty",
            "password must be at least 8 characters",
          ];
        }

        if (!reqBody.password_confirmation) {
          errors.password_confirmation = [
            "password confirmation can't be empty",
          ];
        }

        return res(
          ctx.delay(300),
          ctx.status(400),
          ctx.json({
            meta: {
              code: 400,
              message: "Bad Request",
            },
            data: {
              errors,
            },
          })
        );
      }

      if (reqBody.password !== reqBody.password_confirmation) {
        return res(
          ctx.delay(300),
          ctx.status(400),
          ctx.json({
            meta: {
              code: 400,
              message: "Bad Request",
            },
            data: {
              errors: {
                password: ["password does not match password confirmation"],
              },
            },
          })
        );
      }

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTY5MTUyMjQsImp0aSI6ImFhYWFhYWFhLTAwMTAtMDAxMi0wMDAwYWFhYWJiYmJjY2NjIiwiZW1haWwiOiJ5b3VyZW1haWxAZXhhbXBsZS5jb20ifQ.XR_gIrhbPYbTX6P2op970kfdaJ9OP-RAuJ2UV9N6rXQ";

      return res(
        ctx.delay(300),
        ctx.cookie("token", token),
        ctx.status(201),
        ctx.json({
          meta: {
            code: 201,
            message: "Created",
          },
          data: {
            user_id: "aaaaaaaa-0010-0012-0000aaaabbbbcccc",
            email: reqBody.email,
            token,
          },
        })
      );
    }
  ),
];
