"use server";
import { getCustomerPlans } from "@/actions/services/service"; // Adjust the path as needed

export async function getCustomerPlansAction() {
  return await getCustomerPlans();
}