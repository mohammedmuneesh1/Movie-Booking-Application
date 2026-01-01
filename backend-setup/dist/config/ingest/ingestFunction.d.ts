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
//# sourceMappingURL=ingestFunction.d.ts.map