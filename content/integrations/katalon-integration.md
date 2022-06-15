---
title: Katalon integration
description: How to integrate your workflows with Katalon using codemagic.yaml
weight: 10
---

**Katalon** is designed to create and reuse automated test scripts for UI without coding

## Signing up with Kobiton

In order to create a project and retrive API key that are used when uploading test to the Katalon testing environment, you need to sign up with Katalon. You can sign up free [here](https://katalon.com/).


## Jest, Mocha and Jasmine testing

In order to execute **jest**, **mocha** and **jasmine** tests and upload the test results to **Katalon**, you need to go through the following steps:

**Step 1: Install Katalon TestOps plugin**

```
npm i -s @katalon/testops-jest
```

**Step 2**: Create testops-config.json file in the root directory and the add the following in there

```
{
   "apiKey": "YOUR_API_KEY",
   "projectId": "YOUR_PROJECT_ID",
   "reportFolder": "testops-report"
}
```

**Step 3**: Create files accordingly:

For Jest create file named **testops-config.json** and add the following in there:

```
module.exports = {
   "reporters": ["default", "@katalon/testops-jest"]
}
```

For Jest create file named **./tests/setup.js** and add the following in there:

```
import TestOpsJasmineReporter from "@katalon/testops-jasmine";
const reporter = new TestOpsJasmineReporter();
jasmine.getEnv().addReporter(reporter);
```



**Step 4: Run the following commands**:

For Jest:

```
npx jest
```

For Jasmine:

```
npx jasmine
```

For Mocha:

```
npx mocha --reporter @katalon/testops-mocha
```


## Junit reports







## Sample projects

A sample project that shows how to configure Kobiton integration is available [here]()



