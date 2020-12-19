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
        "classDecorators": ["Controller"],
        "methodDecorators": ["ApiOperation", "ApiResponse"]
      }
    ]
  }
}
```

```typescript
@Controller("users")
class UserController {
  test!: number;

  // missing decorators: ApiResponse
  @ApiOperation()
  private getUserById(userId: number): void {
    return;
  }

  @ApiOperation()
  @ApiResponse()
  deleteUserById(userId: number): void {
    return;
  }

  // missing decorators: ApiOperation, ApiResponse
  async updateUserById(userId: number): void {
    return;
  }
}
```

## TODO

- One of them
- Validate fields
- Validate async
- Validate access modifiers
- Fix (push required decorators)
