import Head from "next/head";
import { FormEventHandler, useState } from "react";
import styled from "styled-components";
import { useRouteProtection } from "../hooks/use-route-protection";
import useSwr from "swr";
import { swrFetcher } from "../utils";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  content?: string;
};

export default function Home() {
  useRouteProtection();
  const { data, error, isLoading } = useSwr<{ meta: object; data: Task[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
    swrFetcher
  );

  const [newTask, setNewTask] = useState<string>("");

  const onNewTaskSave: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    alert("New task functionality to be implemented.");
  };

  if (error) return <h1>Cannot load tasks.</h1>;
  if (isLoading) return <h1>Loading...</h1>;

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
                <Link key={idx} href={`/tasks/${task.id}`}>
                  <Task>{task.title}</Task>
                </Link>
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

const Task = styled.li`
  display: block;
  width: 100%;
  padding: 10px 15px;
  background-color: lightgrey;
  margin: 10px 5px;
  border-radius: 5px;
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
