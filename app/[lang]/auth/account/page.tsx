"use client";
import { UploadToCloud } from "@/components/FormEditor";
import { IsUserLoggedIn, RedirectComponent } from "@/components/RedirectButton";
import { useTranslation } from "@/dictionaries/client";
import { HomeProps } from "@/dictionaries/dictionaries";
import { auth, mapRef, signOutGlobal } from "@/utils/firebase";
import { Button, Image, Input, Snippet } from "@nextui-org/react";
import { getDownloadURL } from "firebase/storage";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip} from "@nextui-org/react";
import { FooterData } from "@/utils/footer";
import { addDoc, doc, getDocs, setDoc } from "@firebase/firestore";
import { footerRef } from "@/utils/firebase";
import { RenderFooter } from "@/components/Footer";
import { locales } from "@/utils/langs";
import { FiEdit, FiPlus, FiSave } from "react-icons/fi";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";



function UrlInput({document, lang, documents, setDocuments}: {document: {id: string, data: FooterData}, lang: (typeof locales)[number], documents: {id: string, data: FooterData}[], setDocuments: (documents: {id: string, data: FooterData}[]) => void}) {
  return <Input 
  value={document.data.url}
  onValueChange={(value) => {
    setDocuments(documents.map((doc) => {
      if(doc.id === document.id) {
        return {id: doc.id, data: {...doc.data, url: value}};
      }
      return doc;
    }));
  }}
/>
}

function IconInput({document, lang, documents, setDocuments}: {document: {id: string, data: FooterData}, lang: (typeof locales)[number], documents: {id: string, data: FooterData}[], setDocuments: (documents: {id: string, data: FooterData}[]) => void}) {
  return <Input 
  value={document.data.icon}
  onValueChange={(value) => {
    setDocuments(documents.map((doc) => {
      if(doc.id === document.id) {
        return {id: doc.id, data: {...doc.data, icon: value}};
      }
      return doc;
    }));
  }}
/>
}

function EditButton({document, lang, documents, setDocuments}: {document: {id: string, data: FooterData}, lang: (typeof locales)[number], documents: {id: string, data: FooterData}[], setDocuments: (documents: {id: string, data: FooterData}[]) => void}) {
  return <Dropdown>
  <DropdownTrigger>
    <Button 
      variant="bordered" 
      color="secondary"
      isIconOnly
    >
      <FiEdit size={24}/>
    </Button>
  </DropdownTrigger>
  <DropdownMenu aria-label="Static Actions">
    <DropdownItem key="move_up">Move up</DropdownItem>
    <DropdownItem key="move_down">Move down</DropdownItem>
    <DropdownItem key="delete" className="text-danger" color="danger">Delete</DropdownItem>
  </DropdownMenu>
</Dropdown>
}

function FooterLine({document, lang, documents, setDocuments}: {document: {id: string, data: FooterData}, lang: (typeof locales)[number], documents: {id: string, data: FooterData}[], setDocuments: (documents: {id: string, data: FooterData}[]) => void}) {
  return (
  <TableRow key={document.id}>
    <TableCell>
      <RenderFooter data={document.data} lang={lang}/>
    </TableCell>
    <TableCell>
      <UrlInput document={document} lang={lang} documents={documents} setDocuments={setDocuments} />
    </TableCell>
    <TableCell>
      <IconInput document={document} lang={lang} documents={documents} setDocuments={setDocuments} />
    </TableCell>
    <TableCell>
      WIP
    </TableCell>
    <TableCell>
      WIP
    </TableCell>
    <TableCell>
      <EditButton document={document} lang={lang} documents={documents} setDocuments={setDocuments} />
    </TableCell>
</TableRow>)
}

function FooterTable({lang}: {lang: (typeof locales)[number]}) {
  const initData : FooterData = {
    url: "",
    icon: "",
    order: 0
  }
  const t = useTranslation()
  const [edit, setEdit] = useState(0);
  const [documents, setDocuments] = useState<{id: string, data: FooterData}[]>([]);
  useEffect(() => {
    getDocs(footerRef).then((q) => {
      setDocuments(q.docs.map((doc) => ({id: doc.id, data: doc.data() as FooterData})));
    });
  }, []);
  const refresh = () => setEdit(edit + 1);

  const addFooter = () => {
    const nexOrder = Math.max(...documents.map((doc) => doc.data.order ?? 0)) + 1;
    addDoc(footerRef, {...initData, order: nexOrder}).then((doc) => {
      refresh()
    });
  }

  const saveToDatabase = () => {
    documents.forEach((document) => {
      setDoc(doc(footerRef, document.id), document.data).then(
      )
    })
  }

  return (<>
  <div className="flex flex-col gap-2">
  <div className="flex flex-row justify-end w-full gap-2">
    <Tooltip content={t["auth.account.footer.button_tooltip"]}>
      <Button isIconOnly onClick={addFooter}>
        <FiPlus size={30} />
      </Button>
    </Tooltip>
    <Tooltip content={t["auth.account.footer.save_tooltip"]}>
      <Button isIconOnly onClick={saveToDatabase} color="primary">
        <FiSave size={30} />
      </Button>
    </Tooltip>
  </div>
  <Table aria-label="Example static collection table">
    <TableHeader>
      <TableColumn>RenderItem</TableColumn>
      <TableColumn>Url</TableColumn>
      <TableColumn>Icon url</TableColumn>
      <TableColumn>Tooltip</TableColumn>
      <TableColumn>Order</TableColumn>
      <TableColumn>{""}</TableColumn>
    </TableHeader>
    <TableBody items={documents}>
      {(document) => FooterLine({document: document, lang: lang, documents: documents, setDocuments: setDocuments})}
    </TableBody>
  </Table>
  </div>
  </>)
}




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
      <IsUserLoggedIn fallback={<RedirectComponent />}>
      <div className="flex flex-col justify-center items-center">
        <div className="w-5/6 max-w-xl">
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
              <br/>
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
              <br/>
              <h2>{t["auth.account.change_map"]}</h2>
              <h4>{t["auth.account.change_map_small"]}</h4>
              <div className="flex flex-row gap-2">
                <UploadToCloud
                  onUploadComplete={(url: string) => setMapUrl(url)}
                  getStorageRef={() => mapRef}
                />
                <Image src={mapUrl} alt="Map Image" />
              </div>
            </div>
            <h2>{t["auth.account.custom_footer"]}</h2>
        </div>
        <div className="w-5/6 max-w-3xl">
          <FooterTable lang={params.lang}/>
        </div>
        <br/>
      </div>
      </IsUserLoggedIn>
    </>
  );
}
