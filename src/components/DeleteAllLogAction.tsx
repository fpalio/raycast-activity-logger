import { Action, Icon } from "@raycast/api";

function DeleteAllLogAction(props: { onDeleteAll: () => void }) {
  return (
    <Action
      icon={Icon.Trash}
      title="Delete All Logs"
      shortcut={{ modifiers: ["ctrl"], key: "x" }}
      onAction={props.onDeleteAll}
    />
  );
}

export default DeleteAllLogAction;