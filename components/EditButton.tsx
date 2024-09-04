"use client";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

export function EditButton({ id }: { id: string }) {
  const [user, setUser] = useState(auth.currentUser);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    console.log("User is not logged in");
    return <></>;
  }
  const redirectToEdit = (event: any) => {
    console.log(`Redirecting to edit ${id}`);
    router.push(`/articles/edit/${id}`);
  };

  return (
    <>
      <Button onClick={redirectToEdit}>
        <FiEdit />
      </Button>
    </>
  );
}
