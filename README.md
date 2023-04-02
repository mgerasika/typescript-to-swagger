## Typescript interface info

### Usage example

```
getInterfaceInfo({ dir: ['./src'] }).then((res) => {
    console.log(JSON.stringify(res.interfaces, null, 2));
});
}
```

### Response

```
[...
	{
		"name": "ICustomerByIdDto",
		"type": "interface",
		"path": "./src/api-admin/model/customer-admin.dto.ts",
		"properties": [
		{
			"name": "hasPasswordAuth",
			"type": "boolean | undefined"
		},
		{
			"name": "customer",
			"type": "ICustomerAdminDto"
		}
		]
	},
...]
```
