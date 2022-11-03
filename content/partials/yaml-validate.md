---
title: Validating codemagic.yaml locally
description: How to enable codemagic.yaml validation in your local IDE
weight: 7
aliases: 
  - /knowledge-base/validate-yaml
  - /yaml/yaml-validate
---

Using the Codemagic JSON schema, you can validate your `codemagic.yaml` for structure and syntax errors right in your IDE. The same level of validation is carried out on the frontend in the YAML editor in your project settings. 

The JSON schema does not validate the maximum build duration value, software version values, credentials, environment variable values, or whether you have access to any paid features.

Codemagic JSON schema is available out of the box in the IDEs integrated with [schemastore.org](http://schemastore.org/), e.g. Android Studio and Visual Studio Code.

If your IDE does not have the Codemagic JSON schema available by default, you can set up validation manually. To do so:

* make sure you have YAML language support in the IDE
* configure the IDE to use the Codemagic JSON schema for validation available at [https://static.codemagic.io/codemagic-schema.json](https://static.codemagic.io/codemagic-schema.json)
