import { ActionIcon, Box, Button, Center, Divider, List, Menu, Modal, PasswordInput, Space, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { IconChevronLeft, IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react";
import QueryString from "qs";
import { useEffect, useState } from "react";
import CommentItem from "~/components/Comment/Item";
import CommentUpload from "~/components/Comment/Upload";
import type { TComment } from "~/models/comment.service";
import { createComment, getCommentPassword, updateComment } from "~/models/comment.service";
import type { TPost } from "~/models/post.service";
import { deletePost, getPost } from "~/models/post.service";

interface ILoaderData {
  post: TPost;
}

export enum InputType {
  DELETE_POST = "0",
  CREATE_COMMENT = "1",
  UPDATE_COMMENT = "2",
  DELETE_COMMENT = "3",
}

type InputData = {
  action: InputType;
  id?: number;
  password: string;
  commentId?: string;
  commentContent?: string;
  commentWriter?: string;
  commentPassword?: string;
};

interface IActionData {
  error?: boolean | false;
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
  const postId = params.postId as string;
  const data = QueryString.parse(await request.text()) as unknown as InputData;

  switch (data.action) {
    case InputType.DELETE_POST: {
      if (data.password !== process.env.ADMIN_PASSWORD) {
        return json<IActionData>({
          message: {
            title: "삭제 실패",
            color: "red",
            message: "비밀번호가 일치하지 않습니다.",
          },
        });
      }
      if (data.id) {
        await deletePost(data.id);
        return redirect("/");
      }

      return json<IActionData>({
        message: {
          title: "처리 실패",
          color: "red",
          message: "알수 없는 오류가 발생하였습니다.",
        },
      });
    }
    case InputType.CREATE_COMMENT: {
      if (data.commentContent && data.commentWriter && data.commentPassword) {
        await createComment(data.commentContent, data.commentPassword, parseInt(postId), data.commentWriter);
        return redirect(`/posts/${postId}`);
      }
    }
    case InputType.UPDATE_COMMENT: {
      if (data.commentId && data.commentContent) {
        const comment = await getCommentPassword(parseInt(data.commentId));
        if (data.commentPassword !== comment.data?.password) {
          return json<IActionData>({
            message: {
              title: "수정 실패",
              color: "red",
              message: "비밀번호가 일치하지 않습니다.",
            },
          });
        } else {
          await updateComment(parseInt(data.commentId!), data.commentContent);
          return redirect(`/posts/${postId}`);
        }
      }
    }
    case InputType.DELETE_COMMENT: {
      if (data.commentId && data.password) {
        if (data.password !== process.env.ADMIN_PASSWORD) {
          return json<IActionData>({
            message: {
              title: "삭제 실패",
              color: "red",
              message: "비밀번호가 일치하지 않습니다.",
            },
          });
        } else {
          try {
            throw new Error("test");
            // await deleteComment(parseInt(data.commentId));
            // return redirect(`/posts/${postId}`);
          } catch {
            return json<IActionData>({
              error: true,
              message: {
                title: "삭제 실패",
                color: "red",
                message: "알 수 업슨 오류가 발생했습니다..",
              },
            });
          }
        }
      } else {
        return json<IActionData>({
          message: {
            title: "처리 실패",
            color: "red",
            message: "알수 없는 오류가 발생하였습니다.",
          },
        });
      }
    }
  }
};

export default function PostRead() {
  const loaderData = useLoaderData<ILoaderData>();
  const actionData = useActionData<IActionData>();
  const navigation = useNavigation();
  const [post, setPost] = useState<TPost>(loaderData.post);
  const [deleteModalOpened, setDeleteModalOpend] = useState(false);
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
      <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box style={{ display: "flex", alignItems: "center" }}>
          <Link to={"/"} style={{ display: "flex", alignItems: "center" }}>
            <ActionIcon style={{ background: "none", color: "black" }}>
              <IconChevronLeft />
            </ActionIcon>
          </Link>
          <Space w="xs" />
          <Title>{post.title}</Title>
        </Box>
        <Menu shadow="md" width={200} position="left-start">
          <Menu.Target>
            <ActionIcon style={{ background: "none", color: "black" }}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Link to={`/posts/${post.id}/update`}>
              <Menu.Item leftSection={<IconPencil size={14} />}>글 수정하기</Menu.Item>
            </Link>
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={14} />}
              onClick={() => {
                setDeleteModalOpend(true);
              }}
            >
              글 삭제하기
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Modal opened={deleteModalOpened} onClose={() => setDeleteModalOpend(false)} title="글 삭제">
          <Text style={{ textAlign: "center" }}>글을 삭제하기 위해서는 비밀번호를 입력해 주세요</Text>
          <Space h="lg" />
          <Form method="post">
            <input type="hidden" name="id" value={post.id} />
            <Center>
              <PasswordInput style={{ minWidth: "200px" }} name="password" placeholder="관리자 비밀번호" />
            </Center>
            <Space h="lg" />
            <Box style={{ display: "flex", justifyContent: "center" }}>
              <Button variant="default" onClick={() => setDeleteModalOpend(false)}>
                취소
              </Button>
              <Space w="md" />
              <Button type="submit" color="red" name="action" value={InputType.DELETE_POST}>
                삭제
              </Button>
            </Box>
          </Form>
        </Modal>
      </Box>
      <Divider mt={20} mb={15} />
      {post.content}
      <Divider mt={20} mb={15} />
      <Box>
        <Text>댓글 {(post.comment as TComment[]).length}개</Text>
        <Space h="lg" />
      </Box>
      <Space h="xl" />
      <CommentUpload />
      <Space h="xl" />
      <List style={{ background: "#f6f6f6", margin: "15px 0", padding: "0 15px", borderRadius: "10px" }}>
        {(post.comment as TComment[]).map((comment: TComment, i: number) => (
          <CommentItem key={i} comment={comment} />
        ))}
        {navigation.state === "submitting" && navigation.formData?.get("action") === InputType.CREATE_COMMENT && (
          <>
            <CommentItem
              isUpload
              comment={{
                id: 0,
                writer: navigation.formData?.get("commentWriter") as string,
                content: navigation.formData?.get("commentContent") as string,
                created_at: new Date().toISOString(),
                post_id: 0,
              }}
            />
          </>
        )}
      </List>
    </Box>
  );
}
