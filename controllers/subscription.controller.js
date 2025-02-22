import { workflowClient } from '../config/upstash';
import Subscription from '../models/subscription.model';
import { SERVER_URL } from '../config/env'; // Ensure SERVER_URL is defined

export const createSubscription = async (req, res) => {
  try {
    const subscription = new Subscription(req.body);
    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    // Trigger workflow before sending the error response
    try {
      await workflowClient.trigger({
        url: `${SERVER_URL}`
      });
    } catch (workflowError) {
      console.error('Failed to trigger workflow:', workflowError.message);
    }
    // Send error response after attempting to trigger the workflow
    res.status(400).json({ error: error.message });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);
    if (subscription) {
      return res.json(subscription);
    }
    res.status(404).json({ error: 'Subscription not found' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndUpdate(id, req.body, { new: true });
    if (subscription) {
      return res.json(subscription);
    }
    res.status(404).json({ error: 'Subscription not found' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndDelete(id);
    if (subscription) {
      return res.json(subscription);
    }
    res.status(404).json({ error: 'Subscription not found' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};