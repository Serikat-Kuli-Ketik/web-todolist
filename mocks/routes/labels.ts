import { rest, setupWorker } from "msw";
import { Task, TaskLabel, TaskStatus } from "../../shared/types";
import { v4 as uuidv4 } from "uuid";

const labelsStore: TaskLabel[] = [
  {
    id: "aaaaaaaa-0010-0012-1100aaaabbbbccca",
    title: "Backlog",
    color: "#dfdfdf",
  },
  {
    id: "sundul-gan",
    title: "Sundul gan",
    color: "#ffff00",
  },
  {
    id: "frostbite",
    title: "Chore",
    color: "#f62dae",
  },
  {
    id: "indigo",
    title: "Sports",
    color: "#470063",
  },
  {
    id: "black-coffee",
    title: "Health",
    color: "#443742",
  },
  {
    id: "work",
    title: "Work",
    color: "#B97375",
  },
  {
    id: "relationship",
    title: "Relationship",
    color: "#3772FF",
  },
  {
    id: "religion",
    title: "Religion",
    color: "#7A8450",
  },
  {
    id: "community",
    title: "Community",
    color: "#30C5FF",
  },
  {
    id: "financial",
    title: "Financial",
    color: "#7DCFB6",
  },
];

export const handlers: Parameters<typeof setupWorker> = [
  rest.get(`${process.env.NEXT_PUBLIC_API_URL}/labels`, (req, res, ctx) => {
    return res(
      ctx.delay(500),
      ctx.json({
        meta: {
          code: 200,
          message: "OK",
        },
        data: labelsStore,
      })
    );
  }),

  rest.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const targetTaskIdx = labelsStore.findIndex((task) => task.id === id);

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
        data: labelsStore[targetTaskIdx],
      })
    );
  }),

  rest.post(
    `${process.env.NEXT_PUBLIC_API_URL}/labels`,
    async (req, res, ctx) => {
      const reqBody = (await req.json()) as Partial<TaskLabel>;

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

      const newLabel: TaskLabel = {
        id: uuidv4(),
        title: reqBody.title,
        color: reqBody.color ?? "#000",
      };

      labelsStore.push(newLabel);

      return res(
        ctx.delay(201),
        ctx.json({
          meta: {
            code: 201,
            message: "Created",
          },
          data: {
            id: newLabel.id,
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
      const targetTaskIdx = labelsStore.findIndex((task) => task.id === id);

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
        ...labelsStore[targetTaskIdx],
        ...reqBody,
      };

      labelsStore[targetTaskIdx] = targetTask;
      return res(ctx.status(204));
    }
  ),

  rest.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/labels/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      const targetLabelIdx = labelsStore.findIndex((task) => task.id === id);

      if (targetLabelIdx === -1) {
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

      labelsStore.splice(targetLabelIdx, 1);
      return res(ctx.status(204));
    }
  ),
];
