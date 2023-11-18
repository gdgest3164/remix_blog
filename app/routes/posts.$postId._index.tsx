import { ActionIcon, BackgroundImage, Box, Divider, Menu, Space, Title } from "@mantine/core";
import { Link } from "@remix-run/react";
import { IconBackground, IconChevronLeft, IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react";

export default function postRead() {
  return (
    <Box style={{ padding: "45px" }}>
      <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box style={{ display: "flex", alignItems: "center" }}>
          <Link to={"/"} style={{ display: "flex", alignItems: "center" }}>
            <ActionIcon style={{ background: "white", color: "black" }}>
              <IconChevronLeft />
            </ActionIcon>
          </Link>
          <Space w="xs" />
          <Title>글 제목</Title>
        </Box>
        <Menu shadow="md" width={200} position="left-start">
          <Menu.Target>
            <ActionIcon style={{ background: "white", color: "black" }}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<IconPencil size={14} />}>글 수정하기</Menu.Item>
            <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
              글 삭제하기
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
      <Divider mt={20} mb={15} />글 내용
    </Box>
  );
}
