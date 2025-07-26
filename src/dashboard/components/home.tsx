import { useEvents } from "../hooks";
import { LookbackChooser } from "./lookback-chooser";

export const Home = () => {
  const { data: events } = useEvents();
  return (
    <>
      <LookbackChooser />
      <ul>
        {events?.map((e) => (
          <li>{JSON.stringify(e)}</li>
        ))}
      </ul>
    </>
  );
};
