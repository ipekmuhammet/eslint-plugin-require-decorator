# eslint-plugin-require-decorator

## Installation

```bash
$ npm install --save-dev eslint-plugin-require-decorator
```
or

```bash
$ yarn add -D eslint-plugin-require-decorator
```

## Usage

```json
// .eslintrc
{
  "plugins": ["require-decorator"],
  "rules": {
    "require-decorator/require-decorator": [
      1,
			{
				"classDecorators": [
					"Controller"
				],
				"methodDecorators": [
					"ApiOperation",
					"ApiResponse",
					{
						"oneOfThem": ["Get", "Post", "Put", "Delete", "Patch", "Options", "Head", "All"]
					}
				]
			},
      { // You can define multiple options
        "classDecorators": ["Service"],
        "methodDecorators": ["ServiceDecorator"]
      }
    ]
  }
}
```

```typescript
// any.controller.ts
@Controller("users")
class UserController {
	test!: number;

	constructor(test: number) {
		this.test = test;
	}

	@ApiOperation()
  @Get()
  // Missing decorators; ApiResponse
	private getUserById(
		userId: number
	): void {
		return;
	}

	@ApiOperation()
  @ApiResponse()
  // Require one of them; Get || Post || Put || Delete || Patch || Options || Head || All
	deleteUserById(
		userId: number
	): void {
		return;
	}

  @Put()
  // Missing decorators; ApiOperation, ApiResponse
	async updateUserById(
		userId: number
	): void {
		return;
	}
}
```

## Features

|                                 |  Completed  |
| ------------------------------- | :---------: |
| One of them                     |     ✔️     |
| Validate fields                 |     ❌     |
| Validate async                  |     ❌     |
| Validate access modifiers       |     ❌     |
| Fix (push required decorators)  |     ✔️     |
