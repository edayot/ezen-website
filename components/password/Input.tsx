import React from "react";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "./EyeIcon";
import { EyeSlashFilledIcon } from "./EyeSlashIcon";
import { useTranslation } from "@/dictionaries/client";

export function PasswordInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const t = useTranslation();

  return (
    <Input
      label={t["auth.login.password"]}
      value={value}
      onValueChange={onChange}
      variant="bordered"
      placeholder={t["auth.login.password_placeholder"]}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
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
