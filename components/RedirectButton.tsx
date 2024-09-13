"use client";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { Button, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";

export function EditButton({ id }: { id: string }) {
  const [user, setUser] = useState(auth.currentUser);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

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
      <div className="h-2"></div>
      <Tooltip content="Edit article" placement="bottom">
        <Button onClick={redirectToEdit} isIconOnly >
          <FiEdit />
        </Button>
      </Tooltip>
      <div className="h-2"></div>
    </>
  );
}


export function NewArticle() {
  const [user, setUser] = useState(auth.currentUser);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  if (!user) {
    console.log("User is not logged in");
    return <></>;
  }
  const redirectToNew = (event: any) => {
    console.log(`Redirecting to new`);
    router.push(`/articles/new`);
  };

  return (
    <>
      <div className="h-2"></div>
      <Tooltip content="Make a new article" placement="bottom">
        <Button onClick={redirectToNew} isIconOnly >
          <FiPlus size={30} />
        </Button>
      </Tooltip>
      <div className="h-2"></div>
    </>
  );
}
