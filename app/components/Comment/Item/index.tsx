import { ActionIcon, Box, Button, Center, Menu, Modal, PasswordInput, Space, Text, Textarea } from "@mantine/core";
import { useFetcher } from "@remix-run/react";
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import type { TComment } from "~/models/comment.service";
import { InputType } from "~/routes/posts.$postId._index";

interface ICommentItem {
  comment: TComment;
  isUpload?: boolean;
}

export default function CommentItem({ comment, isUpload }: ICommentItem) {
  const fetcher = useFetcher();
  const createAtDate = comment.created_at ? new Date(comment.created_at.replace(" ", "T").split(".")[0]) : "";
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [deleteModalOpened, setDeleteModalOpend] = useState(false);
  return (
    <Box
      style={{
        padding: "15px 0",
        borderBottom: "1px solid #eaeaea",
        userSelect: "element",
        opacity: fetcher.state !== "idle" || isUpload ? 0.5 : 1,
        color: typeof fetcher.data === "object" && fetcher.data !== null && "error" in fetcher.data && fetcher.data.error ? "red" : "inherit",
      }}
    >
      <Box style={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          {JSON.stringify(fetcher)}
          <Text>{comment.writer}</Text>
          <Text>
            {createAtDate && createAtDate.toLocaleDateString()} {createAtDate && createAtDate.toLocaleTimeString()}
          </Text>
        </Box>
        <Menu shadow="md" width={200} position="left-start">
          <Menu.Target>
            <ActionIcon style={{ background: "none", color: "black" }}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<IconPencil size={14} />} onClick={() => setMode("edit")}>
              댓글 수정하기
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={14} />}
              onClick={() => {
                setDeleteModalOpend(true);
              }}
            >
              댓글 삭제하기
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Modal opened={deleteModalOpened} onClose={() => setDeleteModalOpend(false)} title="댓글 삭제">
          <Text style={{ textAlign: "center" }}>댓글을 삭제하기 위해서는 비밀번호를 입력해 주세요</Text>
          <Space h="lg" />
          <fetcher.Form method="post" onSubmit={() => setDeleteModalOpend(false)}>
            <input type="hidden" name="commentId" value={comment.id} />
            <Center>
              <PasswordInput style={{ minWidth: "300px" }} name="password" placeholder="관리자 비밀번호" required />
            </Center>
            <Space h="lg" />
            <Box style={{ display: "flex", justifyContent: "center" }}>
              <Button variant="default" onClick={() => setDeleteModalOpend(false)}>
                취소
              </Button>
              <Space w="md" />
              <Button type="submit" color="red" name="action" value={InputType.DELETE_COMMENT}>
                삭제
              </Button>
            </Box>
          </fetcher.Form>
        </Modal>
      </Box>
      <Space h="md" />

      {mode === "view" ? (
        <Text>{comment.content}</Text>
      ) : (
        <Box>
          <fetcher.Form method="post" onSubmit={() => setMode("view")}>
            <input type="hidden" name="commentId" value={comment.id} />
            <Textarea name="commentContent" placeholder="댓글을 입력하세요." defaultValue={comment.content ?? ""} required />
            <Space h="lg" />
            <Box style={{ display: "flex", justifyContent: "end" }}>
              <PasswordInput style={{ minWidth: "200px" }} name="commentPassword" placeholder="댓글 비밀번호" required />
              <Space w="xs" />
              <Button variant="default" onClick={() => setMode("view")}>
                취소
              </Button>
              <Space w="xs" />
              <Button color={"blue"} type="submit" name="action" value={InputType.UPDATE_COMMENT}>
                수정
              </Button>
            </Box>
          </fetcher.Form>
        </Box>
      )}
    </Box>
  );
}
