---
title: Pricing
description: An overview of Codemagic pricing
weight: 2
---

## CodePush Pricing

CodePush (Over-the-Air updates) for React Native projects is priced as follows: 

1. $99/month per 100k Monthly Active Users (MAU)
2. No limit on updates and bandwith
3. We can offer up to 12 months up front payment, otherwise billing is monthly. Invoicing is available starting 1M MAU.

| Monthly Active Users (MAUs) | Price (USD) |
|-----------------------------|-------------|
| 10,000                      | $99         |
| 100,000                     | $99         |
| 150,000                     | $198        |
| 500,000                     | $495        |
| 1,000,000                   | $990        |
| 2,000,000                   | $1,980      |
| 5,000,000                   | $4,950      |
| 10,000,000                  | $9,900      |

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
| Linux & Windows VMs          | $0.045 / minute                    |

## Pricing for Teams

### 1. Pay-as-you-go

For teams, all build minutes using macOS M2 VM and Linux VM are charged at the rates shown below. 

Each extra build concurrency allows running an additional build in parallel. For example, adding two extra build concurrencies allows running a total of three builds in parallel. 

You can **add additional concurrencies** in the Codemagic web app by clicking 'Billing' in the left-hand menu and then clicking on your Team name. In the 'Billing Overview' you should click 'update' in the Build concurrency section and select the number of concurrencies you wish to add to your Team. 

Each additional concurrency is $49/month and you will be billed for each concurrency on the last day of each month.


| **Item**                     | **Price**                         |
| ---------------------------- | --------------------------------- | 
| macOS (M2) VM        | $0.095 / minute                   |                                                                                                                                   
| Linux & Windows VMs          | $0.045 / minute                   |                                                                       
| Extra build concurrency      | $49 / month                       | 

Consider an annual or Enterprise plan if more than three concurrent builds are required or if you would like unlimited build minutes on macOS (Apple Silicon M4), Linux, and Windows instances. 

### 2. Fixed Annual Plans

The following optons are available for teams with different macOS machines:

{{< tabpane >}}
{{< tab header="macOS M2">}}
{{<markdown>}}
An annual subscription with access to **macOS M2s** instances and **2 months free** is **$3,990/year**.

The Codemagic **macOS M2** annual plan gives you a fixed-price plan with the following benefits:

* 3 concurrencies (with access to macOS M2, Linux, and Windows instances)
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

* 3 concurrencies (with access to macOS M4, Linux, and Windows instances)
* Unlimited build minutes
* Unlimited team seats
* In-app chat support
* Additional concurrencies are **$1,800/year**. 

The **macOS M4** annual plan can only be paid with a credit card.

To request this plan, please contact us [here](https://codemagic.io/pricing/#enterprise)
{{</markdown>}}
{{< /tab >}}

{{< tab header="macOS M4 Pro" >}}
{{<markdown>}}
An annual subscription with access to **macOS M4 Pro** instances is **$10,830/year**.

The Codemagic **macOS M4 Pro** annual plan gives you a fixed-price plan with the following benefits:

* 3 concurrencies (with access to macOS M4 Pro, Linux, and Windows instances)
* Unlimited build minutes
* Unlimited team seats
* In-app chat support
* Additional concurrencies are **$3,610/year**. 

The **macOS M4 Pro** annual plan can only be paid with a credit card.

To request this plan, please contact us [here](https://codemagic.io/pricing/#enterprise)
{{</markdown>}}
{{< /tab >}}

{{< tab header="macOS M2 Max Studio" >}}
{{<markdown>}}
An annual subscription with access to **macOS M2 Max Studio** instances is **$11,830/year**.

The Codemagic **macOS M2 Max Studio** annual plan gives you a fixed-price plan with the following benefits:

* 3 concurrencies (with access to macOS M2 Max Studio, Linux, and Windows instances)
* Unlimited build minutes
* Unlimited team seats
* In-app chat support
* Additional concurrencies are **$3,943/year**. 

The **macOS M2 Max Studio** annual plan can only be paid with a credit card.

To request this plan, please contact us [here](https://codemagic.io/pricing/#enterprise)
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}


## Pricing for Enterprises

macOS M4 and M4 Pro machines are available with the following Enterprise subscriptions:

{{< tabpane >}}

{{< tab header="Enterprises with macOS M4" >}}
{{<markdown>}}

Enterprise plans are available starting from **$12k/year** and include the following:

- Unlimited access to all VM types (including macOS M4) 
- 180-minute build timeout
- Priority support
- Service level agreement
- Account management services
- Technical account manager
- Private Slack/Discord/MS Teams channel
- SSO Login (OpenID, OAuth2 or SAML 2.0)
- OpenID Connect (on request)
{{</markdown>}}
{{< /tab >}}

{{< tab header="Enterprises with macOS M4 Pro" >}}
{{<markdown>}}
Enterprise plans are available starting from **$17,400/year** and include the following:

- Unlimited access to all VM types (including macOS M4 Pro) 
- 180-minute build timeout
- Priority support
- Service level agreement
- Account management services
- Technical account manager
- Private Slack/Discord/MS Teams channel
- SSO Login (OpenID, OAuth2 or SAML 2.0)
- OpenID Connect (on request)
{{</markdown>}}
{{< /tab >}}
{{< /tabpane >}}

Dedicated **Mac mini M4 Pro** and **Mac mini M2 Max Studio** **hosts** are also available on request. A dedicated host is only used by your organization and provides 2 VMs that can be configured with the software you require. Dedicated hosts can also be EU-based.

This plan is recommended if you need to go through a **security compliance process**, **vendor registration** or have special requirements such as an **NDA**, **DPA**, **dedicated hosts**, or **custom base images** or other account management services.

Annual invoicing with bank transfer is available for Enterprise plans. Payment is also possible via AWS Marketplace [here](https://aws.amazon.com/marketplace/pp/prodview-hiscwaznkehlo?sr=0-1&ref_=beagle&applicationId=AWSMPContessa) and Google Cloud Marketplace.

Please also note that we have completed our SOC 2 Type 2 assessment, and the report is available on request. 

If you would like more information about our Enterprise plan, please contact us [here](https://codemagic.io/pricing/#enterprise). 

## Resellers

It's possible to resell the Codemagic Enterprise plan. Contact us [here](https://codemagic.io/pricing/#enterprise) for further details. 

## Dedicated Hosts

If you need specific software and tools available on a builder machine we can provide dedicated macOS host machines which give you 2 VMs. 

| Dedicated Host Type    | Cost (per year) |
|------------------------|-----------------|
| macOS M4 Pro           | $8,000          |
| macOS M2 Max Studio    | $9,000          |

Annual dedicated host plans can be paid for with a credit card and invoicing with bank transfer is available.

For more information contact us [here](https://codemagic.io/pricing/#enterprise).

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
| macOS M4 Pro VM          | Mac mini M4 Pro 14-core CPU / 32GB RAM                                          |
| macOS M2 Max Studio      | Max Studio M2 14-core CPU / 32GB RAM / 30 Core GPU                              |
| Linux VM                 | 8 vCPUs, 32 GB memory                                                           |
| Windows VM               | 8 vCPUs, 32 GB memory  

{{<notebox>}}
To access more powerful macOS M2 Max Studio, and M2 Ultra machines, please get in touch with us [here](https://codemagic.io/pricing/#enterprise).
{{</notebox>}}

If you are planning to run instrumentation tests with Android emulators, it is advised to use Linux instances. Please note that Android emulators are not available on macOS M2 VMs due to the Apple Virtualization Framework not supporting nested virtualization.

If you need more powerful Linux or macOS machines, please contact us [here](https://codemagic.io/pricing/#enterprise).

For Linux instances, details of the hardware specification, system information, and pre-installed software can be found [here](https://docs.codemagic.io/specs/versions-linux/)

For macOS instances, details of the hardware specification, system information, and pre-installed software can be found [here](https://docs.codemagic.io/specs/versions-macos/)  

For Windows instances, details of the hardware specification, system information, and pre-installed software can be found [here](https://docs.codemagic.io/specs/versions-windows/)  

