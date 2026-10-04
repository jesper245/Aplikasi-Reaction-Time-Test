'use client';

import { useEffect, useState } from "react";

import { useAlert, AlertTypes } from "@/app/context/AlertContext";

interface RegisterCardPageProps {
  onSubmit: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
}

export default function RegisterCardPage(props: RegisterCardPageProps) {
  const alertCtx = useAlert();

  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const onRegister = async () => {
    const result = await props.onSubmit(username || "", password || "");

    if (!result.success) {
      alertCtx.show(AlertTypes.ERROR, result.message);
      return;
    }

    alertCtx.show(AlertTypes.SUCCESS, result.message);
  }

  return (
    <div className="my-20 mx-auto card bg-base-100 w-full max-w-md shrink-0 shadow-2xl">
      <div className="card-body">
        <h2 className="card-title">Register</h2>

        <fieldset className="fieldset">
          <label className="fieldset-label">Username</label>
          <input type="text" className="input w-full" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />

          <label className="fieldset-label">Password</label>
          <input type="password" className="input w-full" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

          <button
            className="btn btn-neutral mt-4"
            onClick={() => { onRegister() }}
          >
            Register
          </button>
        </fieldset>
      </div>
    </div>
  )
}