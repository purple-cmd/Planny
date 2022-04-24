import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Divider,
  Group,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useForm, useLocalStorage } from "@mantine/hooks";
import { useClipboard } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { Event, Option } from "@prisma/client";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { Clipboard, Share } from "tabler-icons-react";
import { db } from "../../prisma/db";

interface Props {
  event:
    | (Event & {
        options: Option[];
      })
    | null;
}

function vote(idsToVote) {
  return fetch("/api/event", {
    method: "PUT",
    body: JSON.stringify(idsToVote),
    headers: { "Content-Type": "application/json" },
  });
}

export default function EventById(props: Props) {
  const { event } = props;
  const clipboard = useClipboard();
  const {
    isLoading,
    mutate: mutateVotes,
    isSuccess,
  } = useMutation(vote, {
    onSuccess: () => {
      setVotes({
        ...votes,
        [event.id]: true,
      });
      showNotification({
        title: "Counted",
        message: "Your vote has been shilshuled",
      });
      router.replace(router.asPath);
    },
  });

  const form = useForm({
    initialValues: {
      options: [],
    },
    // validate: {
    //     options: (value) => {
    //         console.log('value', value)
    //         if (!value) {
    //             return 'You have to pick at least one option'
    //         }

    //         if (value.length > 2 ) {
    //             return 'No more than 2 dates you naughty boi';
    //         }

    //         return null;
    //      }
    // }
  });

  const router = useRouter();
  const [votes, setVotes] = useLocalStorage<Record<string, boolean>>({
    key: "votes",
    defaultValue: {},
    getInitialValueInEffect: true,
  });

  function handleCopy() {
    clipboard.copy(location.href);
    showNotification({
      title: "Nice",
      message: "Event has copied to clipboard successfully!",
    });
  }

  // Mantine bug with validation
  const disableSubmitHack =
    isLoading ||
    isSuccess ||
    form.values.options.length === 0 ||
    form.values.options.length > 2;
  const canShare =
    typeof window !== "undefined" && typeof navigator.share === "function";

  return (
    <Stack spacing={"md"} align="center" sx={{ height: "100%" }}>
      <Head>
        <meta property="og:title" content={event.title} />
        <meta property="og:description" content={event.description} />
      </Head>
      <Title>{event.title}</Title>
      <Text>{event.description}</Text>
      <Divider size="lg" sx={{ width: "100%" }} />
      <form
        style={{ width: "100%" }}
        onSubmit={form.onSubmit((values) => {
          mutateVotes(values);
        })}
      >
        <Center>
          <CheckboxGroup
            label="Select the available dates:"
            orientation="vertical"
            {...form.getInputProps("options")}
          >
            {event.options.map((op, idx) => {
              return (
                <Checkbox
                  key={op.id}
                  value={op.id}
                  disabled={votes[event.id]}
                  label={
                    <Group align="center">
                      <span>
                        {dayjs(op.date).format("DD/MM/YYYY, HH:mm (dddd)")}
                      </span>
                      <span>votes: {op.vote}</span>
                    </Group>
                  }
                />
              );
            })}
          </CheckboxGroup>
        </Center>
        <Space h="md" />
        <Button
          type="submit"
          size="lg"
          disabled={disableSubmitHack}
          sx={{ width: "100%" }}
        >
          Vote
        </Button>
      </form>
      <div style={{ flex: 1 }}></div>
      <Group>
        <Button leftIcon={<Clipboard />} color="yellow" onClick={handleCopy}>
          Copy Event Link
        </Button>

        <Button
          leftIcon={<Share />}
          color="grape"
          disabled={!canShare}
          onClick={() =>
            navigator.share({
              url: location.href,
              text: event.description,
              title: event.title,
            })
          }
        >
          Share
        </Button>
      </Group>
      <Space h="sm" />
    </Stack>
  );
}

interface Params {
  id: string;
}

export async function getServerSideProps({ params }: { params: Params }) {
  const { id } = params;

  const event = await db.event.findUnique({
    where: {
      id,
    },
    include: {
      options: {
        orderBy: {
          date: "asc",
        },
      },
    },
  });

  if (event && event.options) {
    event.options = event.options.map((d) => {
      return {
        ...d,
        date: d.date.toJSON() as any,
      };
    });
  }

  return {
    props: { event },
  };
}
