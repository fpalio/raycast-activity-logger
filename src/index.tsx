import { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { ActionPanel, Clipboard, Icon, List, LocalStorage, showToast } from "@raycast/api";
import { Filter, Log } from "./types";
import { CreateLogAction, DeleteAllLogAction, DeleteLogAction, EmptyView, ToggleLogAction } from "./components";

type State = {
  filter: Filter;
  isLoading: boolean;
  searchText: string;
  logs: Log[];
  visibleLogs: Log[];
};

export default function Command() {
  const [state, setState] = useState<State>({
    filter: Filter.All,
    isLoading: true,
    searchText: "",
    logs: [],
    visibleLogs: [],
  });

  useEffect(() => {
    (async () => {
      const storedLogs = await LocalStorage.getItem<string>("logs-demo");

      if (!storedLogs) {
        setState((previous) => ({ ...previous, isLoading: false }));
        return;
      }

      try {
        const logs: Log[] = JSON.parse(storedLogs);
        setState((previous) => ({ ...previous, logs: logs, isLoading: false }));
      } catch (e) {
        // can't decode logs
        setState((previous) => ({ ...previous, logs: [], isLoading: false }));
      }
    })();
  }, []);

  useEffect(() => {
    LocalStorage.setItem("logs-demo", JSON.stringify(state.logs));
  }, [state.logs]);

  const handleCreate = useCallback(
    (taskCode: string, description:string, time:string) => {
      const newLogs = [...state.logs, { id: nanoid(), taskCode, description, time, logged:false}];
      setState((previous) => ({ ...previous, logs: newLogs, filter: Filter.All, searchText: "" }));
    },
    [state.logs, setState]
  );

  const handleToggle = useCallback(
    async (index: number) => {
      const newTodos = [...state.logs];
      newTodos[index].logged = !newTodos[index].logged;
      const clipboardString = "Task: "+ newTodos[index].taskCode + "\n" 
                              + "Description: " + newTodos[index].description;
      await Clipboard.copy(clipboardString);
      await showToast({ 
        title: "Task: " + newTodos[index].taskCode , 
        message: "Copied to clipboard!" 
      });
      setState((previous) => ({ ...previous, todos: newTodos }));
    },
    [state.logs, setState]
  );

  const handleDelete = useCallback(
    (index: number) => {
      const newLogs = [...state.logs];
      newLogs.splice(index, 1);
      setState((previous) => ({ ...previous, logs: newLogs }));
    },
    [state.logs, setState]
  );

  const handleDeleteAll = useCallback(
    () => {
      setState((previous) => ({ ...previous, logs: [] }));
    },
    [state.logs, setState]
  );
  const filterLogs = useCallback(() => {
    if (state.filter === Filter.Open) {
      return state.logs.filter((log) => !log.logged);
    }
    if (state.filter === Filter.Logged) {
      return state.logs.filter((log) => log.logged);
    }
    return state.logs;
  }, [state.logs, state.filter]);

  return (
    <List
      isLoading={state.isLoading}
      searchText={state.searchText}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Log List"
          value={state.filter}
          onChange={(newValue) => setState((previous) => ({ ...previous, filter: newValue as Filter }))}
        >
          <List.Dropdown.Item title="All" value={Filter.All} />
          <List.Dropdown.Item title="Open" value={Filter.Open} />
          <List.Dropdown.Item title="Logged" value={Filter.Logged} />
        </List.Dropdown>
      }
      enableFiltering
      onSearchTextChange={(newValue) => {
        setState((previous) => ({ ...previous, searchText: newValue }));
      }}
    >
      <EmptyView filter={state.filter} logs={filterLogs()} searchText={state.searchText} onCreate={handleCreate} />
      {filterLogs().map((log, index) => (
        <List.Item
          key={log.id}
          icon={log.logged ? Icon.Checkmark : Icon.Circle}
          title={log.taskCode}
          subtitle={log.description + ' @' + log.time}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <ToggleLogAction log={log} onToggle={() => handleToggle(index)} />
              </ActionPanel.Section>
              <ActionPanel.Section>
                <CreateLogAction onCreate={handleCreate} />
                <DeleteLogAction onDelete={() => handleDelete(index)} />
                <DeleteAllLogAction onDeleteAll={() => handleDeleteAll()} />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}