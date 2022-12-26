import Head from "next/head";
import styled from "styled-components";
import { useRouteProtection } from "../../hooks/use-route-protection";
import useSwr from "swr";
import { swrFetcher } from "../../utils";
import { useRouter } from "next/router";
import { Loading } from "../../components/loading";
import { format } from "date-fns";
import { Alarm, Edit, Repeat, DeviceFloppy, Plus } from "tabler-icons-react";
import { APIResponse, Task, TaskLabel, TaskStatus } from "../../shared/types";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { LabelSelectorModal } from "../../components/label-selector";
import Color from "color";

export default function TaskDetail() {
  useRouteProtection();
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSwr<APIResponse<Task>>(
    router.isReady
      ? `${process.env.NEXT_PUBLIC_API_URL}/tasks/${router.query["task-id"]}`
      : null,
    swrFetcher
  );

  const taskStatusRef = useRef<HTMLSelectElement>(null);
  const taskContentRef = useRef<HTMLTextAreaElement>(null);

  const [taskStatus, setTaskStatus] = useState(data?.data.status);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<null | "label" | "reminder">(
    null
  );

  useEffect(() => {
    setTaskStatus(data?.data.status);
  }, [data]);

  const handleTaskStatusChange: ChangeEventHandler = async () => {
    if (taskStatusRef.current === null) {
      toast("Cannot update task's status, try again in a few minutes.", {
        type: "error",
      });

      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks/${router.query["task-id"]}`,
      {
        method: "PUT",
        body: JSON.stringify({ status: taskStatusRef.current.value }),
      }
    );

    if (!response.ok) {
      toast("Cannot update task's status, try again in a few minutes.", {
        type: "error",
      });
      taskStatusRef.current.value = taskStatus ?? "";

      return;
    }

    mutate();
    setTaskStatus(taskStatusRef.current.value as TaskStatus);
  };

  const handleSaveNewContent = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks/${router.query["task-id"]}`,
      {
        method: "PUT",
        body: JSON.stringify({ content: taskContentRef.current?.value }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      toast("Failed updating task content.", { type: "error" });
      mutate();
      return;
    }

    toast("Success updating task content.", { type: "success" });
    setIsEditingContent(false);
    mutate();
  };

  const handleAddNewLabel = async (newLabel: TaskLabel) => {
    setIsModalOpen("label");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks/${router.query["task-id"]}`,
      {
        method: "PUT",
        body: JSON.stringify({
          labels: [...(data?.data.labels ?? []), newLabel] as Task["labels"],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      toast("Failed updating task's label, try again in a moment.", {
        type: "error",
      });
      return;
    }

    mutate();
    toast("Added new label.", { type: "success" });
  };

  if (error) {
    return <h1>Task with ID {router.query["task-id"]} cannot be found.</h1>;
  }

  if (isLoading) return <Loading />;

  const ReminderModal = Modal;

  return (
    <div>
      <Head>
        <title>Todo List</title>
        <meta name="description" content="Cross-platform todo list app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LabelSelectorModal
        isOpen={isModalOpen === "label"}
        onSelect={(label) => {
          handleAddNewLabel(label);
          setIsModalOpen(null);
        }}
      />

      <ReminderModal isOpen={isModalOpen === "reminder"}>
        <h1>Reminder Modal</h1>
      </ReminderModal>

      <MainContainer>
        <TitleContainer>
          <Title>{data?.data.title}</Title>
          <StatusSelector
            name="task-status"
            id="task-status-selector"
            defaultValue={data?.data.status}
            onChange={handleTaskStatusChange}
            ref={taskStatusRef}
          >
            {Object.values(TaskStatus).map((status, idx) => (
              <option key={idx} value={status}>
                {status}
              </option>
            ))}
          </StatusSelector>
        </TitleContainer>
        <DetailsContainer>
          <div id="content-container">
            <SectionTitle>
              <p>Content</p>
              {isEditingContent ? (
                <TaskContentSaveBtn onClick={handleSaveNewContent}>
                  <DeviceFloppy size={15} /> Save
                </TaskContentSaveBtn>
              ) : (
                <Edit
                  size={18}
                  cursor="pointer"
                  onClick={() => setIsEditingContent(true)}
                />
              )}
            </SectionTitle>
            <ContentInnerContainer>
              {data?.data && !isEditingContent ? (
                <Content>{data?.data.content}</Content>
              ) : null}
              {data?.data && isEditingContent ? (
                <ContentTextarea ref={taskContentRef}>
                  {data?.data.content}
                </ContentTextarea>
              ) : null}
            </ContentInnerContainer>
          </div>

          <div id="labels-container">
            <SectionTitle>
              <p>Labels</p>
              <Plus
                size={18}
                cursor="pointer"
                onClick={() => setIsModalOpen("label")}
              />
            </SectionTitle>
            {data?.data.labels ? (
              <ul>
                {data?.data.labels.map((label, idx) => (
                  <LabelItem
                    key={idx}
                    bgColor={label.color}
                    textColor={Color(label.color).isLight() ? "black" : "white"}
                  >
                    {label.title}
                  </LabelItem>
                ))}
              </ul>
            ) : null}
          </div>

          <div id="reminders-container">
            <SectionTitle>
              <p>Reminders</p>
              <Plus size={18} cursor="pointer" />
            </SectionTitle>
            {data?.data.reminders ? (
              <ReminderListContainer id="reminders-list-container">
                {data?.data.reminders.map((reminder, idx) => (
                  <ReminderItem key={idx}>
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
                  </ReminderItem>
                ))}
              </ReminderListContainer>
            ) : null}
          </div>
        </DetailsContainer>
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

const DetailsContainer = styled.div`
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
  gap: 40px 0;
  box-sizing: border-box;

  #content-container {
    grid-area: content;
  }

  #labels-container {
    grid-area: labels;
    height: 100%;
    width: 100%;
    padding: 0 10px;
  }

  #reminders-container {
    grid-area: reminders;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
  }
`;

const ContentInnerContainer = styled.div`
  max-height: 200px;
  overflow-y: scroll;
`;

const SectionTitle = styled.div`
  border-bottom: 1px solid lightgrey;
  font-size: 0.9rem;
  font-weight: bold;
  color: #3a3b3c;
  padding-bottom: 5px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const StatusSelector = styled.select`
  padding: 5px 10px;
  box-sizing: border-box;
  border-radius: 20px;
  color: black;
`;

const Content = styled.p`
  font-size: 0.8rem;
`;

const TaskContentSaveBtn = styled.button`
  display: flex;
  align-items: center;
  padding: 3px 5px;
  font-size: 0.7rem;
  cursor: pointer;
  border: 1px solid lightgrey;
  border-radius: 6px;
  transition: all 0.2s;

  :hover {
    border: 1px solid black;
    transition: all 0.2s;
  }
`;

const ContentTextarea = styled.textarea`
  width: 100%;
  height: 300px;
  padding: 10px;
  border: 0.5px solid lightgrey;
  border-radius: 6px;
`;

type LabelItemProp = {
  bgColor: string;
  textColor: string;
};

const LabelItem = styled.li<LabelItemProp>`
  display: inline-block;
  font-size: 0.75rem;
  padding: 5px 10px;
  background-color: ${(prop) => prop.bgColor};
  color: ${(prop) => prop.textColor};
  margin: 5px;
  border-radius: 5px;
`;

const ReminderListContainer = styled.div`
  max-height: 150px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ReminderItem = styled.div`
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
