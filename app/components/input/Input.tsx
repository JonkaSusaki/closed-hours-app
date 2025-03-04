import { TextField, type TextFieldProps } from "@shopify/polaris";
import {
  type ForwardedRef,
  forwardRef,
  useId,
  useImperativeHandle,
} from "react";

function TextInput(props: TextFieldProps, ref: ForwardedRef<HTMLInputElement>) {
  const id = useId();

  useImperativeHandle(
    ref,
    () => document.getElementById(id) as HTMLInputElement,
  );

  return <TextField {...props} id={id} />;
}

const Input = forwardRef(TextInput);

export default Input;
