"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useCallback as useEffect, useState } from "react"
import { ReviewForm } from "../rate/[survey]/page"

const formSchema = z.object({
  fullName: z.string().min(2, "Name is too short").max(256, "Name is too long"),
  contactNum: z.string().regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, "Invalid Phone number"),
  email: z.string().email().min(2).max(256),
  address1: z.string().min(2, "Address is too short").max(512),
  address2: z.string().max(512).optional(),
  city: z.string().min(2, "Too short").max(128),
  stateProvince: z.string().min(2, "Too short").max(128),
  zipCode: z.string().min(2).max(16),
})

export default function Page() {
  return (
    <Suspense>
      <Shipping />
    </Suspense>
  )
}

function Shipping() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const encodedReview = searchParams.get("review");
  const [review, setReview] = useState<ReviewForm>();
  const { toast } = useToast();

  useEffect(() => {
    if (!encodedReview)
      toast({
        title: "Something went wrong...",
        description: "Please reload the page.",
        variant: "destructive",
        action: (
          <ToastAction altText="Reload" onClick={location.reload}>
            Reload
          </ToastAction>
        ),
      });
    else {
      setReview(JSON.parse(Buffer.from(encodedReview, "base64url").toString()))
    }
  }, [encodedReview, toast])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: review?.name,
      email: review?.email,
      contactNum: review?.phoneNum,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ This will be type-safe and validated.
    const params = new URLSearchParams(searchParams);
    const encodedValues =  Buffer.from(JSON.stringify(values)).toString("base64url");
    params.append("shipping", encodedValues);
    router.push(`${pathname.replace("shipping", "thanks")}?${params.toString()}`)
  }

  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col items-stretch bg-white p-5 rounded-xl w-full">
        <div className="flex flex-col items-stretch text-center">
          <p className="text-[#343A40] text-xs">Step 5 of 5</p>
          <h2 className="text-base">Please enter your shipping information.</h2>
          <p className="text-[#343A40] text-xs">Please double-check all information is correct before submitting. Inputting incorrect information may result in you not receiving your gift.</p>
          </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-4">
                <FormLabel className="">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactNum"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-4">
                <FormLabel className="">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-4">
              <FormLabel className="">Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address1"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-4">
              <FormLabel className="">Address 1</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address2"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-4">
              <FormLabel className="">Address 2 (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-4">
              <FormLabel className="">City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stateProvince"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-4">
                <FormLabel className="">State/Province</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-4">
                <FormLabel className="">ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="ZIP Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="self-end bg-primary hover:bg-primary/90">Next &rarr;</Button>
      </form>
    </Form>
  )


}

