import { TextField } from "@mui/material";
import { FC, useCallback, useContext, useState } from "react";
import { AppContext } from "../App/App";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface AddPointDialogProps extends BaseDialogProps {
  matchId: string;
  playerId: string;
}

export const AddPointDialog: FC<AddPointDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
  matchId,
  playerId,
}: AddPointDialogProps) => {
  const { requests } = useContext(AppContext);
  const [pointValue, setPointValue] = useState<number>(1);

  const resetForm = () => setPointValue(1);

  const addValueToPoint = useCallback(() => {
    requests.addValueToPointRequest({ id: matchId, auxId: playerId, requestBody: pointValue }, (_: any) => {
      handleReload();
      closeDialog();
      resetForm();
    });
  }, [matchId, playerId, pointValue]);

  return (
    <DialogBase
      title={"Add point"}
      open={dialogIsOpen}
      doAction={{ name: "Add", handle: addValueToPoint }}
      handleClose={() => {
        closeDialog();
        resetForm();
      }}
    >
      <TextField
        type="number"
        label={"PointValue"}
        required
        value={pointValue}
        onChange={(event) => {
          const number = Number(event.currentTarget.value);
          setPointValue(number < 1 ? 1 : number);
        }}
      />
    </DialogBase>
  );
};
