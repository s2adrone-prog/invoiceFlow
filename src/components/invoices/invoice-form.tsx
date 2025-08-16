"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, PlusCircle, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { saveInvoice } from "@/lib/data";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description cannot be empty."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  price: z.coerce.number().min(0.01, "Price must be positive."),
  discountPercentage: z.coerce
    .number()
    .min(0, "Discount must be non-negative.")
    .max(100, "Discount cannot be over 100%.")
    .default(0),
});

const formSchema = z.object({
  customerName: z.string().min(2, "Customer name is required."),
  customerEmail: z.string().email("Invalid email address."),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits."),
  invoiceDate: z.date({
    required_error: "An invoice date is required.",
  }),
  items: z.array(invoiceItemSchema).min(1, "Please add at least one item."),
  isGstApplicable: z.boolean().default(true),
  gstRate: z.coerce.number().min(0, "GST rate must be non-negative.").default(18),
});

type InvoiceFormValues = z.infer<typeof formSchema>;

export function InvoiceForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      invoiceDate: new Date(),
      items: [{ description: "", quantity: 1, price: 0, discountPercentage: 0 }],
      isGstApplicable: true,
      gstRate: 18,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  
  const watchedItems = form.watch("items");
  const isGstApplicable = form.watch("isGstApplicable");
  const watchedGstRate = form.watch("gstRate");

  const subtotal = watchedItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.price || 0), 0);
  const totalDiscount = watchedItems.reduce((acc, item) => {
    const itemTotal = (item.quantity || 0) * (item.price || 0);
    const discountAmount = itemTotal * ((item.discountPercentage || 0) / 100);
    return acc + discountAmount;
  }, 0);
  const totalAfterDiscount = subtotal - totalDiscount;
  const gstAmount = isGstApplicable ? totalAfterDiscount * (watchedGstRate / 100) : 0;
  const total = totalAfterDiscount + gstAmount;

  async function onSubmit(data: InvoiceFormValues) {
    setIsLoading(true);
    try {
      const invoiceToSave = {
        ...data,
        invoiceDate: data.invoiceDate.toISOString(),
        gstRate: data.isGstApplicable ? data.gstRate : 0,
        total: total,
      };

      const newInvoice = await saveInvoice(invoiceToSave);
      
      toast({
        title: "Invoice Created",
        description: `Invoice ${newInvoice.invoiceNumber} has been successfully created.`,
      });
      router.push("/invoices");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive"
      });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Email</FormLabel>
                <FormControl>
                  <Input placeholder="contact@acme.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 234 567 890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="invoiceDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Invoice Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Invoice Items</h3>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      {index === 0 && <FormLabel>Description</FormLabel>}
                      <FormControl>
                        <Input placeholder="Item description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="w-24">
                       {index === 0 && <FormLabel>Quantity</FormLabel>}
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.price`}
                  render={({ field }) => (
                    <FormItem className="w-32">
                       {index === 0 && <FormLabel>Price</FormLabel>}
                      <FormControl>
                        <Input type="number" placeholder="99.99" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.discountPercentage`}
                  render={({ field }) => (
                    <FormItem className="w-32">
                       {index === 0 && <FormLabel>Discount (%)</FormLabel>}
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => append({ description: "", quantity: 1, price: 0, discountPercentage: 0 })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
                <FormField
                    control={form.control}
                    name="isGstApplicable"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                Apply GST
                                </FormLabel>
                                <FormDescription>
                                Toggle to include GST in the invoice calculation.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                    />
                {isGstApplicable && (
                    <FormField
                        control={form.control}
                        name="gstRate"
                        render={({ field }) => (
                        <FormItem className="w-32">
                            <FormLabel>GST Rate (%)</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="18" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                )}
            </div>
            <div className="space-y-2 text-right">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600">-${totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {isGstApplicable && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">GST ({watchedGstRate}%)</span>
                        <span>${gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                )}
                <Separator/>
                <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creating..." : "Create Invoice"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
