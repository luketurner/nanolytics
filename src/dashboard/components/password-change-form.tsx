import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import z from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { Input } from "./ui/input";
import { useUpdatePassword } from "../hooks";
import { toast } from "sonner";

const passwordChangeSchema = z.object({
  existingPassword: z.string().min(1),
  newPassword: z.string().min(1),
  newPasswordConfirm: z.string().min(1),
});

export const PasswordChangeForm: React.FC<{
  onSubmit?: () => void | Promise<void>;
}> = ({ onSubmit }) => {
  const form = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    values: {
      existingPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const updatePassword = useUpdatePassword();

  const handleSubmit = useCallback(
    async (data: z.infer<typeof passwordChangeSchema>) => {
      if (data.newPassword !== data.newPasswordConfirm) {
        form.setError("newPasswordConfirm", {
          type: "custom",
          message: "Passwords must match.",
        });
        return;
      }
      try {
        await updatePassword(data.existingPassword, data.newPassword);
        toast("Password updated successfully");
        form.reset();
        if (onSubmit) {
          await onSubmit();
        }
      } catch (e) {
        const message = (e as Error).message;
        form.setError(
          message.startsWith("Current password")
            ? "existingPassword"
            : "newPassword",
          {
            type: "custom",
            message: message,
          },
        );
      }
    },
    [form, onSubmit],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="existingPassword"
          render={({ field }) => (
            <FormItem className="m-4">
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="m-4">
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPasswordConfirm"
          render={({ field }) => (
            <FormItem className="m-4">
              <FormLabel>New password (Confirm)</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mx-4" type="submit">
          Change password
        </Button>
      </form>
    </Form>
  );
};
