"use client";
import { VisuallyHidden, useSwitch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiMoon as MoonIcon, FiSun as SunIcon } from "react-icons/fi";

export function ThemeSwitch(props: any) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { Component, slots, getBaseProps, getInputProps, getWrapperProps } =
    useSwitch({});

  if (!mounted) return null;

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex flex-col gap-2">
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: [
              "w-8 h-8",
              "flex items-center justify-center",
              "rounded-lg bg-default-100 hover:bg-default-200 cursor-pointer border-2",
            ],
          })}
          onClick={handleThemeChange}
        >
          {theme === "dark" ? (
            <MoonIcon size={props.size} />
          ) : (
            <SunIcon size={props.size} />
          )}
        </div>
      </Component>
    </div>
  );
}
