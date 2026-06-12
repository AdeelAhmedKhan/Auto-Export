"use client";

import { useFormStatus } from "react-dom";
import { deleteTestimonialAction } from "./actions";

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

export function DeleteTestimonialButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  return (
    <form
      action={deleteTestimonialAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(`Delete testimonial from "${name}"?`);
        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  );
}
