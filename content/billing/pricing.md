---
title: Pricing
weight: 2
---

## Pay as you go pricing

Pay as you go pricing allows you to pay for only what you use. 

Currently it is only possible to run one build at a time with pay as you go.

### Instance Types

Codemagic provides macOS and Linux instance types.

Premium VMs use more powerful hardware will run builds faster than standard VMs. 

The instance types and hardware specifications can be found below.


| **Item**        | **Specification**                                                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| macOS premium VM         | 3.7GHz Quad Core / 32GB                                                                                                                                                 |
| macOS standard VM        | 2.3GHz Quad Core / 8GB                                                                                                                                                 |
| Linux premium VM         | 8 vCPUs, 32 GB memory                                                                                                                                                 |
| Linux standard VM        | 4 vCPUs, 16 GB memory  

If you are planning to run instrumentation tests with Android emulators it is advised to use Linux instances. Android emulators are more stable on Linux VMs than on macOS VMs.

If you need more powerful Linux or macOS machines, please contact us [here](https://codemagic.io/contact/).

For Linux instances, details of the hardware specification, system information and pre-installed can be found [here](https://docs.codemagic.io/specs/versions-linux/)

For macOS instances, details of the hardware specification, system information and pre-installed can be found [here](https://docs.codemagic.io/specs/versions3/)  

### Pricing for Personal Accounts

When billing is enabled on personal accounts you have 500 free builds minutes on macOS standard VM. 

Usage on macOS standard VM that exceeds 500 minutes is charged at rate shown below.

Builds on macOS premium VM, Linux standard VM, and Linux premium VM do not have free build minutes and are charged at the rates shown below. 

| **Item**  | **Price**                                                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| macOS premium VM         | $0.095 / minute                                                                                                                                                 |
| macOS standard VM        | $0.038 / minute                                                                                                                                                 |
| Linux premium VM         | $0.045 / minute                                                                                                                                                 |
| Linux standard VM        | $0.015 / minute                                                                                                                                                 |

### Pricing for Teams

For teams, all build minutes using macOS standard VM, macOS premium VM, Linux standard VM, and Linux premium VM are charged at the rates shown below. 

Team users that were active in the current billing period are charged $10/month. To see how users are counted please see [here](https://docs.codemagic.io/teams/users/)

| **Item**  | **Price**                                                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| macOS premium VM         | $0.095 / minute                                                                                                                                                 |
| macOS standard VM        | $0.038 / minute                                                                                                                                                 |
| Linux premium VM         | $0.045 / minute                                                                                                                                                 |
| Linux standard VM        | $0.015 / minute                                                                                                                                                 |
| Team user                | $10 / month                                                                                                                                                     |                                                                                                                                                 |
| Extra build concurrency  | $49 / month                                                                                                                                                     | 

Each extra build concurrency allows to run an additional build in paralel. E.g. with 2 extra build concurrencies it's possible to run three builds in paralel. If your team requires more than two concurrencies, please consider Business plan or Enterprise plan.

## Business Plan

The Codemagic business plan gives you a fixed price plan with the following benefits:

* 3 concurrencies
* Unlimited build minutes
* Unlmited team seats
* In-app chat support

The **monthly** subscription is **$299/month** payable by credit card. Additional concurrencies are **$100/month**.

An **annual** subscription with **20% discount** is **$2,870/year**. Additional concurrencies are **$960/year**. 

Annual plans can be paid for with credit card and invoicing with bank transfer is available.

If you would like to upgrade to a business plan, please contact us [here](https://codemagic.io/contact/).


## Enterprise Plan

Enterprise plans are available from **$6,000/year**.

This plan is recommended if you need to go through a **procurement process** or have special requirements such as an **SLA**, **NDA**, **dedicated hosts**, or **custom base images**.

If you would like more information about our Enterprise plan, please contact us [here](https://codemagic.io/enterprise/). 

## Dedicated Hosts

If you need specific software and tools available on a builder machine we can provide dedicated macOS host machines which give you 2 VMs. 

Dedicated hosts are available for $449/month, paid annually with **20% discount** comes to **$4,310/year**. 

Annual plans can be paid for with credit card and invoicing with bank transfer is available.

For more information contact us [here](https://codemagic.io/contact/).

### Unity Framework

If you are building Unity apps for iOS or Android we can provide dedicated macOS hosts with Unity 2020.3 LTS Unity 2019.4.15 (Android build support and iOS build support components).

If you would like more information about dedicated hosts, please contact us [here](https://codemagic.io/contact/).
