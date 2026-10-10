import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";
export const useAudit = () => useMutation(orpc.audit.run.mutationOptions());
export const useEnquiry = () => useMutation(orpc.enquiry.create.mutationOptions());
export const useHistory = () => useQuery(orpc.audit.history.queryOptions());
export const useLeads = () => useQuery(orpc.crm.list.queryOptions());
export const useCustomer = () => useQuery(orpc.billing.customer.queryOptions());
export const useCheckout = () => useMutation(orpc.billing.checkout.mutationOptions());
export const usePortal = () => useMutation(orpc.billing.portal.mutationOptions());
export function useCreateLead() {
  const q = useQueryClient();
  return useMutation(
    orpc.crm.create.mutationOptions({
      onSuccess: () => q.invalidateQueries({ queryKey: orpc.crm.key() }),
    }),
  );
}
export function useUpdateLead() {
  const q = useQueryClient();
  return useMutation(
    orpc.crm.update.mutationOptions({
      onSuccess: () => q.invalidateQueries({ queryKey: orpc.crm.key() }),
    }),
  );
}
export function useRemoveLead() {
  const q = useQueryClient();
  return useMutation(
    orpc.crm.remove.mutationOptions({
      onSuccess: () => q.invalidateQueries({ queryKey: orpc.crm.key() }),
    }),
  );
}
