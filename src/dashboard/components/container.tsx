export const Container: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return <div className="max-w-5xl m-auto mt-4 mb-4">{children}</div>;
};
