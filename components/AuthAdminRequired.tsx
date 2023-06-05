import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export const AuthAdminRequired: React.FC = () => {
  return (
    <Alert icon={<IconAlertCircle size="1rem" />} color="red" variant="filled">
      You need to be an authenticated admin to view this page
    </Alert>
  );
};
