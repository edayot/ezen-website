"use client";
import { HomeProps } from "@/dictionaries/dictionaries";
import { IsUserLoggedIn, RedirectComponent } from "@/components/RedirectButton";
import { Button } from "@nextui-org/react";
import { useTranslation } from "@/dictionaries/client";
import { signOutGlobal } from "@/utils/firebase";
import { redirect } from "next/navigation"
import { auth } from "@/utils/firebase";
import {Snippet} from "@nextui-org/react";
import { useState, useEffect } from "react";

export default function Home({ params }: { params: HomeProps }) {
  const t = useTranslation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="flex flex-row justify-center">
        <div className="w-5/6 max-w-xl">
          <IsUserLoggedIn fallback={<RedirectComponent/>} >
            <div className="flex flex-col gap-2">
              <h1>{t["auth.account.title"]}</h1>
              <p>{t["auth.account.email"]} {user?.email}</p>
              <p>{t["auth.account.uid"]} <Snippet symbol="" size="sm">{user?.uid}</Snippet></p>
              <br/>
              <div>
                <Button
                  onClick={() => {
                    setLoading(true)
                    signOutGlobal().then(
                      redirect("/")
                    )
                  }}
                  isLoading={loading}
                >
                  {t["auth.account.signout"]}
                </Button>
              </div>
            </div>
          </IsUserLoggedIn>
        </div>
      </div>
    </>
  );
}
