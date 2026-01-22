---
title: Pricing
description: An overview of Codemagic pricing
weight: 2
---

## CodePush Pricing

CodePush (Over-the-Air updates) for React Native projects is priced as follows: 

1. $99/month per 100k Monthly Active Users (MAU)
2. No limit on updates and bandwidth
3. We can offer up to 12 months up front payment, otherwise billing is monthly. Invoicing is available starting 1M MAU.

{{<notebox>}}
🔔 Annual subscriptions get 2 months of free usage discount.
{{</notebox>}}

| Monthly Active Users (MAUs) | Monthly price (USD) | Yearly price (USD)   |
|-----------------------------|---------------------|----------------------|
| 10,000                      | $99                 | $990                 |
| 100,000                     | $99                 | $990                 |
| 150,000                     | $198                | $1,980               |
| 500,000                     | $495                | $4,950               |
| 1,000,000                   | $990                | $9,900               | 
| 2,000,000                   | $1,980              | $19,800              |
| 5,000,000                   | $4,950              | $49,500              |
| 10,000,000                  | $9,900              | $99,000              |

## Pricing for Individuals
### 1. Free plan

This plan is suitable for individuals working on hobby or indie projects. You can also use this plan for running a proof of concept.

Individuals receive **500 free minutes** per month on macOS M2 machines on a personal account. These 500 free minutes are **reset on the 1st of each month**. Free minutes are not available if you are using a Team. 

You cannot invite collaborators to an individual plan.

To start using Codemagic for free, [sign up here](https://codemagic.io/signup). 

### 2. Buying Additional Minutes

You can enable billing on personal accounts and pay for any additional minutes you want to use. You will still have **500 free build minutes** on macOS M2 VM. To enable billing, proceed [here](https://codemagic.io/billing). 

Postpaid minutes are billed on the first day of the following month in which they were used.

Usage on macOS M2 VM that exceeds 500 minutes is charged at the rate shown below.

Builds on Linux and Windows do not have free build minutes. The per-minute pricing for each instance type is shown below.

| **Item**                     | **Price**                          |
| ---------------------------- | ---------------------------------  |
| macOS (M2) VM        | $0.095 / minute                    |
| macOS (M4) VM        | $0.114 / minute                    |
| Linux X2 & Windows VMs          | $0.045 / minute                    |

## Pricing for Teams

### 1. Pay-as-you-go

For teams, all build minutes using macOS M2 VM, macOS M4 VM, Linux VM, and Windows VM are charged at the rates shown below.

Each extra build concurrency allows running an additional build in parallel. For example, adding two extra build concurrencies allows running a total of three builds in parallel. 

You can **add additional concurrencies** in the Codemagic web app by clicking 'Billing' in the left-hand menu and then clicking on your Team name. In the 'Billing Overview' you should click 'update' in the Build concurrency section and select the number of concurrencies you wish to add to your Team. 

Each additional concurrency is $49/month and you will be billed for each concurrency on the last day of each month.


| **Item**                   | **Price**       |
| -------------------------- | --------------- |
| macOS (M2) VM              | $0.095 / minute |
| macOS (M4) VM              | $0.114 / minute |
| Linux X2 & Windows VMs     | $0.045 / minute |
| Extra build concurrency    | $49 / month     | 

Consider an annual or Enterprise plan if more than three concurrent builds are required or if you would like unlimited build minutes on macOS (Apple Silicon M4 Max), Linux, and Windows instances.

### 2. Fixed Annual Plans

The following optons are available for teams with different macOS machines:

{{< tabpane >}}
{{< tab header="macOS M2">}}
{{<markdown>}}
An annual subscription with access to **macOS M2s** instances and **2 months free** is **$3,990/year**.

The Codemagic **macOS M2** annual plan gives you a fixed-price plan with the following benefits:

* 3 concurrencies (with access to macOS M2, Linux X2, and Windows instances)
* Unlimited build minutes
* Unlimited team seats
* In-app chat support
* Additional concurrencies are **$1,500/year**. 

The fixed annual plan can only be paid with a credit card.

If you have already created a Team in the Codemagic web app, you can upgrade to the annual plan as follows:

1. Log in to Codemagic.
2. Click **Billing** in the left-hand menu.
3. Click on your Team account.
4. Click on the **Enable billing** button.
5. Enter your **credit card** details and **company information**.
6. Once you have entered your details, pay-as-you-go billing will be enabled. To upgrade to the Fixed Annual plan, click on the **Upgrade** button and follow the instructions to subscribe to the Fixed Annual plan.

If you require additional concurrencies or have any other questions about the annual plan, including requests for **macOS M4 instances**,  please contact us [here](https://codemagic.io/pricing/#enterprise).

If you require annual invoicing, please refer to the Enterprise plans below.
{{</markdown>}}
{{< /tab >}}

{{< tab header="macOS M4" >}}
{{<markdown>}}
An annual subscription with access to **macOS M4** instances is **$5,400/year**.

The Codemagic **macOS M4** annual plan gives you a fixed-price plan with the following benefits:

* 3 concurrencies (with access to macOS M4, Linux X2, and Windows instances)
* Unlimited build minutes
* Unlimited team seats
* In-app chat support
* Additional concurrencies are **$1,800/year**. 

The **macOS M4** annual plan can only be paid with a credit card.

To request this plan, please contact us [here](https://codemagic.io/pricing/#enterprise)
{{</markdown>}}
{{< /tab >}}

{{< tab header="macOS M4 + Linux X4" >}}
{{<markdown>}}
An annual subscription with access to **macOS M4** and **Linux X4** instances is **$8,100/year**.

The Codemagic **macOS M4 + Linux X4** annual plan gives you a fixed-price plan with the following benefits:

* 3 concurrencies (with access to macOS M4, Linux X4, and Windows instances)
* Unlimited build minutes
* Unlimited team seats
* In-app chat support
* Additional concurrencies are **$2,700/year**. 

The **macOS M4 + Linux X4** annual plan can only be paid with a credit card.

To request this plan, please contact us [here](https://codemagic.io/pricing/#enterprise)
{{</markdown>}}
{{< /tab >}}

{{< tab header="macOS Mac Studio M4 Max" >}}
{{<markdown>}}

The Codemagic **macOS Mac Studio M4 Max** annual plan gives you a fixed-price plan with the following benefits:

* 3 concurrencies (with access to macOS Mac Studio M4 Max, Linux X2, and Windows instances)
* Unlimited build minutes
* Unlimited team seats
* In-app chat support

The **macOS Mac Studio M4 Max** annual plan can only be paid with a credit card.

To request this plan, please contact us [here](https://codemagic.io/pricing/#enterprise)
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}

## Burstable concurrencies

Burstable concurrencies allow you to use more concurrencies than you otherwise would have available during peak times and pay **1/3** of the price for those concurrencies. If queue time is important for you, you can have a reserve of concurrencies available to use during high demand so you don’t build up a queue. Similarly if you’re making a big release that would otherwise take a long time you could use burstable concurrencies. 

{{<notebox>}}
🔔 Burstable concurrencies are available starting from 10 concurrencies and you will get billed monthly using the 95th percentile method. 
{{</notebox>}}

To determine which concurrencies are bursted and which ones are not we divide billing period into 5 second intervals and sample concurrency usage every 5 seconds. We then reorder this graph in descending order so the left of the graph is consisting of high use of concurrency and tail end of the graph is low use of concurrency. We then discard 5% of the high use as “bursting” and consider only the use at 95th percentile.

If you subscribe to 20 concurrencies and consume 10 within the 95th percentile, then you pay full price for 10 and **1/3** of the price for the remaining 20.

## Pricing for Enterprises

This plan is recommended if you need to go through a **security compliance process**, **vendor registration** or have special requirements such as an **NDA**, **DPA**, **dedicated hosts**, **custom base images**, or other account management services. Enterprise plan pricing starts from $12k/year.

The following options are available with the Enterprise offering:


{{< tabpane >}}

{{< tab header="macOS M4" >}}
{{<markdown>}}

- Unlimited builds on: 
  - macOS M4 (Mac mini M4 10-core CPU / 16GB RAM)
  - Linux X4 (16 vCPUs, 64 GB memory)
  - Windows (8 vCPUs, 32 GB memory)
- 180-minute build timeout
- Priority support
- Private Slack/Discord/MS Teams channel
- Service level agreement
- Account management services
- Technical account manager
- Audit Log Connector
- Build Analytics Dashboard
- SSO Login (OpenID, OAuth2 or SAML 2.0)
- OpenID Connect (on request)

If you would like more information about our Enterprise plan, please contact us [here](https://codemagic.io/pricing/#enterprise).

{{</markdown>}}
{{< /tab >}}

{{< tab header="macOS Studio M4 Max" >}}
{{<markdown>}}

- Unlimited builds on:  
  - macOS Studio M4 Max (Mac Studio M4 Max 16-core CPU / 32GB RAM)
  - Linux X4 (16 vCPUs, 64 GB memory)
  - Windows instances (8 vCPUs, 32 GB memory)
- 180-minute build timeout
- Priority support
- Private Slack/Discord/MS Teams channel
- Service level agreement
- Account management services
- Technical account manager
- Audit Log Connector
- Build Analytics Dashboard
- SSO Login (OpenID, OAuth2 or SAML 2.0)
- OpenID Connect (on request)

If you would like more information about our Enterprise plan, please contact us [here](https://codemagic.io/pricing/#enterprise).

{{</markdown>}}
{{< /tab >}}

{{< tab header="Virtual Private Cloud" >}}
{{<markdown>}}


A Virtual Private Cloud (VPC) of dedicated **Mac mini M4** or **Mac Studio M4 Max** hosts can be set up for your organization. 

It is only used by your organization and provides 2 VMs that can be configured with the software you require. 

Dedicated hosts can also be EU-based if you have specific data residency requirements.

If you would like more information about our Enterprise plan, please contact us [here](https://codemagic.io/pricing/#enterprise).

{{</markdown>}}
{{< /tab >}}


{{< tab header="Enterprise Billing" >}}
{{<markdown>}}

Annual invoicing with bank transfer is available for Enterprise plans. 

Payment is also possible via **AWS Marketplace** and **Google Cloud Marketplace** private offers.

Discounts are available for multi year contracts.

Codemagic is **SOC 2 Type II** audited and the report is available on request. 

If you would like more information about our Enterprise plan, please contact us [here](https://codemagic.io/pricing/#enterprise).

{{</markdown>}}
{{< /tab >}}



{{< /tabpane >}}

## Resellers

It's possible to resell the Codemagic Enterprise plan. Contact us [here](https://codemagic.io/pricing/#enterprise) for further details. 

## Build history and artifact storage

Build history and artifact retention time depend on your account type and pricing plan.

<br>

| **Account type**  |  **Retention period** |
|---------------|-------------------|
| Personal accounts | Build history and artifacts of apps on the personal account are stored in Codemagic for **30 days** after which they are deleted. | 
| Teams on Pay as you go plan | Build history and artifacts of apps on the team account with Pay as you go pricing are stored in Codemagic for **60 days** after which they are deleted.| 
| Teams on Fixed Annual or Enterprise plan | Unlimited | 

### Backing up build artifacts

If you need to support older versions of your application and need access to old versions of your `ipa`, `apk`, `dSYM`, and proguard mapping files to debug issues, then these should be downloaded and stored outside Codemagic. Once they have been deleted from Codemagic, they cannot be retrieved.

You can download build artifacts via the Codemagic UI or using the [Codemagic REST API](../rest-api/builds/). 

To keep copies of your future build artifacts, we advise you to set up publishing to external storage, see an example [here](../yaml-publishing/aws/).

### Instance Types

Codemagic provides macOS, Windows, and Linux instance types.

The instance types and hardware specifications can be found below.


| **Item**                 | **Specification**                                                               |
| ------------------------ | --------------------------------------------------------------------------------|
| macOS M2 VM              | Mac mini M2 8-core CPU / 8GB RAM                                                |
| macOS M4 VM              | Mac mini M4 10-core CPU / 16GB RAM                                              |
| macOS Studio M4 Max VM   | Mac Studio M4 Max 16-core CPU / 32GB RAM                                        |
| Linux X2 VM              | 8 vCPUs, 32 GB memory                                                           |
| Linux X4 VM              | 16 vCPUs, 64 GB memory                                                          |
| Windows VM               | 8 vCPUs, 32 GB memory  

{{<notebox>}}
To access more powerful macOS M4 Max Studio and Linux X4, please get in touch with us [here](https://codemagic.io/pricing/#enterprise).
{{</notebox>}}

If you are planning to run instrumentation tests with Android emulators, it is advised to use Linux instances. Please note that Android emulators are not available on macOS M2 VMs due to the Apple Virtualization Framework not supporting nested virtualization.

For Linux instances, details of the hardware specification, system information, and pre-installed software can be found [here](https://docs.codemagic.io/specs/versions-linux/)

For macOS instances, details of the hardware specification, system information, and pre-installed software can be found [here](https://docs.codemagic.io/specs/versions-macos/)  

For Windows instances, details of the hardware specification, system information, and pre-installed software can be found [here](https://docs.codemagic.io/specs/versions-windows/)  

