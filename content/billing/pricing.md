---
title: Pricing
description: An overview of Codemagic pricing
weight: 2
---
## Pricing for Individuals
### 1. Free plan

This plan is suitable for individuals working on hobby or indie projects. You can also use this plan for running a proof of concept.

Individuals receive **500 free minutes** per month on macOS M1 machines on a personal account. These 500 free minutes are **reset on the 1st of each month**. Free minutes are not available if you are using a Team. 

You cannot invite collaborators to an individual plan.

To start using Codemagic for free, [sign up here](https://codemagic.io/signup). 

### 2. Buying Additional Minutes

You can enable billing on personal accounts and pay for any additional minutes you want to use. You will still have **500 free build minutes** on macOS M1 VM. To enable billing, proceed [here](https://codemagic.io/billing). 

Postpaid minutes are billed on the first day of the following month in which they were used.

Usage on macOS M1 VM that exceeds 500 minutes is charged at the rate shown below.

Builds on macOS Intel VM, Linux, and Windows do not have free build minutes. The per-minute pricing for each instance type is shown below.

| **Item**                     | **Price**                          |
| ---------------------------- | ---------------------------------  |
| macOS (M1 & Intel) VM        | $0.095 / minute                    |
| Linux & Windows VMs          | $0.045 / minute                    |

## Pricing for Teams

### 1. Pay-as-you-go

For teams, all build minutes using macOS M1 VM, macOS Intel VM, and Linux VM are charged at the rates shown below. 

Each extra build concurrency allows running an additional build in parallel. For example, adding two extra build concurrencies allows running a total of three builds in parallel. 

You can **add additional concurrencies** in the Codemagic web app by clicking 'Billing' in the left-hand menu and then clicking on your Team name. In the 'Billing Overview' you should click 'update' in the Build concurrency section and select the number of concurrencies you wish to add to your Team. 

Each additional concurrency is $49/month and you will be billed for each concurrency on the last day of each month.


| **Item**                     | **Price**                         |
| ---------------------------- | --------------------------------- | 
| macOS (M1 & Intel) VM        | $0.095 / minute                   |                                                                                                                                   
| Linux & Windows VMs          | $0.045 / minute                   |                                                                       
| Extra build concurrency      | $49 / month                       | 

Consider an annual or Enterprise plan if more than three concurrent builds are required or if you would like unlimited build minutes on macOS (Intel and Apple Silicon M2), Linux, and Windows instances. 


macOS M2 is not currently available as a pay-as-you-go instance type but is available for the fixed annual plan as described below.

### 2. Fixed Annual Plan

An annual subscription with access to **Mac mini M2 VMs** and **2 months free** is **$3,990/year**.

The Codemagic annual plan gives you a fixed-price plan with the following benefits:

* 3 concurrencies (with access to Mac mini M2, Linux, and Windows instances)
* Unlimited build minutes
* Unlimited team seats
* In-app chat support
* Additional concurrencies are **$1500/year**. 

The fixed monthly and annual plans can only be paid for with a credit card.

If you have already created a Team in the Codemagic web app, you can upgrade to the annual plan as follows:

1. Log in to Codemagic.
2. Click **Billing** in the left-hand menu.
3. Click on your Team account.
4. Click on the **Enable billing** button.
5. Enter your **credit card** details and **company information**.
6. Once you have entered your details, pay-as-you-go billing will be enabled. To upgrade to the annual Professional plan, click on the **Upgrade** button and follow the instructions to subscribe to the Professional plan.

If you require additional concurrencies or have any other questions about the annual plan, including requests for **macOS M2 instances**,  please contact us [here](https://codemagic.io/contact/).

If you require annual invoicing, please refer to the Enterprise plans below.

## Pricing for Enterprises

Enterprise plans are available starting from **$12k/year** and include the following:

- Unlimited access to all VM types (including macOS M2) 
- 180-minute build timeout
- Priority support
- Service level agreement
- Account management services
- Technical account manager
- Private Slack channel
- SSO Login (OpenID, OAuth2 or SAML 2.0)


Dedicated macOS hosts (Intel or Apple silicon) are also available on request. A dedicated host is only used by your organization and provides 2 VMs that can be configured with the software you require. Dedicated hosts can also be EU-based.

This plan is recommended if you need to go through a **security compliance process**, **vendor registration** or have special requirements such as an **NDA**, **DPA**, **dedicated hosts**, or **custom base images** or other account management services.

Annual invoicing with bank transfer is available for Enterprise plans. Payment is also possible via AWS Marketplace [here](https://aws.amazon.com/marketplace/pp/prodview-hiscwaznkehlo?sr=0-1&ref_=beagle&applicationId=AWSMPContessa)

Please also note that we have started working towards SOC2 certification and should be certified soon.

If you would like more information about our Enterprise plan, please contact us [here](https://codemagic.io/enterprise/). 

## Resellers

It's possible to resell the Codemagic Enterprise plan. Contact us [here](https://codemagic.io/enterprise/) for further details. 

## Dedicated Hosts

If you need specific software and tools available on a builder machine we can provide dedicated macOS host machines which give you 2 VMs. 

Dedicated macOS M2 or macOS Intel hosts are available for $449/month, paid annually with **20% discount** comes to **$4,310/year**. 

Annual dedicated host plans can be paid for with a credit card and invoicing with bank transfer is available.

For more information contact us [here](https://codemagic.io/contact/).

## Build history and artifact storage

Build history and artifact retention time depend on your account type and pricing plan.

<br>

| **Account type**  |  **Retention period** |
|---------------|-------------------|
| Personal accounts | Build history and artifacts of apps on the personal account are stored in Codemagic for **30 days** after which they are deleted. | 
| Teams on Pay as you go plan | Build history and artifacts of apps on the team account with Pay as you go pricing are stored in Codemagic for **60 days** after which they are deleted.| 
| Teams on Professional or Enterprise plan | Unlimited | 

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
| macOS M1 VM              | 3.2GHz Quad Core / 8GB                                                          |
| macOS Intel VM           | 3.7GHz Quad Core / 32GB                                                         |
| Linux VM                 | 8 vCPUs, 32 GB memory                                                           |
| Windows VM               | 8 vCPUs, 32 GB memory  

If you are planning to run instrumentation tests with Android emulators, it is advised to use Linux instances. Android emulators are more stable on Linux VMs than on macOS VMs. Also, please note that Android emulators are not available on macOS M1 or M2 VMs.

If you need more powerful Linux or macOS machines, please contact us [here](https://codemagic.io/contact/).

For Linux instances, details of the hardware specification, system information, and pre-installed software can be found [here](https://docs.codemagic.io/specs/versions-linux/)

For macOS instances, details of the hardware specification, system information, and pre-installed software can be found [here](https://docs.codemagic.io/specs/versions3/)  

For Windows instances, details of the hardware specification, system information, and pre-installed software can be found [here](https://docs.codemagic.io/specs/versions-windows/)  

