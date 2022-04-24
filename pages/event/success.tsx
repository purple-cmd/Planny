import { Anchor } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Success() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const tid = setTimeout(() => {
      router.push(`/event/${id}`);
    }, 4000);
    return () => {
      clearTimeout(tid);
    };
  }, [id, router]);

  return <div>Event {id} was generated successfully...</div>;
}
