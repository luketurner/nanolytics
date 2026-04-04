import { useCallback } from "react";
import { Button } from "./ui/button";
import { useSession } from "../hooks/useSession";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const LoginPage: React.FC = () => {
  const { login } = useSession();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    values: {
      username: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof loginSchema>) => {
      try {
        await login(data.username, data.password);
      } catch (e) {
        form.setError("password", {
          type: "custom",
          message: (e as Error).message,
        });
      }
    },
    [login, form],
  );

  return (
    <div className="max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="m-4">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="m-4">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mx-4" type="submit">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};
