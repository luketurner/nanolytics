import { type Site, type SiteId, siteSchemaClient } from "@/sites/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDeleteSite, useSites, useUpdateSite } from "../hooks";
import { Button, buttonVariants } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "@/util/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export const SiteForm = ({
  site: siteId,
  onDelete,
}: {
  site: SiteId;
  onDelete?: () => void;
}) => {
  const deleteSite = useDeleteSite();
  const { data: sites } = useSites();
  const site = sites?.find((s) => s.id === siteId);

  const form = useForm<Site>({
    resolver: zodResolver(siteSchemaClient),
    values: site,
  });

  const updateSite = useUpdateSite();

  if (!site) {
    // TODO -- skeleton / error?
    return;
  }

  const onSubmit = (values: Site) => {
    updateSite(site.id, values);
  };

  return (
    <Form {...form}>
      <form className="mt-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="m-4">
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder="Site name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hostnames"
          render={({ field }) => (
            <FormItem className="m-4">
              {field.value?.length ? <FormLabel>Hostnames</FormLabel> : null}
              {field.value?.map((hostname, index) => (
                <FormField
                  control={form.control}
                  name={`hostnames.${index}`}
                  render={({ field: subField }) => (
                    <FormItem>
                      <FormControl className="gap-2">
                        <div className="flex">
                          <Input placeholder="example.com" {...subField} />
                          <Button
                            onClick={() => {
                              field.onChange(
                                form.getValues(`hostnames`).toSpliced(index, 1)
                              );
                            }}
                            variant="destructive"
                          >
                            X
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                onClick={() =>
                  field.onChange([...form.getValues(`hostnames`), ""])
                }
                className={cn(field.value?.length ? "justify-self-end" : "")}
                variant="secondary"
              >
                Add Hostname
              </Button>
            </FormItem>
          )}
        />
        <div className="flex flex-row m-4 gap-4">
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="destructive">Delete site</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {site.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  <p className="mb-2">
                    This will permanently delete the site and{" "}
                    <strong>all metrics</strong> associated with it.
                  </p>
                  <p>This action cannot be undone.</p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteSite(site.id);
                    onDelete?.();
                  }}
                  className={cn(buttonVariants({ variant: "destructive" }))}
                >
                  Delete site
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="grow"></div>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </Form>
  );
};
