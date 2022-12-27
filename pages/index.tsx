import Head from "next/head";
import { FormEventHandler, useState } from "react";
import styled from "styled-components";
import { useRouteProtection } from "../hooks/use-route-protection";
import useSwr from "swr";
import { swrFetcher } from "../utils";
import Link from "next/link";
import { Loading } from "../components/loading";
import { APIResponse, Task, TaskStatus } from "../shared/types";
import {
  X as XIcon,
  Check as CheckIcon,
  Plus,
  DeviceFloppy,
  Logout,
} from "tabler-icons-react";
import { toast } from "react-toastify";
import { useUserStore } from "../stores/user.store";
import Router from "next/router";

export default function Home() {
  useRouteProtection();
  const deleteSession = useUserStore((state) => state.delete);
  const { data, error, isLoading, mutate } = useSwr<APIResponse<Task[]>>(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
    swrFetcher
  );

  const tasksToDisplay = data?.data.sort((a) => {
    if (a.status === TaskStatus.COMPLETED) return 1;
    return -1;
  });

  const [newTask, setNewTask] = useState<string>("");
  const [displayNewTaskForm, setDisplayNewTaskForm] = useState(false);

  const handleTaskSave = async () => {
    if (newTask === "") {
      toast("Enter task title please.", { type: "error" });
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
      method: "POST",
      body: JSON.stringify({ title: newTask }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast("Failed creating new task, try again later.", { type: "error" });
      return;
    }

    mutate();
    setNewTask("");
    toast("Success creating new task.", { type: "success" });
    setDisplayNewTaskForm(false);
  };

  const handleTaskDelete = async (taskId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      toast("Failed deleting task, try again later.", { type: "error" });
      return;
    }

    mutate();
    toast("Success deleting task.", { type: "success" });
  };

  const handleTaskChecking = async (taskId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
      { method: "PUT", body: JSON.stringify({ status: TaskStatus.COMPLETED }) }
    );

    if (!response.ok) {
      toast("Failed updating task, try again in a few minutes.", {
        type: "error",
      });
      return;
    }

    mutate();
    toast("Task completed", { type: "success" });
  };

  const handleSignOut = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-out`
    );

    if (!response.ok) {
      toast("Cannot sign out, try again in a moment.", { type: "error" });
      return;
    }

    deleteSession();
    Router.replace("/auth/sign-in");
  };

  if (error) return <h1>Cannot load tasks.</h1>;
  if (isLoading) return <Loading />;

  return (
    <div>
      <Head>
        <title>Tasks | CheckList</title>
      </Head>

      <MainContainer>
        <PageTitleContainer>
          <PageTitle>Tasks</PageTitle>
          {displayNewTaskForm ? (
            <div>
              <NewTaskInput
                type="text"
                placeholder="Task title"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <DeviceFloppy
                size={30}
                cursor="pointer"
                className="new-task-btn"
                onClick={handleTaskSave}
              />
              <XIcon
                size={30}
                cursor="pointer"
                className="new-task-btn"
                onClick={() => setDisplayNewTaskForm(false)}
              />
            </div>
          ) : (
            <Plus
              className="new-task-btn"
              cursor="pointer"
              size={30}
              onClick={() => setDisplayNewTaskForm(true)}
            />
          )}
        </PageTitleContainer>

        <TasksContainer>
          {tasksToDisplay
            ? tasksToDisplay.map((task, idx) => {
                const taskBg =
                  task.status === TaskStatus.COMPLETED ? "#f5f5f5" : undefined;

                return (
                  <TaskItem
                    key={idx}
                    bgColor={taskBg}
                    bold={task.status === TaskStatus.COMPLETED ? false : true}
                  >
                    <Link href={`/tasks/${task.id}`}>
                      {task.status !== TaskStatus.COMPLETED ? (
                        <p>{task.title}</p>
                      ) : (
                        <p>
                          <s>{task.title}</s>
                        </p>
                      )}
                    </Link>
                    {task.status !== TaskStatus.COMPLETED && (
                      <div className="task-actions">
                        <XIcon
                          className="task-delete-btn"
                          size={18}
                          onClick={() => handleTaskDelete(task.id)}
                          cursor="pointer"
                        />
                        <CheckIcon
                          className="task-check-btn"
                          size={18}
                          onClick={() => handleTaskChecking(task.id)}
                          cursor="pointer"
                        />
                      </div>
                    )}
                  </TaskItem>
                );
              })
            : null}
        </TasksContainer>
        <SignoutButton onClick={handleSignOut}>
          Sign out <Logout size={20} />
        </SignoutButton>
      </MainContainer>
    </div>
  );
}

const MainContainer = styled.div`
  width: 500px;
  height: fit-content;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const PageTitleContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;

  > div {
    display: flex;
    align-items: center;
  }

  .new-task-btn {
    margin-left: 5px;
    padding: 5px;
    border: 0.5px solid lightgrey;
    border-radius: 8px;
    transition: all 0.2s;
    font-size: 0.8rem;

    :hover {
      background-color: black;
      color: white;
    }

    :active {
      transform: scale(0.95);
    }
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-family: sans-serif;
`;

const TasksContainer = styled.ul`
  width: 100%;
  margin: 20px 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TaskItem = styled.li<{ bgColor?: string; bold?: boolean }>`
  margin: 0 auto;
  display: flex;
  width: 100%;
  padding: 10px 15px;
  background-color: ${(props) => props.bgColor ?? "lightgrey"};
  margin: 5px;
  border-radius: 5px;
  align-items: center;
  justify-content: space-between;
  font-weight: ${(props) => (props.bold ? "600" : "400")};

  p {
    font-size: 0.9rem;
  }

  .task-actions > * {
    margin: 0 2px;
  }

  .task-delete-btn,
  .task-check-btn {
    border-radius: 50%;
    transition: all 0.2s;

    :hover {
      background-color: darkgrey;
      transition: all 0.2s;
    }

    :active {
      background-color: black;
      color: white;
      transition: all 0.2s;
    }
  }
`;

const NewTaskForm = styled.form`
  align-self: flex-start;
`;

const NewTaskInput = styled.input`
  margin: 0 5px;
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid grey;
`;

const SignoutButton = styled.button`
  align-self: flex-end;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  width: 95px;
  justify-content: space-between;
  border-radius: 8px;
  background-color: transparent;
  border: 1px solid white;
  opacity: 0.7;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;

  :hover {
    opacity: 1;
    border: 1px solid lightgrey;
  }

  :active {
    transform: scale(0.95);
    background-color: black;
    color: white;
  }
`;
