"use client";
import { IsUserLoggedIn, RedirectComponent } from "@/components/RedirectButton";
import { useTranslation } from "@/dictionaries/client";
import { HomeProps } from "@/dictionaries/dictionaries";
import { auth, signOutGlobal, mapRef } from "@/utils/firebase";
import { getDownloadURL, uploadBytes} from "firebase/storage";
import { Button, Snippet, Modal, ModalBody, ModalContent, CircularProgress, Image } from "@nextui-org/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardBody, useDisclosure } from "@nextui-org/react";
import { FiUpload } from "react-icons/fi";

export default function Home({ params }: { params: HomeProps }) {
  const t = useTranslation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [mapUrl, setMapUrl] = useState("")
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getDownloadURL(mapRef).then(setMapUrl)
  }, [])

  const onDrop = (acceptedFiles: any) => {
    onOpen();
    const file = acceptedFiles[0];

    // upload the file to firebase storage and generate a markdown image string "![alt](url)"
    uploadBytes(mapRef, file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!", snapshot);
        getDownloadURL(snapshot.ref).then((url) => {
          setMapUrl(url)
          setError("");
          onClose();
        });
      })
      .catch((error) => {
        console.error("Error uploading file", error);
        setError(`Error uploading file: ${error}`);
        setTimeout(() => {
          setError("");
          onClose();
        }, 3000);
      });
  };


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs">
        <ModalContent>
          <ModalBody>
            <div className=" flex justify-center items-center">
              {error ? <div>{error}</div> : <CircularProgress size="lg" />}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
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
              <h5>{t["auth.account.change_map_small"]}</h5>
              <div className="flex flex-row gap-2">
                <div {...getRootProps()} className="dropzone-container">
                  <input {...getInputProps()} />
                  <div className="dropzone">
                    <Card className="w-64 h-30">
                      <CardBody>
                        <div className="flex flex-col justify-center items-center gap-6 text-center">
                          <FiUpload size={50} />
                          <p>{t["auth.account.dropzone"]}</p>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
                <Image
                  src={mapUrl}
                />
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
