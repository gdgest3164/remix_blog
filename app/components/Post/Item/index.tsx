import { Box, Space, Text, Title } from "@mantine/core";

export default function PostItem({ post }: any) {
  const createAtDate = new Date(post.create_at);
  return (
    <Box style={{ padding: "15px 0", borderBottom: "1px solid #eaeaea", userSelect: "element" }}>
      <Title order={3}>{post.title}</Title>
      <Space h="xs" />
      <Text lineClamp={3}>{post.content}</Text>
      <Space h="xs" />
      <Box style={{ display: "flex" }}>
        <Text size="xs" c="gary">
          <>댓글 {post.commentCount}</>
        </Text>
        <Space w="xs" />
        <Text size="xs" c="gray">
          {createAtDate.toLocaleDateString()} {createAtDate.toLocaleTimeString()}
        </Text>
      </Box>
    </Box>
  );
}
