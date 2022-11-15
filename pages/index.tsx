import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";

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

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <div className={styles.container}>
      <Head>
        <title>Todo List</title>
        <meta name="description" content="Cross-platform todo list app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ul>
        {tasks.map((task, idx) => (
          <li key={idx}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}
