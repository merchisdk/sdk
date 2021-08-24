import { Dictionary } from './dictionary';

export const jobStatusPayment = new Dictionary();

jobStatusPayment.add("INIT", 0);
jobStatusPayment.add("ISSUED", 1);
jobStatusPayment.add("OVERDUE", 2);
jobStatusPayment.add("PARTIAL_PAID", 3);
jobStatusPayment.add("FULLY_PAID", 4);

export const jobStatusDrafting = new Dictionary();

jobStatusDrafting.add("INIT", 0);
jobStatusDrafting.add("WAIT_DRAFTING", 1);
jobStatusDrafting.add("CHANGES_REQUESTED", 2);
jobStatusDrafting.add("DRAFTING_UPLOADED", 3);
jobStatusDrafting.add("DRAFTING_APPROVED", 4);

export const jobStatusProduction = new Dictionary();

jobStatusProduction.add("INIT", 0);
jobStatusProduction.add("REJECTED", 1);
jobStatusProduction.add("QUOTING", 2);
jobStatusProduction.add("ASSIGN_SENT", 3);
jobStatusProduction.add("ASSIGN_DEADLINE_REACHED", 4);
jobStatusProduction.add("ASSIGN_COMPLETE", 5);
jobStatusProduction.add("QUESTIONING", 6);
jobStatusProduction.add("COMMENCED", 7);
jobStatusProduction.add("FINISHED", 8);
jobStatusProduction.add("SHIPPED", 9);
jobStatusProduction.add("COMPLETED", 10);

export const jobStatusShipment = new Dictionary();

jobStatusShipment.add("NOT_ASSIGNED", 0);
jobStatusShipment.add("ASSIGNED", 1);
jobStatusShipment.add("DISPATCH_SET", 2);
jobStatusShipment.add("DISPATCH_WARNING", 3);
jobStatusShipment.add("DISPATCH_LATE", 4);
jobStatusShipment.add("DISPATCHED", 5);
jobStatusShipment.add("EXPECTED_RECEIVE_DATE_WARNING", 6);
jobStatusShipment.add("EXPECTED_RECEIVE_DATE_PAST", 7);
jobStatusShipment.add("RECEIVED", 8);

export const jobPriority = new Dictionary();

jobPriority.add('urgent', 1);
jobPriority.add('high', 2);
jobPriority.add('medium', 3);
jobPriority.add('low', 4);
