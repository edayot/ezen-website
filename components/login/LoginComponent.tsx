"use client";

import { PasswordInput } from "@/components/password/Input";
import { useTranslation } from "@/dictionaries/client";
import { signInEmailPassword } from "@/utils/firebase";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

export function LoginComponent() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const onLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    if (!email.includes("@")) {
      setError("Invalid email");
      setLoading(false);
      return;
    }
    try {
      let [res, err] = await signInEmailPassword(email, password);

      if (err) {
        setError(err);
        setLoading(false);
      } else if (res) {
        setError("");
        router.push("/");
      } else {
        setError("An error occurred");
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred");
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
        <div className="text-red-600">{error}</div>
      </form>
    </div>
  );
}
