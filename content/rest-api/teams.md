---
title: Teams
weight: 4
---

APIs for managing teams are currently available for developers to preview. During the preview period, the API may change without advance notice.

## Retrieve a team

`GET /team/:id`

Based on the team id provided, returns the team information.

### Curl request

```bash
curl -XGET -H "Content-Type: application/json" -H "x-auth-token: <API Token>" 'https://api.codemagic.io/team/<team_id>'
```

## Modify global variables and secrets

Codemagic allows you to fetch and modify global variables and secrets using the REST API. These variables can be manually configured under **Team settings > your team > Global variables and secrets**.

### Fetch variables

`GET /team/:id/variables`

#### Curl request

```
curl -XGET -H 'X-Auth-Token: <API Token>' -H "Content-type: application/json" 'https://api.codemagic.io/team/<team_id>/variables'
```

#### Response

```json
{
  [
      {
          "key": "your variable name",
          "value": "your variable value",
          "group": "your variable group",
          "secure": false,
      },
  ],
}
```

### Add new variable

`POST /team/:id/variables/`

#### Payload

To successfully add a new variable, it is necessary to provide the values for `key`, `value`, `group` and `secure` as JSON data. An example payload:

```json
{
  "key": "your variable name",
  "value": "your variable value",
  "group": "your variable group",
  "secure": true
}
```

Note that the `key` and `group` values have to be strings with a length greater than zero. Furthermore, all added variables are encrypted by default. Set the value of `secure` to `false` in order to not encrypt the newly added variable.

If the group does not exist, it will be created.

#### Curl request

```bash
curl -XPOST -H 'X-Auth-Token: <API Token>' -H "Content-type: application/json" -d '{
    "key": "your variable name",
    "value": "your variable value",
    "group": "your variable group",
    "secure": true
  }' 'https://api.codemagic.io/team/<team_id>/variables'
```

#### Response

```json
{
  [
      {
          "key": "your variable name",
          "value": "Encrypted(...)",
          "group": "your variable group",
          "secure": true,
      },
  ],
}
```

### Update existing variable

`POST /team/:id/variables/:variable_id`

#### Payload

To successfully update a variable, it is necessary to provide the values for `value` and `secure` as JSON data. It is not possible to update the value of the `secure` key on its own.

An example payload:

```json
{
  "value": "your new variable value",
  "secure": false
}
```

Note that the default value for `secure` is `true`. In order to not encrypt the updated variable, set the value to `false`.

#### Curl request

```
curl -XPOST -H 'X-Auth-Token: <API Token>' -H "Content-type: application/json" -d '{
    "value": "your new variable value",
    "secure": false
  }' 'https://api.codemagic.io/apps/<team_id>/variables/<variable_id>'
```

#### Response

```json
{
  [
      {
          "key": "your variable name",
          "value": "your new variable value",
          "group": "your variable group",
          "secure": false,
      },
  ],
}
```

### Remove variable

`DELETE /team/:id/variables/:variable_id`

#### Curl request

```
curl -XDELETE -H 'X-Auth-Token: <API Token>' -H "Content-type: application/json" 'https://api.codemagic.io/team/<team_id>/variables/<variable_id>'
```

#### Response

The response status code of a successful deletion is `204`.
