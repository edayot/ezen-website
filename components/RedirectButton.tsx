"use client";
import { auth } from "@/utils/firebase";
import { Button, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";
import Link from "next/link";

export function EditButton({ id }: { id: string }) {
  const [user, setUser] = useState(auth.currentUser);

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

  return (
    <>
      <div className="h-2"></div>
      <Tooltip content="Edit article" placement="bottom">
        <Link href={`/articles/edit/${id}`}>
          <Button isIconOnly >
            <FiEdit />
          </Button>
        </Link>
      </Tooltip>
      <div className="h-2"></div>
    </>
  );
}


export function NewArticle() {
  const [user, setUser] = useState(auth.currentUser);

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

  return (
    <>
      <div className="h-2"></div>
      <Tooltip content="Make a new article" placement="bottom">
        <Link href={`/articles/new`}>
          <Button isIconOnly >
            <FiPlus size={30} />
          </Button>
        </Link>
      </Tooltip>
      <div className="h-2"></div>
    </>
  );
}
