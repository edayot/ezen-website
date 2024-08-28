"use client";
import React from "react";
import {Switch, VisuallyHidden, useSwitch} from "@nextui-org/react";
import {MoonIcon} from "./MoonIcon";
import {SunIcon} from "./SunIcon";
import {useTheme} from "next-themes";
import {useState, useEffect} from "react";

export function ThemeSwitch(props: any) {

  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const {
    Component, 
    slots, 
    isSelected, 
    getBaseProps, 
    getInputProps, 
    getWrapperProps
  } = useSwitch(props);


  if(!mounted) return null

  const handleThemeChange = () => {
    setTheme(isSelected ? "dark" : "light")
  }

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
                "rounded-lg bg-default-100 hover:bg-default-200",
              ],
            })}
            onClick={handleThemeChange} // Add this line
          >
            {isSelected ? <SunIcon/> : <MoonIcon/>}
          </div>
      </Component>
    </div>
  )
}

