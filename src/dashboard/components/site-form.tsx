import { type Site, siteSchemaClient } from "@/sites/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdateSite } from "../hooks";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export const SiteForm = ({ site }: { site: Site }) => {
  const form = useForm<Site>({
    resolver: zodResolver(siteSchemaClient),
    defaultValues: site,
  });

  const updateSite = useUpdateSite();

  const onSubmit = (values: Site) => {
    updateSite(site.id, values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site name</FormLabel>
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
            <>
              <FormLabel>Hostnames</FormLabel>
              {field.value.map((hostname, index) => (
                <FormField
                  control={form.control}
                  name={`hostnames.${index}`}
                  render={({ field: subField }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex">
                          <Input placeholder="example.com" {...subField} />
                          <Button
                            onClick={() => {
                              field.onChange(
                                form.getValues(`hostnames`).toSpliced(index, 1)
                              );
                            }}
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
              >
                +
              </Button>
            </>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
