import Head from "next/head";
import styled from "styled-components";
import { useRouteProtection } from "../../hooks/use-route-protection";
import useSwr from "swr";
import { swrFetcher } from "../../utils";
import { useRouter } from "next/router";

type Task = {
  id: string;
  title: string;
  content?: string;
};

export default function TaskDetail() {
  useRouteProtection();
  const router = useRouter();
  const { data, error, isLoading } = useSwr<{ meta: object; data: Task }>(
    router.isReady
      ? `${process.env.NEXT_PUBLIC_API_URL}/tasks/${router.query["task-id"]}`
      : null,
    swrFetcher
  );

  if (error) {
    return <h1>Task with ID {router.query["task-id"]} cannot be found.</h1>;
  }

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
          <Task>{data?.data.title}</Task>
        </TasksContainer>
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
