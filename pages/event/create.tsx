import {
  TextInput,
  Button,
  ActionIcon,
  Center,
  Title,
  Space,
  Textarea,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { formList, useForm } from "@mantine/form";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { InfoCircle, Plus, Trash } from "tabler-icons-react";

export default function CreateEvent() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      dates: formList([{ date: new Date(), time: new Date() }]),
    },
  });

  return (
    <>
      <Title>Create Event</Title>
      <Space h="md" />
      <form
        onSubmit={form.onSubmit((values) => {
          const dates = values.dates.map((d) => {
            let date = dayjs(d.date);
            const time = dayjs(d.time);
            date = date.minute(time.minute());
            date = date.hour(time.hour());

            return date.toISOString();
          });

          const options = dates.map((date) => ({ date }));

          const event = {
            ...values,
            options,
          };

          showNotification({
            title: "Info",
            message: `Creating your event right now!`,
            icon: <InfoCircle />,
            loading: true,
          });

          fetch("/api/event", {
            method: "POST",
            body: JSON.stringify(event),
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then((res) => {
              if (res) {
                const { id, title } = res;
                cleanNotifications();
                showNotification({
                  title: "🔥",
                  message: `Event ${title} has been successfully created, redirecting to poll page`,
                  color: "green",
                  loading: true,
                  autoClose: 4000,
                });
                router.push(`/event/${id}`);
              }
            })
            .catch((err) => {
              showNotification({
                title: "Failure",
                message: `There was some error creating your event, ${err}`,
                color: "red",
              });
            });
        })}
      >
        <TextInput
          required
          label="Title"
          placeholder="On the fire..."
          {...form.getInputProps("title")}
          maxLength={40}
        />
        <Space h="sm" />
        <Textarea
          required
          label="Description"
          placeholder="The pantheon summit top secret level meeting! Miracle Cofveve with a touch of twitter stocks at the top. "
          maxLength={200}
          {...form.getInputProps("description")}
        />
        {form.values.dates.map((d, i) => {
          return (
            <div key={i}>
              <Space h="sm" />
              <Center>
                <DatePicker
                  placeholder="Propose a date"
                  label="Event date"
                  required
                  {...form.getListInputProps("dates", i, "date")}
                />
                <Space w="sm" />
                <TimeInput
                  required
                  label="Pick time"
                  placeholder="Pick time"
                  {...form.getListInputProps("dates", i, "time")}
                />
                <Space w="sm" />
                <ActionIcon
                  onClick={() => form.removeListItem("dates", i)}
                  sx={{
                    position: "relative",
                    top: 14,
                    visibility: i > 0 ? "visible" : "hidden",
                  }}
                >
                  <Trash />
                </ActionIcon>
              </Center>
            </div>
          );
        })}
        <Space h="sm" />
        <ActionIcon
          title="Add more dates"
          onClick={() =>
            form.addListItem("dates", { date: new Date(), time: new Date() })
          }
        >
          <Plus />
        </ActionIcon>
        <Space h="lg" />
        <Button type="submit" size="xl" color="green" sx={{ width: "100%" }}>
          Submit
        </Button>
      </form>
    </>
  );
}
