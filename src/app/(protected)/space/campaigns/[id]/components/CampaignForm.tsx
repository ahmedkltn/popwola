"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CampaignInterface } from "@/interfaces/campaign.interface";
import { createCampaignDocument } from "@/lib/services/campaign.service";
import { userId } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

interface CampaignFormProps {
  isCreating: boolean;
  initialData?: CampaignInterface;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  isCreating,
  initialData,
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const [data, setData] = useState<CampaignInterface>(
    isCreating
      ? {
          name: "",
          description: "",
          is_recurring: false,
          popup_id: "",
        }
      : initialData!
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateCampaign = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newCampaign: any = await createCampaignDocument({
        ...data,
        user_id: userId(),
      });
      setData({ name: "", description: "", is_recurring: false, popup_id: "" });
      toast({
        title: "Campaign Created",
      });
      setLoading(false);
      router.push(`/space/campaigns/${newCampaign.$id}?template=true`);
    } catch (err: any) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Cannot create campaign",
        description: err.message,
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateCampaign} className="mt-7 w-9/12">
      <div className="mb-4">
        <label className="block mb-2 text-xs text-secondary font-medium">
          Campaign Name <span className="text-red-500">*</span>
        </label>
        <Input
          value={data.name}
          onChange={handleInputChange}
          required
          name="name"
          type="text"
          placeholder="Campaign Name"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-xs text-secondary font-medium">
          Campaign Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          name="description"
          value={data.description}
          onChange={handleInputChange}
          required
          placeholder="Campaign Description"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-xs text-secondary font-medium">
          Start Date <span className="text-red-500">*</span>
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start border-secondary/5 bg-foreground text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, "PPP")
              ) : (
                <span className="text-secondary">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              required
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-xs text-secondary font-medium">
          End Date <span className="text-red-500">*</span>
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start border-secondary/5 bg-foreground text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? (
                format(endDate, "PPP")
              ) : (
                <span className="text-secondary">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              required
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-xs text-secondary font-medium">
          Is recurring? <span className="text-red-500">*</span>
        </label>
        <Select
          defaultValue={!data.is_recurring ? "no" : "yes"}
          required
          onValueChange={(e: string) => {
            setData((prev) => ({ ...prev, is_recurring: e === "yes" }));
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={<span className="text-secondary">Yes/No</span>}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="buttons-wrapper flex items-center justify-end gap-3">
        <Button variant={"destructive"}>Cancel</Button>
        {isCreating ? (
          <Button disabled={loading}>Create</Button>
        ) : (
          <Button>Update</Button>
        )}
      </div>
    </form>
  );
};

export default CampaignForm;
