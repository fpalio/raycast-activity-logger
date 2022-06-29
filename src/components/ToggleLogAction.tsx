import { Action } from "@raycast/api";
import { Log } from "../types";

function ToggleLogAction(props: { log: Log; onToggle: () => void }) {
  return (
    <Action
      title={props.log.taskCode}
      onAction={props.onToggle}
    />
  );
}

export default ToggleLogAction;