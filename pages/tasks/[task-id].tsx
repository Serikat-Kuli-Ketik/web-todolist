import Head from "next/head";
import styled from "styled-components";
import { useRouteProtection } from "../../hooks/use-route-protection";
import useSwr from "swr";
import { swrFetcher } from "../../utils";
import { useRouter } from "next/router";
import { Loading } from "../../components/loading";
import { format } from "date-fns";
import { Alarm, Repeat } from "tabler-icons-react";
import { Task } from "../../shared/types";

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

  if (isLoading) return <Loading />;

  return (
    <div>
      <Head>
        <title>Todo List</title>
        <meta name="description" content="Cross-platform todo list app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainContainer>
        <TitleContainer>
          <Title>{data?.data.title}</Title>
          <TaskStatusSelector name="task-status" id="task-status-selector">
            <option value="open">Open</option>
            <option value="open">In Progress</option>
            <option value="open">Finished</option>
          </TaskStatusSelector>
        </TitleContainer>
        <TaskContentContainer>
          <div id="content-container">
            <p className="section-title">Content</p>
            <p>{data?.data.content}</p>
          </div>
          <div id="labels-container">
            <p className="section-title">Labels</p>
            <ul>
              {data?.data.labels.map((label, idx) => (
                <TaskLabel key={idx} color={label.color}>
                  {label.title}
                </TaskLabel>
              ))}
            </ul>
          </div>
          <div id="reminders-container">
            <p className="section-title">Reminders</p>
            <TaskReminderListContainer id="reminders-list-container">
              {data?.data.reminders.map((reminder, idx) => (
                <TaskReminder key={idx}>
                  <div>
                    <Alarm id="task-alarm-icon" />
                    <div>
                      <p>
                        {format(new Date(reminder.datetime), "dd MMM yyyy")}
                      </p>
                      <p>{format(new Date(reminder.datetime), "HH:mm")}</p>
                    </div>
                  </div>
                  <div>
                    <p>
                      <Repeat size={10} /> {reminder.repeat} times every{" "}
                      {reminder.interval}s
                    </p>
                  </div>
                </TaskReminder>
              ))}
            </TaskReminderListContainer>
          </div>
        </TaskContentContainer>
      </MainContainer>
    </div>
  );
}

const MainContainer = styled.div`
  width: 50vw;
  height: fit-content;
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const TaskContentContainer = styled.div`
  display: grid;
  border-radius: 8px;
  border: 0.5px solid lightgrey;
  width: 100%;
  min-height: 300px;
  height: fit-content;
  background-color: #f5f5f5;
  padding: 20px;
  grid-template-columns: 55% 45%;
  grid-template-areas:
    "content content"
    "labels reminders";
  gap: 10px;

  #content-container {
    grid-area: content;
    min-height: 200px;
  }

  #labels-container {
    grid-area: labels;
    height: 100%;
    width: 100%;
  }

  #reminders-container {
    grid-area: reminders;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .section-title {
    border-bottom: 1px solid lightgrey;
    font-size: 0.9rem;
    font-weight: bold;
    color: #3a3b3c;
    padding-bottom: 5px;
    margin-bottom: 10px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-family: sans-serif;
`;

const TaskStatusSelector = styled.select`
  padding: 5px 10px;
  box-sizing: border-box;
  border-radius: 20px;
  color: black;
`;

type TaskLabelProp = {
  color: string;
};

const TaskLabel = styled.li<TaskLabelProp>`
  display: inline-block;
  font-size: 0.75rem;
  padding: 5px 10px;
  background-color: ${(prop) => prop.color};
  mix-blend-mode: difference;
  margin: 5px;
  border-radius: 5px;
`;

const TaskReminderListContainer = styled.div`
  max-height: 150px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TaskReminder = styled.div`
  display: inline-grid;
  width: 80%;
  border-radius: 8px;
  background-color: #dcdcdc;
  padding: 10px;
  font-size: 0.65rem;
  align-items: center;
  grid-template-columns: 60% 10% 30%;
  grid-template-areas: "reminder-date . repeat-notice";
  margin: 5px 0;

  p {
    margin: 5px 0;
  }

  #task-alarm-icon {
    margin: 0 10px;
  }

  div:first-child {
    display: inline-flex;
    align-items: center;
    grid-area: reminder-date;
  }

  > div:nth-child(2) {
    font-size: 0.6rem;
    grid-area: repeat-notice;
  }
`;
