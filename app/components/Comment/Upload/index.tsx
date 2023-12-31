import { Box, Button, PasswordInput, Space, TextInput, Textarea } from "@mantine/core";
import { Form } from "@remix-run/react";
import { InputType } from "~/routes/posts.$postId._index";

export default function CommentUpload() {
  return (
    <Box>
      <Form method="post">
        <Textarea name="commentContent" placeholder="댓글을 입력하세요." required />
        <Space h="lg" />
        <Box style={{ display: "flex", justifyContent: "end" }}>
          <TextInput style={{ minWidth: "200px" }} name="commentWriter" placeholder="작성자 이름" required />
          <Space w="xs" />
          <PasswordInput style={{ minWidth: "200px" }} name="commentPassword" placeholder="댓글 비밀번호" required />
          <Space w="xs" />
          <Button color={"blue"} type="submit" name="action" value={InputType.CREATE_COMMENT}>
            댓글달기
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
