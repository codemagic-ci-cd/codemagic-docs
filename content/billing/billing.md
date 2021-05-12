---
title: Billing
weight: 1
---

In order to use the paid features of Codemagic (see our pricing [here](https://codemagic.io/pricing/)), you must enable billing. 

Note that:
* Build time usage is counted separately for your personal account and each team. 
* Billing is managed separately for your personal account and each [team](../teams/teams). 

## Enabling billing

Billing can be enabled for your personal account or team on the **Billing** page that is accessible from the left navigation bar.

On clicking **Enable billing**, you will be asked to enter credit card information or offered the option to select an existing credit card if you have had billing enabled previously. To finish, click **Confirm and enable billing**.

When billing is enabled, you will be charged monthly based on usage.

## Managing billing and updating billing details

To manage billing for your team or personal account, navigate to the **Billing** page and select the team or account. 

When billing is enabled, you will see the current usage, the due amount and the next payment date. This is also where you can download the invoices for previous billing periods.

### Updating billing details

Click on **Update billing details** to change the billing information or add additional details, such as company name, billing email, address and tax ID.

### Changing card

To change the card used for payments, click **Edit** in the credit card section under the billing details. You can then click **Add new card** to register a new card or select a different card from already registered cards.

### Disabling billing

To disable billing, click **Disable billing** in the Billing details section. On disabling billing, you will be immediately charged for the used paid features.

Note that you may only disable billing if there are no unpaid invoices. In case you have unpaid invoices, please verify or update your card information. Then navigate to Billing history and find any invoice that is not in paid status. Finally, open up each not paid invoice and click **Pay invoice** to retry the payment.

## Billing per team user

For pay-as-you-go team plans, each team user is billed at the rate on the [pricing page](https://codemagic.io/pricing/). See the [counting team users](../teams/users) guide for details on how we count team users.

## Billing per build minute

For pay-as-you-go team and user plans, each build minute is billed at the rate on our [pricing page](https://codemagic.io/pricing/) based on the build [machine type](../specs/machine-type) used for the build. Builds that time out or fail because of a Codemagic service error will not count towards billing usage. Builds that fail for any other reason will count towards billing usage.

## Overdue invoices

Invoices that have not been paid on the due date are shown as "Overdue" on the [Billing](https://codemagic.io/billing/) page. This usually happens when there are problems with charging the card, of which team or account owners are notified by email. Codemagic will then attempt to retry the payment in 3, 5 or 7 days. If all retries for a payment fail, the subscription is cancelled.

Team or account owners can manually retry the payment by clicking on the overdue invoice in **Billing history** and selecting **Pay invoice** on the popup with invoice details.
