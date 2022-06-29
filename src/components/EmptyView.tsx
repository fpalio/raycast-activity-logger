import { ActionPanel, List } from "@raycast/api";
import { Filter, Log } from "../types";
import CreateLogAction from "./CreateLogAction";

function EmptyView(props: { logs: Log[]; filter: Filter; searchText: string; onCreate: (taskCode: string, description:string, time:string) => void }) {
  if (props.logs.length > 0) {
    return (
      <List.EmptyView
        icon="😕"
        title="No matching logs found"
        description={`Can't find a todo matching ${props.searchText}.\nCreate it now!`}
        actions={
          <ActionPanel>
            <CreateLogAction defaultTitle={props.searchText} onCreate={props.onCreate} />
          </ActionPanel>
        }
      />
    );
  }
  switch (props.filter) {
    case Filter.Open: {
      return (
        <List.EmptyView
          icon="⏳"
          title="To be Logged"
          description="All Logs to be logged - way to go! Why not work some more?"
          actions={
            <ActionPanel>
              <CreateLogAction defaultTitle={props.searchText} onCreate={props.onCreate} />
            </ActionPanel>
          }
        />
      );
    }
    case Filter.Logged: {
      return (
        <List.EmptyView
          icon="😢"
          title="No Entries Logged"
          description="Uh-oh, looks like you haven't completed any work, get back to work!"
        />
      );
    }
    case Filter.All:
    default: {
      return (
        <List.EmptyView
          icon="📝"
          title="No logs found"
          description="You have not done any work yet. Why not get to it?"
          actions={
            <ActionPanel>
              <CreateLogAction defaultTitle={props.searchText} onCreate={props.onCreate} />
            </ActionPanel>
          }
        />
      );
    }
  }
}
export default EmptyView;