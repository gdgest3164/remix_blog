import { ActionIcon, Box, Button, Divider, PasswordInput, Space, TextInput, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { ActionFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { IconChevronLeft } from "@tabler/icons-react";
import QueryString from "qs";
import { useEffect, useState } from "react";
import { PostUpload } from "~/components/Post/Upload";
import { TPost, getPost, updatePost } from "~/models/post.service";

interface ILoaderData {
  post: TPost;
}

type InputData = {
  id: string;
  title: string;
  content: string;
  password: string;
};

interface IActionData {
  message: TMessage;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const postId = params.postId as string;
  const getPostReponse = await getPost(parseInt(postId));
  if (getPostReponse.data !== null) {
    return json({ post: getPostReponse.data });
  } else {
    return redirect("/");
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const data = QueryString.parse(await request.text()) as InputData;

  if (typeof data.password !== "string" || data.password !== process.env.ADMIN_PASSWORD) {
    return json<IActionData>({
      message: {
        title: "글 수정 실패",
        color: "red",
        message: "비밀번호가 일치하지 않습니다.",
      },
    });
  }
  console.log(data);
  if (data.id && data.title && data.content) {
    await updatePost(parseInt(data.id), data.title, data.content);
    return redirect(`/posts/${data.id}`);
  }
  return json<IActionData>({
    message: {
      title: "글 수정 실패",
      color: "red",
      message: "제목과 내용을 입력해주세요.",
    },
  });
};

export default function PostUpdate() {
  const loaderData = useLoaderData<ILoaderData>();
  const [post, setPost] = useState<TPost>(loaderData.post);
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
  useEffect(() => {
    setPost(loaderData.post);
  }, [loaderData.post]);

  return (
    <Box style={{ padding: "45px" }}>
      <Box style={{ display: "flex", alignItems: "center" }}>
        <Link to={"/"} style={{ display: "flex", alignItems: "center" }}>
          <ActionIcon style={{ background: "none", color: "black" }}>
            <IconChevronLeft />
          </ActionIcon>
        </Link>
        <Space w="xs" />
        <Title>수정</Title>
      </Box>
      <Divider mt={20} mb={15} />
      <Form method="post">
        <input type="hidden" name="id" defaultValue={post.id.toString()} />
        <TextInput placeholder="제목" variant="filled" size="x" value={post.title!} name="title" />
        <Space h="xl" />
        <PostUpload defaultValue={post.content!} />
        <Space h="xl" />
        <Box style={{ display: "flex", justifyContent: "end" }}>
          <PasswordInput style={{ minWidth: "200px" }} placeholder="관리자 비밀번호" name="password" />
          <Space w={"xs"} />
          <Button color="blue" type="submit">
            수정하기
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
