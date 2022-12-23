import Head from "next/head";
import { FormEventHandler, useState } from "react";
import styled from "styled-components";
import { useRouteProtection } from "../hooks/use-route-protection";

type Task = {
  id: string;
  title: string;
  content?: string;
};

const initialTasks: Task[] = [
  {
    id: "79687798-5282-4c7b-86d1-475e13a0290a",
    title: "Buy Milk",
    content: "Frisian flag 60L",
  },
  {
    id: "f9044e81-9fb2-4dd5-ad51-036405227369",
    title: "Go for a walk",
  },
  {
    id: "cce7e7cc-d542-429b-bcee-32444dd9eada",
    title: "Work on thesis draft",
    content: "See the revision log at https://google.com",
  },
];

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

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState<string>("");
  useRouteProtection();

  const onNewTaskSave: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (newTask === undefined || newTask === "") return;
    setTasks([...tasks, { id: "hehe", title: newTask }]);
    setNewTask("");
  };

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
          {tasks.map((task, idx) => (
            <Task key={idx}>{task.title}</Task>
          ))}
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
