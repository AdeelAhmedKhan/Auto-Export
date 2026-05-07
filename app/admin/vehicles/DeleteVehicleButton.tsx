"use client";

import { useFormStatus } from "react-dom";
import { deleteVehicleAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-red-300"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export function DeleteVehicleButton({
  vehicleId,
  title,
}: {
  vehicleId: number;
  title: string;
}) {
  return (
    <form
      action={deleteVehicleAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(`Delete "${title}"? This cannot be undone.`);
        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="vehicleId" value={vehicleId} />
      <SubmitButton />
    </form>
  );
}
