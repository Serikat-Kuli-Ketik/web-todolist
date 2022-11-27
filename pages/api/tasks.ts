import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    url: "/api/tasks",
    method: "GET",
    code: 200,
    response: {
      data: [
        {
          id: "aaaaaaaa-0010-0012-0010aaaabbbbccca",
          title: "Turu ...",
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
      ],
    },
  });
}
