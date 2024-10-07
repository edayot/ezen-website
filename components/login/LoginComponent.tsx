"use client";

import { PasswordInput } from "@/components/password/Input";
import { useTranslation } from "@/dictionaries/client";
import { signInEmailPassword } from "@/utils/firebase";
import { Button, Input } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";
import { Bounce, toast } from "react-toastify";

export function LoginComponent() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { theme } = useTheme();

  const toastError = (message: string) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Bounce,
      theme: theme,
    });
  };

  const router = useRouter();

  const onLogin = async () => {
    if (!email || !password) {
      toastError("Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      toastError("Invalid email");
      return;
    }
    setLoading(true);
    try {
      let [res, err] = await signInEmailPassword(email, password);

      if (err) {
        toastError(err);
        setLoading(false);
      } else if (res) {
        toastError("");
        router.push("/");
      } else {
        toastError("An error occurred");
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      toastError("An error occurred");
      setLoading(false);
    }
  };
  const t = useTranslation();

  return (
    <div className="flex flex-col gap-4 items-center align-middle">
      <h1>{t["auth.login.title"]}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin();
        }}
        className="flex flex-col gap-4 items-center align-middle w-full"
      >
        <Input
          type="email"
          label={t["auth.login.email"]}
          className="max-w-xs justify-center"
          value={email}
          onValueChange={setEmail}
        />
        <PasswordInput value={password} onChange={setPassword} />
        <Button
          isLoading={loading}
          color="primary"
          size="lg"
          type="submit"
          onPress={onLogin}
        >
          {t["auth.login.button"]}
        </Button>
      </form>
    </div>
  );
}
