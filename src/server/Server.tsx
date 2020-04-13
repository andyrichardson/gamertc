import { useServer } from "../context";
import { useMemo } from "preact/hooks";
import { Fragment, h } from "preact";

export const Server = () => {
  const { id, connected, connections } = useServer();

  const content = useMemo(() => {
    if (!connected) {
      return <h2>Setting up game</h2>;
    }

    return (
      <Fragment>
        <h2>Game set up with ID "{id}"</h2>
        <h3>Users</h3>
        {Object.keys(connections)}
      </Fragment>
    );
  }, [connections, connected, id]);

  return (
    <Fragment>
      <h1>Server</h1>
      {content}
    </Fragment>
  );
};
