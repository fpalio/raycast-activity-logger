import { useCallback } from "react";
import { Form, Action, ActionPanel, useNavigation } from "@raycast/api";

function CreateLogForm(props: { defaultTitle?: string; onCreate: (taskCode: string, description:string, time:string) => void }) {
  const { onCreate, defaultTitle = "" } = props;
  const { pop } = useNavigation();

  const handleSubmit = useCallback(
    (values: { taskCode: string, description:string, time:string}) => {
      onCreate(values.taskCode, values.description,values.time);
      pop();
    },
    [onCreate, pop]
  );

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Logs" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
    <Form.TextField id="taskCode" defaultValue={defaultTitle} title="Task Code" />
    <Form.TextField id="description" defaultValue={defaultTitle} title="Description" />
    <Form.DatePicker
        id="time"
        title="Date of Birth"
        type={Form.DatePicker.Type.DateTime}
      />
    </Form>
 
  );
}

export default CreateLogForm;