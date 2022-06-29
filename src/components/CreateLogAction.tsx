import { Action, Icon } from "@raycast/api";
import { Log } from "../types";
import CreateLogForm from "./CreateLogForm";

function CreateLogAction(props: { defaultTitle?: string; onCreate: (taskCode: string, description:string, time:string) => void }) {
  return (
    <Action.Push
      icon={Icon.Pencil}
      title="Create Log"
      shortcut={{ modifiers: ["cmd"], key: "n" }}
      target={<CreateLogForm defaultTitle={props.defaultTitle} onCreate={props.onCreate} />}
    />
  );
}

export default CreateLogAction;