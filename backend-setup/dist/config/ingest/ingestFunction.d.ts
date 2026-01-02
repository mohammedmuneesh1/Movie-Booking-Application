import { Inngest } from "inngest";
/**
 * 1️⃣ Create Inngest client
 * This is REQUIRED. Inngest is NOT a function.
 */
export declare const inngest: Inngest<{
    id: string;
    eventKey: string;
}>;
/**
 * 2️⃣ Inngest function:
 * - waits 10 minutes
 * - checks payment
 * - releases seats
 * - deletes booking if unpaid
 */
export declare const releaseSeatsAndDeleteBookings: import("inngest").InngestFunction<Omit<import("inngest").InngestFunction.Options<Inngest<{
    id: string;
    eventKey: string;
}>, import("inngest").InngestMiddleware.Stack, [{
    event: string;
}], import("inngest").Handler<Inngest<{
    id: string;
    eventKey: string;
}>, string, {
    error: Error;
    logger: import("inngest").Logger;
    event: import("inngest").FailureEventPayload<import("inngest").EventPayload<any>>;
}>>, "triggers">, ({ event, step }: import("inngest").Context<Inngest<{
    id: string;
    eventKey: string;
}>, string, {
    logger: import("inngest").Logger;
}>) => Promise<void>, import("inngest").Handler<Inngest<{
    id: string;
    eventKey: string;
}>, string, {
    error: Error;
    logger: import("inngest").Logger;
    event: import("inngest").FailureEventPayload<import("inngest").EventPayload<any>>;
}>, Inngest<{
    id: string;
    eventKey: string;
}>, import("inngest").InngestMiddleware.Stack, [{
    event: string;
}]>;
export declare const sendBookingConfirmationEmail: import("inngest").InngestFunction<Omit<import("inngest").InngestFunction.Options<Inngest<{
    id: string;
    eventKey: string;
}>, import("inngest").InngestMiddleware.Stack, [{
    event: string;
}], import("inngest").Handler<Inngest<{
    id: string;
    eventKey: string;
}>, string, {
    error: Error;
    logger: import("inngest").Logger;
    event: import("inngest").FailureEventPayload<import("inngest").EventPayload<any>>;
}>>, "triggers">, ({ event, step }: import("inngest").Context<Inngest<{
    id: string;
    eventKey: string;
}>, string, {
    logger: import("inngest").Logger;
}>) => Promise<void>, import("inngest").Handler<Inngest<{
    id: string;
    eventKey: string;
}>, string, {
    error: Error;
    logger: import("inngest").Logger;
    event: import("inngest").FailureEventPayload<import("inngest").EventPayload<any>>;
}>, Inngest<{
    id: string;
    eventKey: string;
}>, import("inngest").InngestMiddleware.Stack, [{
    event: string;
}]>;
export declare const sendShowReminders: import("inngest").InngestFunction<Omit<import("inngest").InngestFunction.Options<Inngest<{
    id: string;
    eventKey: string;
}>, import("inngest").InngestMiddleware.Stack, [{
    cron: string;
}], import("inngest").Handler<Inngest<{
    id: string;
    eventKey: string;
}>, "inngest/scheduled.timer", {
    error: Error;
    logger: import("inngest").Logger;
    event: import("inngest").FailureEventPayload<import("inngest").EventPayload<any>>;
}>>, "triggers">, ({ step }: import("inngest").Context<Inngest<{
    id: string;
    eventKey: string;
}>, "inngest/scheduled.timer", {
    logger: import("inngest").Logger;
}>) => Promise<{
    sent: number;
    message: string;
    failed?: never;
    totalShows?: never;
    totalReminders?: never;
} | {
    sent: number;
    failed: number;
    totalShows: number;
    totalReminders: number;
    message: string;
}>, import("inngest").Handler<Inngest<{
    id: string;
    eventKey: string;
}>, "inngest/scheduled.timer", {
    error: Error;
    logger: import("inngest").Logger;
    event: import("inngest").FailureEventPayload<import("inngest").EventPayload<any>>;
}>, Inngest<{
    id: string;
    eventKey: string;
}>, import("inngest").InngestMiddleware.Stack, [{
    cron: string;
}]>;
export declare const sendNewShowNotifications: import("inngest").InngestFunction<Omit<import("inngest").InngestFunction.Options<Inngest<{
    id: string;
    eventKey: string;
}>, import("inngest").InngestMiddleware.Stack, [{
    event: string;
}], import("inngest").Handler<Inngest<{
    id: string;
    eventKey: string;
}>, string, {
    error: Error;
    logger: import("inngest").Logger;
    event: import("inngest").FailureEventPayload<import("inngest").EventPayload<any>>;
}>>, "triggers">, ({ event, step }: import("inngest").Context<Inngest<{
    id: string;
    eventKey: string;
}>, string, {
    logger: import("inngest").Logger;
}>) => Promise<{
    sent: number;
    failed: number;
    totalUsers: number;
    message: string;
}>, import("inngest").Handler<Inngest<{
    id: string;
    eventKey: string;
}>, string, {
    error: Error;
    logger: import("inngest").Logger;
    event: import("inngest").FailureEventPayload<import("inngest").EventPayload<any>>;
}>, Inngest<{
    id: string;
    eventKey: string;
}>, import("inngest").InngestMiddleware.Stack, [{
    event: string;
}]>;
export declare const sendPersonalShowReminder: import("inngest").InngestFunction<Omit<import("inngest").InngestFunction.Options<Inngest<{
    id: string;
    eventKey: string;
}>, import("inngest").InngestMiddleware.Stack, [{
    event: string;
}], import("inngest").Handler<Inngest<{
    id: string;
    eventKey: string;
}>, string, {
    error: Error;
    logger: import("inngest").Logger;
    event: import("inngest").FailureEventPayload<import("inngest").EventPayload<any>>;
}>>, "triggers">, ({ event, step }: import("inngest").Context<Inngest<{
    id: string;
    eventKey: string;
}>, string, {
    logger: import("inngest").Logger;
}>) => Promise<{
    success: boolean;
    reason: string;
    bookingId?: never;
    emailSentTo?: never;
    showTime?: never;
} | {
    success: boolean;
    bookingId: any;
    emailSentTo: any;
    showTime: any;
    reason?: never;
}>, import("inngest").Handler<Inngest<{
    id: string;
    eventKey: string;
}>, string, {
    error: Error;
    logger: import("inngest").Logger;
    event: import("inngest").FailureEventPayload<import("inngest").EventPayload<any>>;
}>, Inngest<{
    id: string;
    eventKey: string;
}>, import("inngest").InngestMiddleware.Stack, [{
    event: string;
}]>;
export declare function reminderEmailTemplate(data: {
    userName: string;
    movieTitle: string;
    showDateTime: Date;
}): string;
export declare function newShowAddedEmailTemplate(data: {
    userName: string;
    userEmail: string;
    movieTitle: string;
}): string;
export declare function movieReminderEmailTemplate(params: {
    userName: string;
    movieTitle: string;
    showTime: Date;
    bookedSeats: string[];
    bookingId: string;
    hoursUntilShow: number;
}): string;
//# sourceMappingURL=ingestFunction.d.ts.map