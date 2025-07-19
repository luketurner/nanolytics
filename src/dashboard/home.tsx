import { useEvents } from "./hooks";

export const Home = () => {
  const { data: events } = useEvents();
  return (
    <ul>
      {events?.map((e) => (
        <li>{JSON.stringify(e)}</li>
      ))}
    </ul>
  );
};
