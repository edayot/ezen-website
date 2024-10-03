"use client";
import { IsUserLoggedIn, RedirectComponent } from "@/components/RedirectButton";
import { useTranslation } from "@/dictionaries/client";
import { HomeProps } from "@/dictionaries/dictionaries";
import { auth, mapRef, signOutGlobal } from "@/utils/firebase";
import { Button, Image, Snippet } from "@nextui-org/react";
import { getDownloadURL, ref } from "firebase/storage";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { UploadToCloud } from "@/components/FormEditor";

export default function Home({ params }: { params: HomeProps }) {
  const t = useTranslation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getDownloadURL(mapRef).then(setMapUrl);
  }, []);

  return (
    <>
      <div className="flex flex-row justify-center">
        <div className="w-5/6 max-w-xl">
          <IsUserLoggedIn fallback={<RedirectComponent />}>
            <div className="flex flex-col gap-2">
              <h1>{t["auth.account.title"]}</h1>
              <p>
                {t["auth.account.email"]} {user?.email}
              </p>
              <p>
                {t["auth.account.uid"]}{" "}
                <Snippet symbol="" size="sm">
                  {user?.uid}
                </Snippet>
              </p>
              <h2>{t["auth.account.change_map"]}</h2>
              <h4>{t["auth.account.change_map_small"]}</h4>
              <div className="flex flex-row gap-2">
                <UploadToCloud
                  onUploadComplete={(url: string) => setMapUrl(url)}
                  getStorageRef={() => mapRef}
                />
                <Image src={mapUrl} alt="Map Image" />
              </div>
              <br />
              <div>
                <Button
                  onClick={() => {
                    setLoading(true);
                    signOutGlobal().then(redirect("/"));
                  }}
                  isLoading={loading}
                  color="danger"
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
