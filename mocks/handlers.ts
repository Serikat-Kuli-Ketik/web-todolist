import { rest, setupWorker } from "msw";

export const handlers: Parameters<typeof setupWorker> = [
  rest.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, (req, res, ctx) => {
    return res(
      ctx.json({
        meta: {
          code: 200,
          message: "OK",
        },
        data: [
          {
            id: "aaaaaaaa-0010-0012-1100aaaabbbbccca",
            title: "Turu ...",
            status: "Open",
            labels: [
              {
                id: "aaaaaaaa-0010-0012-1100aaaabbbbccca",
                title: "Backlog",
                color: "#8C8C8C",
              },
            ],
            nearest_reminder: {
              id: "aaaaaaaa-0010-0012-1010aaaabbbbccca",
              datetime: "2022-11-26 13:59:59",
              repeat: 3,
              interval: 300,
            },
            created_at: "2022-11-21 13:59:59",
            updated_at: "2022-11-22 13:59:59",
          },
          {
            id: "sundul-gan",
            title: "Sundul gan",
            status: "Completed",
            labels: [
              {
                id: "labellsz",
                title: "Chore",
                color: "#ff0",
              },
            ],
            created_at: "2022-11-21 13:59:59",
            updated_at: "2022-11-22 13:59:59",
          },
        ],
      })
    );
  }),
  rest.get("https://my.backend/book", (_req, res, ctx) => {
    return res(
      ctx.json({
        title: "Lord of the Rings",
        imageUrl: "/book-cover.jpg",
        description:
          "The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.",
      })
    );
  }),
  rest.get("/reviews", (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: "60333292-7ca1-4361-bf38-b6b43b90cb16",
          author: "John Maverick",
          text: "Lord of The Rings, is with no absolute hesitation, my most favored and adored book by‑far. The trilogy is wonderful‑ and I really consider this a legendary fantasy series. It will always keep you at the edge of your seat‑ and the characters you will grow and fall in love with!",
        },
      ])
    );
  }),
];
