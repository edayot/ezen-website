import { useTranslation } from "@/dictionaries/client";
import { Input } from "@nextui-org/react";
import React from "react";
import { FiEye as EyeFilledIcon } from "react-icons/fi";
import { FiEyeOff as EyeSlashFilledIcon } from "react-icons/fi";

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
            <EyeSlashFilledIcon size={16} />
          ) : (
            <EyeFilledIcon size={16} />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      className="max-w-xs"
    />
  );
}
