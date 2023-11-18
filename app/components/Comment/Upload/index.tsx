import { Box, Button, PasswordInput, Space, Text, TextInput, Textarea } from "@mantine/core";

export default function CommentUpload() {
  return (
    <Box>
      <Textarea name="commentContent" placeholder="댓글을 입력하세요." />
      <Space h="lg" />
      <Box style={{ display: "flex", justifyContent: "end" }}>
        <TextInput style={{ minWidth: "200px" }} name="commentWriter" placeholder="작성자 이름" />
        <Space w="xs" />
        <PasswordInput style={{ minWidth: "200px" }} name="commentPassword" placeholder="댓글 비밀번호" />
        <Space w="xs" />
        <Button color={"blue"} type="submit" name="action">
          댓글달기
        </Button>
      </Box>
    </Box>
  );
}
