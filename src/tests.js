const { RuleTester } = require("@typescript-eslint/experimental-utils/dist/ts-eslint/RuleTester")
const { rules } = require("./index")

const ruleTester = new RuleTester({
	parserOptions: {
		ecmaVersion: 6,
		sourceType: "module",
		ecmaFeatures: {},
	},
	parser: require.resolve("@typescript-eslint/parser"),
})

const validTest = `
@Controller("users")
class UserController {
	test!: number;

	constructor(test: number) {
		this.test = test;
	}

	@ApiOperation()
	@Get()
	private getUserById(
		userId: number
	): void {
		return;
	}

	@ApiOperation()
	@ApiResponse()
	@Delete()
	deleteUserById(
		userId: number
	): void {
		return;
	}

	@Put()
	async updateUserById(
		userId: number
	): void {
		return;
	}
}
`

const invalidTest = `
@Controller("users")
class UserController {
	test!: number;

	constructor(test: number) {
		this.test = test;
	}

	@ApiOperation()
	@Get()
	private getUserById(
		userId: number
	): void {
		return;
	}

	@ApiOperation()
	@ApiResponse()
	deleteUserById(
		userId: number
	): void {
		return;
	}

	@Put()
	async updateUserById(
		userId: number
	): void {
		return;
	}
}
`

ruleTester.run("require-decorator", rules["require-decorator"], {
	valid: [
		{code: validTest}
	],
	invalid: [
		{
			code: invalidTest,
			options: [
				{
					classDecorators: [
						"Controller"
					],
					methodDecorators: [
						"ApiOperation",
						"ApiResponse",
						{
							oneOfThem: ["Get", "Post", "Put", "Delete", "Patch", "Options", "Head", "All"]
						}
					]
				}
			],
			errors: [
				{
					messageId: "method",
					data: {
						method: "getUserById",
						missingDecorators: "ApiResponse"
					}
				},
				{
					messageId: "method",
					data: {
						method: "deleteUserById",
						missingDecorators: "Get || Post || Put || Delete || Patch || Options || Head || All"
					}
				},
				{
					messageId: "method",
					data: {
						method: "updateUserById",
						missingDecorators: "ApiOperation, ApiResponse"
					}
				}
			]
		}
	]
})