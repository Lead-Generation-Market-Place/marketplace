"use server";
import { getCustomerPlans } from "./services/service"; // Adjust the path as needed

export async function getCustomerPlansAction() {
  return await getCustomerPlans();
}