import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "@mantine/core";
import { CalendarEvent } from "tabler-icons-react";

const Home: NextPage = () => {
  return (
    <div>
      <Link href="/event/create" passHref>
        <Button leftIcon={<CalendarEvent />}>Create an event</Button>
      </Link>
    </div>
  );
};

export default Home;
