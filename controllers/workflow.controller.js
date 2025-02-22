import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import Subscription from '../models/subscription.model';

// Define the number of days before renewal to send reminders
const REMINDERS = [7, 5, 2, 1];

// Serve the workflow
export const sendReminders = serve(async (context) => {
    try {
        // Extract subscription ID from the request payload
        const { subscriptionId } = context.requestPayload;

        // Fetch the subscription details
        const subscription = await fetchSubscription(context, subscriptionId);

        // If the subscription is not found or not active, stop the workflow
        if (!subscription || subscription.status !== 'active') {
            console.log(`Subscription ${subscriptionId} is not active or does not exist. Stopping workflow.`);
            return;
        }

        // Parse the renewal date
        const renewalDate = dayjs(subscription.renewalDate);

        // Check if the renewal date has already passed
        if (renewalDate.isBefore(dayjs())) {
            console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
            return;
        }

        // Loop through the reminder days and schedule reminders
        for (const daysBefore of REMINDERS) {
            const reminderDate = renewalDate.subtract(daysBefore, 'day');

            // If the reminder date is in the future, sleep until then
            if (reminderDate.isAfter(dayjs())) {
                await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
            }

            // Trigger the reminder
            await triggerReminder(context, `Reminder ${daysBefore} days before`);
        }
    } catch (error) {
        console.error('Error in sendReminders workflow:', error.message);
    }
});

// Fetch subscription details
const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('Fetch subscription', async () => {
        return await Subscription.findById(subscriptionId).populate('user', 'name email');
    });
};

// Sleep until the reminder date
const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
};

// Trigger the reminder
const triggerReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Triggering ${label} reminder`);
    });
}; 