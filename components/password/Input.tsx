import React from "react";
import {Input} from "@nextui-org/react";
import {EyeFilledIcon} from "./EyeIcon";
import {EyeSlashFilledIcon} from "./EyeSlashIcon";

export function PasswordInput({value, onChange}: {value: string, onChange: (value: string) => void}) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      label="Password"
        value={value}
        onValueChange={onChange}
      variant="bordered"
      placeholder="Enter your password"
      endContent={
        <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
          {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      className="max-w-xs"
    />
  );
}
