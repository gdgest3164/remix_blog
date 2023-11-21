import { ActionIcon, Box, Button, Divider, PasswordInput, Space, TextInput, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { IconChevronLeft } from "@tabler/icons-react";
import QueryString from "qs";
import { useEffect, useState } from "react";
import { PostUpload } from "~/components/Post/Upload";
import { createPost } from "~/models/post.service";

interface InputData {
  title: string;
  content: string;
  password: number;
}

interface IActionData {
  message: TMessage;
}

export const action: ActionFunction = async ({ request, params }) => {
  const data = QueryString.parse(await request.text()) as unknown as InputData;
  if (typeof data.password !== "string" || data.password !== process.env.ADMIN_PASSWORD) {
    return json<IActionData>({
      message: {
        title: "글 작성 실패",
        message: "패스워드가 일치하지 않습니다",
        color: "red",
      },
    });
  }

  if (data.title && data.content) {
    await createPost(data.title, data.content);
    return redirect("/");
  }

  return json<IActionData>({
    message: {
      title: "글 작성 실패",
      message: "제목과 내용을 입력해주세요.",
      color: "red",
    },
  });
};

export default function PostCreate() {
  const actionData = useActionData<IActionData>();
  const [message, setMessage] = useState<IActionData>();

  useEffect(() => {
    if (actionData) {
      setMessage(actionData);
    }
  }, [actionData]);

  useEffect(() => {
    if (message) {
      showNotification({
        title: message.message.title,
        message: message.message.message,
        color: message.message.color,
      });
    }
  }, [message]);
  return (
    <Box style={{ padding: "45px" }}>
      <Box style={{ display: "flex", alignItems: "center" }}>
        <Link to={"/"} style={{ display: "flex", alignItems: "center" }}>
          <ActionIcon style={{ background: "none", color: "black" }}>
            <IconChevronLeft />
          </ActionIcon>
        </Link>
        <Space w="xs" />
        <Title>글 작성</Title>
      </Box>
      <Divider mt={20} mb={15} />
      <Form method="post">
        <TextInput placeholder="제목" variant="filled" size="x" name="title" />
        <Space h="xl" />
        <PostUpload />
        <Space h="xl" />
        <Box style={{ display: "flex", justifyContent: "end" }}>
          <PasswordInput style={{ minWidth: "200px" }} placeholder="비밀번호" name="password" />
          <Space w={"xs"} />
          <Button color="blue" type="submit">
            작성하기
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
