import { ActionIcon, Box, Button, Divider, PasswordInput, Space, TextInput, Title } from "@mantine/core";
import { Link } from "@remix-run/react";
import { IconChevronLeft } from "@tabler/icons-react";

export default function postCreate() {
  return (
    <Box style={{ padding: "45px" }}>
      <Box style={{ display: "flex", alignItems: "center" }}>
        <Link to={"/"} style={{ display: "flex", alignItems: "center" }}>
          <ActionIcon style={{ background: "white", color: "black" }}>
            <IconChevronLeft />
          </ActionIcon>
        </Link>
        <Space w="xs" />
        <Title>글 작성</Title>
      </Box>
      <Divider mt={20} mb={15} />
      <TextInput placeholder="제목" variant="filled" size="x" />
      <Space h="xl" />
      <Box style={{ display: "flex", justifyContent: "end" }}>
        <PasswordInput style={{ minWidth: "200px" }} placeholder="비밀번호" />
        <Space w={"xs"} />
        <Button color="blue">작성하기</Button>
      </Box>
    </Box>
  );
}
