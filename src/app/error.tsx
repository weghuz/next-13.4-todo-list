"use client";
import React from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div>
            {error.name}
            <button onClick={() => reset()}>Go back</button>
        </div>
    );
}
