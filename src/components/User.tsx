import React from "react";

export default function User({ id }: { id: string }) {
  return <li key={id}>{id}</li>
}