"use client";

import { useAlert } from "@/app/context/AlertContext";

export default function GlobalAlerts() {
  const alertCtx = useAlert();

  return (
    <>
      {alertCtx.message && (
        <div className="toast toast-bottom toast-center">
          <div className={`alert alert-${alertCtx.type} cursor-pointer`} onClick={alertCtx.clear}>
            <span>{alertCtx.message}</span>
          </div>
        </div>
      )}
    </>
  );
}