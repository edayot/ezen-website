"use client";

import {Input, Button} from "@nextui-org/react";
import { PasswordInput } from '@/components/password/Input';
import React from 'react';
import { signInEmailPassword } from '@/utils/firebase';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LoginComponent({dict}: {dict: any}) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const router = useRouter();

    const onLogin = async () => {
        setLoading(true);
        try {
            let [res, err] = await signInEmailPassword(email, password);
            
            if (err) {
                setError(err);
                setLoading(false);
            }
            else if (res) {
                setError('');
                router.push('/');
            }
            else {
                setError('An error occurred');
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
            setError('An error occurred');
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-2 items-center border align-middle">
            <h1>{dict.auth.login}</h1>
            <br/>
            <Input type="email" label="Email" className="max-w-xs justify-center" value={email} onValueChange={setEmail}/>
            <PasswordInput value={password} onChange={setPassword} />
            <br/>
            <Button
                isLoading={loading}
                color="primary"
                size="lg" 
                onPress={(e) => onLogin()}
            >
                Login
            </Button>
            <div className=" text-red-600">
                {error}
            </div>
            
        </div>
    )
}