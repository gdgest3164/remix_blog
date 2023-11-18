import { ActionIcon, Box, Button, Input, Menu, PasswordInput, Space, Text, TextInput, Textarea } from "@mantine/core";
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import CommentUpload from "../Upload";

export default function CommentItem({ comment }: any) {
  const createAtDate = new Date(comment.create_at);
  const [mode, setMode] = useState<"view" | "edit">("view");
  return (
    <Box style={{ padding: "15px 0", borderBottom: "1px solid #eaeaea", userSelect: "element" }}>
      <Box style={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Text>{comment.writer}</Text>
          <Text>
            {createAtDate.toLocaleDateString()} {createAtDate.toLocaleTimeString()}
          </Text>
        </Box>
        <Menu shadow="md" width={200} position="left-start">
          <Menu.Target>
            <ActionIcon style={{ background: "white", color: "black" }}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<IconPencil size={14} />} onClick={() => setMode("edit")}>
              댓글 수정하기
            </Menu.Item>
            <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
              댓글 삭제하기
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
      <Space h="md" />

      {mode === "view" ? (
        <Text>{comment.content}</Text>
      ) : (
        <Box>
          <Textarea name="commentContent" placeholder="댓글을 입력하세요." />
          <Space h="lg" />
          <Box style={{ display: "flex", justifyContent: "end" }}>
            <PasswordInput style={{ minWidth: "200px" }} name="commentPassword" placeholder="댓글 비밀번호" />
            <Space w="xs" />
            <Button variant="default" onClick={() => setMode("view")}>
              취소
            </Button>
            <Space w="xs" />
            <Button color={"blue"} type="submit" name="action">
              수정
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
