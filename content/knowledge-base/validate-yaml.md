---
title: Validating codemagic.yaml locally
description:
weight: 7
---

Using the Codemagic JSON schema, you can validate your `codemagic.yaml` for structure and syntax errors right in your IDE. The same level of validation is carried out on the frontend in the YAML editor in your project settings. 

The JSON schema does not validate the maximum build duration value, software version values, credentials, environment variable values or whether you have access to any paid features.

To set up validation, you need:

* YAML language support in the IDE
* To configure the IDE to use the Codemagic JSON schema for validation available at [https://static.codemagic.io/codemagic-schema.json](https://static.codemagic.io/codemagic-schema.json)

## How to set up validation in Visual Studio Code

This is an example of using the Codemagic JSON schema for validating codemagic.yaml in Visual Studio Code.

1. In VS Code, make sure you have installed and enabled an extension for YAML language support, e.g. **redhat.vscode-yaml**.
2. Then navigate to **Code > Preferences > Extensions > Settings > Extensions > YAML**.
3. Scroll to the **Yaml: Schemas** section and click **Edit in settings.json**.
4. Append the follwing snippet to the end of the file:

```yaml
"yaml.schemas": {
"https://static.codemagic.io/codemagic-schema.json": "codemagic.yaml",
```

The full contents of the `settings.json` file should look something like this:

```yaml
{
    "git.confirmSync": false,
    "git.autofetch": true,
    "git.enableSmartCommit": true,
    "workbench.sideBar.location": "left",
    "editor.renderWhitespace": "none",
    "diffEditor.ignoreTrimWhitespace": false,
    "workbench.colorTheme": "Visual Studio Dark",
    "yaml.schemas": {
        "https://static.codemagic.io/codemagic-schema.json": "codemagic.yaml"
    }
}
```

5. Save the changes and reload the window or restart VS Code. Now, whenever you open a `codemagic.yaml`, any detected problems in the file will be underlined and the error message will be displayed on hover.