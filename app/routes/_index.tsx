import type { MetaFunction } from "@remix-run/node";
import { IconAlarm } from "@tabler/icons-react";
import { ActionIcon, Box, Button, Divider, Title } from "@mantine/core";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  return (
    <Box style={{ padding: "45px" }}>
      <Box style={{ display: "flex", justifyContent: "space-between" }}>
        <Title>나만의 블로그</Title>
        <Link to="/posts/create">
          <Button variant="light" color="red">
            글쓰기
          </Button>
        </Link>
      </Box>
      <Divider mt={20} mb={15} />
      PostList
    </Box>
  );
}
