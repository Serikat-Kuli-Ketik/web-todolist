import Head from "next/head";
import { FormEventHandler, useState } from "react";
import styled from "styled-components";
import { useRouteProtection } from "../hooks/use-route-protection";
import useSwr from "swr";
import { swrFetcher } from "../utils";
import Link from "next/link";
import { Loading } from "../components/loading";
import { APIResponse, Task } from "../shared/types";
import { X as XIcon } from "tabler-icons-react";

export default function Home() {
  useRouteProtection();
  const { data, error, isLoading, mutate } = useSwr<APIResponse<Task[]>>(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
    swrFetcher
  );

  const [newTask, setNewTask] = useState<string>("");

  const onNewTaskSave: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    alert("New task functionality to be implemented.");
  };

  const handleTaskDelete = async (taskId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      alert("Failed deleting task, try again later.");
      return;
    }

    mutate();
  };

  if (error) return <h1>Cannot load tasks.</h1>;
  if (isLoading) return <Loading />;

  return (
    <div>
      <Head>
        <title>Todo List</title>
        <meta name="description" content="Cross-platform todo list app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainContainer>
        <Title>Tasks</Title>

        <TasksContainer>
          {data &&
            data.data.map((task, idx) => {
              return (
                <TaskItem key={idx}>
                  <Link href={`/tasks/${task.id}`}>
                    <p>{task.title} </p>
                  </Link>
                  <XIcon
                    className="task-delete-btn"
                    size={15}
                    onClick={() => handleTaskDelete(task.id)}
                    cursor="pointer"
                  />
                </TaskItem>
              );
            })}
        </TasksContainer>

        <NewTaskForm onSubmit={onNewTaskSave}>
          <NewTaskInput
            type="text"
            placeholder="Insert new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <NewTaskSubmit type="submit" value="Save" />
        </NewTaskForm>
      </MainContainer>
    </div>
  );
}

const MainContainer = styled.div`
  width: 100vh;
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
  /* background-color: red; */
`;

const Title = styled.h1`
  font-size: 2rem;
  font-family: sans-serif;
`;

const TasksContainer = styled.ul`
  width: 100%;
  padding: 0;
`;

const TaskItem = styled.li`
  display: flex;
  width: 100%;
  padding: 10px 15px;
  background-color: lightgrey;
  margin: 10px 5px;
  border-radius: 5px;
  align-items: center;
  justify-content: space-between;

  .task-delete-btn {
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
  margin: 0 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid grey;
`;

const NewTaskSubmit = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid lightgrey;
`;
