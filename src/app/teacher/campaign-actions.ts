"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface CreateCampaignState {
  error?: string;
}

async function requireUserClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/teacher/login");
  }
  return supabase;
}

export async function createCampaignAction(
  _prev: CreateCampaignState,
  formData: FormData,
): Promise<CreateCampaignState> {
  const title = String(formData.get("title") ?? "").trim();
  const className = String(formData.get("className") ?? "").trim();
  const expected = Number(formData.get("expected") ?? NaN);
  const threshold = Number(formData.get("threshold") ?? NaN);
  const language = String(formData.get("language") ?? "en");

  if (!title || !className) {
    return { error: "Please provide a title and a class name." };
  }
  if (!Number.isInteger(expected) || expected <= 0) {
    return { error: "Expected participants must be a positive whole number." };
  }
  if (!Number.isInteger(threshold) || threshold < 10 || threshold > 1000) {
    return { error: "Anonymity threshold must be between 10 and 1000." };
  }
  if (threshold > expected) {
    return {
      error: "Anonymity threshold cannot exceed expected participants.",
    };
  }
  if (language !== "en" && language !== "it") {
    return { error: "Choose a supported language." };
  }

  const supabase = await requireUserClient();
  const { error } = await supabase.rpc("create_campaign", {
    p_title: title,
    p_class_display_name: className,
    p_expected_participant_count: expected,
    p_minimum_response_threshold: threshold,
    p_language: language,
  });

  if (error) {
    return { error: "We couldn't create the campaign. Please try again." };
  }

  revalidatePath("/teacher/dashboard");
  return {};
}

export async function startRoundAction(formData: FormData): Promise<void> {
  const campaignId = String(formData.get("campaignId") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();

  const supabase = await requireUserClient();
  await supabase.rpc("start_new_round", {
    p_campaign_id: campaignId,
    p_display_name: displayName.length > 0 ? displayName : null,
  });

  revalidatePath("/teacher/dashboard");
}

export async function setRoundStatusAction(formData: FormData): Promise<void> {
  const roundId = String(formData.get("roundId") ?? "");
  const status = String(formData.get("status") ?? "");

  const supabase = await requireUserClient();
  await supabase.rpc("set_round_status", {
    p_round_id: roundId,
    p_status: status,
  });

  revalidatePath("/teacher/dashboard");
  revalidatePath(`/teacher/rounds/${roundId}`);
}
