import { useMask } from "@react-input/mask";
import Input from "./Input";
import { type TextFieldProps } from "@shopify/polaris";

type Props = Partial<TextFieldProps> & {
  label: string;
  value: string;
  setValue: (value: string) => void;
};

export default function TimeInput({ label, value, setValue, ...props }: Props) {
  const inputRef = useMask({ mask: "__:__", replacement: { _: /\d/ } });

  return (
    <Input
      ref={inputRef}
      label={label}
      value={value}
      onChange={(value) => setValue(value)}
      autoComplete={props.autoComplete || "off"}
      placeholder="hh:mm"
      {...props}
    />
  );
}
