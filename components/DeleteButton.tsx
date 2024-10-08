"use client";
import { articlesRef } from "@/utils/firebase";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { deleteDoc, doc } from "firebase/firestore";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { Bounce, toast } from "react-toastify";

export function DeleteButton({ id }: { id: string }) {
  const { theme } = useTheme();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const deleteArticle = async () => {
    setLoading(true);
    const colRef = articlesRef;
    const docRef = doc(colRef, id);
    await deleteDoc(docRef);
    setLoading(false);

    toast.info("Successfully delete article", {
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
    router.push("/articles");
  };

  return (
    <>
      <Tooltip content="Delete article ?" placement="bottom">
        <Button onClick={onOpen} isIconOnly>
          <FiX />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Do you really want to delete the article ?
              </ModalHeader>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    deleteArticle();
                  }}
                  isLoading={loading}
                >
                  Delete article
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
