import ScaleLoader from "react-spinners/ScaleLoader";

export const Loading: React.FC = () => {
  return (
    <ScaleLoader
      color="darkgrey"
      cssOverride={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};
