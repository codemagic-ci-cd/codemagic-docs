---
title: Billing
description: How to enable billing and manage your payments
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

Tax ID is only available for team accounts and not personal teams. 

### Changing card

To change the card used for payments, click **Edit** in the credit card section under the billing details. You can then click **New card** to register a new card or select a different card from already registered cards.

### Disabling billing

To disable billing, click **Disable billing** in the Billing details section. On disabling billing, you will be immediately charged for the used paid features.

Note that you may only disable billing if there are no unpaid invoices. In case you have unpaid invoices, please verify or update your card information. Then navigate to Billing history and find any invoice that is not in paid status. Finally, open up each unpaid invoice and click **Pay invoice** to retry the payment.

## Billing per build minute

For pay-as-you-go team and user plans, each build minute is billed at the rate on our [pricing page](https://codemagic.io/pricing/) based on the build [machine type](../specs/machine-type) used for the build. Builds that time out or fail because of a Codemagic service error will not count towards billing usage. Builds that fail for any other reason will count towards billing usage.

## Overdue and failed invoice payments

Invoices that have not been paid on the due date are shown as "Overdue" or "Failed" on the [Billing](https://codemagic.io/billing/) page. This usually happens when there are problems with charging the card, of which team admins or account owners are notified by email. Codemagic will then attempt to retry the payment in 3, 5 or 7 days.

As soon as there is a failed invoice payment, your subscription will be put on hold and running builds will be disabled. In order to continue building, all invoices should be paid.

Team admins or account owners can manually retry the payment by clicking the **Pay invoice** button on the overdue/pending invoice in **Billing history**. This will redirect you to the Stripe-based payment website where you are required to add your credit card details and click **Make Payment**.

{{<notebox>}}
**Pending invoices**: Some invoices may remain pending due to issues with the payment. This can happen when international payments on your card are disabled or when automatic payments are not allowed in which case the first payment has to be made manually to comply with the new RBI regulations for Indian cardholders. Team admins or account owners can then manually retry the payment as described above.
{{</notebox>}}

Note that overdue invoices should be paid before the subscription can be disabled. Please refer to the [Disable billing](/billing/billing/#disabling-billing) section for further info.

## Tax certificates

The following certificates are available for download:

- [Tax residency certificate](https://drive.google.com/file/d/1PmP-qSs8dcHO0JC1SxZb7dotwkw5-iGN/view?usp=sharing)
- [W-8BEN-E certificate](https://drive.google.com/file/d/1adCRr0p3Agzhc7PpFt5pI2dMdbyIndU2/view?usp=sharing)
