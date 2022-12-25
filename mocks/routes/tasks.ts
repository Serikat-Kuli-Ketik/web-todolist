import { rest, setupWorker } from "msw";
import { Task, TaskStatus } from "../../shared/types";
import { v4 as uuidv4 } from "uuid";

const initialTasks: Task[] = [
  {
    id: "aaaaaaaa-0010-0012-1100aaaabbbbccca",
    title: "Turaw ...",
    status: TaskStatus.OPEN,
    labels: [
      {
        id: "aaaaaaaa-0010-0012-1100aaaabbbbccca",
        title: "Backlog",
        color: "#8C8C8C",
      },
    ],
    reminders: [
      {
        id: "aaaaaaaa-0010-0012-1010aaaabbbbccca",
        datetime: "2022-11-26 13:59:59",
        repeat: 3,
        interval: 300,
      },
    ],
    created_at: "2022-11-21 13:59:59",
    updated_at: "2022-11-22 13:59:59",
  },
  {
    id: "sundul-gan",
    title: "Sundul gan",
    status: TaskStatus.COMPLETED,
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
];

export const handlers: Parameters<typeof setupWorker> = [
  rest.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, (req, res, ctx) => {
    return res(
      ctx.delay(500),
      ctx.json({
        meta: {
          code: 200,
          message: "OK",
        },
        data: initialTasks,
      })
    );
  }),

  rest.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const targetTaskIdx = initialTasks.findIndex((task) => task.id === id);

    if (targetTaskIdx === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          meta: {
            code: 404,
            message: "Not Found",
          },
        })
      );
    }

    return res(
      ctx.delay(400),
      ctx.json({
        meta: {
          code: 200,
          message: "OK",
        },
        data: initialTasks[targetTaskIdx],
      })
    );
  }),

  rest.post(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
    async (req, res, ctx) => {
      const reqBody = (await req.json()) as Partial<Task>;

      if (!reqBody.title) {
        return res(
          ctx.status(400),
          ctx.json({
            meta: {
              code: 400,
              message: "Bad Request",
            },
            errors: [
              {
                title: ["title can't be empty"],
              },
            ],
          })
        );
      }

      const newTask: Task = {
        id: uuidv4(),
        title: reqBody.title,
        status: TaskStatus.OPEN,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      initialTasks.push(newTask);

      return res(
        ctx.delay(201),
        ctx.json({
          meta: {
            code: 201,
            message: "Created",
          },
          data: {
            id: newTask.id,
          },
        })
      );
    }
  ),

  rest.put(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/:id`,
    async (req, res, ctx) => {
      const { id } = req.params;
      const reqBody = (await req.json()) as Partial<Task>;
      const targetTaskIdx = initialTasks.findIndex((task) => task.id === id);

      if (targetTaskIdx === -1) {
        return res(
          ctx.status(404),
          ctx.json({
            meta: {
              code: 404,
              message: "Not Found",
            },
          })
        );
      }

      const targetTask = {
        ...initialTasks[targetTaskIdx],
        ...reqBody,
      };

      initialTasks[targetTaskIdx] = targetTask;
      return res(ctx.status(204));
    }
  ),

  rest.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      const targetTaskIdx = initialTasks.findIndex((task) => task.id === id);

      if (targetTaskIdx === -1) {
        return res(
          ctx.status(404),
          ctx.json({
            meta: {
              code: 404,
              message: "Not Found",
            },
          })
        );
      }

      initialTasks.splice(targetTaskIdx, 1);
      return res(ctx.status(204));
    }
  ),
];
